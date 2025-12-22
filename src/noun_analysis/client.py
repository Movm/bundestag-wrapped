"""MCP Client for bundestag-mcp server.

Parsing logic adapted from Open Discourse project:
https://github.com/open-discourse/open-discourse
"""

import asyncio
import json
import re
from typing import Any

import httpx
from httpx_sse import aconnect_sse


# =============================================================================
# Faction/Party patterns (adapted from Open Discourse)
# =============================================================================

FACTION_PATTERNS = {
    "CDU/CSU": r"(?:Gast|-)?(?:\s*C\s*[DSMU]\s*S?[DU]\s*(?:\s*[/,':!.-]?)*\s*(?:\s*C+\s*[DSs]?\s*[UÙ]?\s*)?)(?:-?Hosp\.|-Gast|1)?",
    "SPD": r"\s*'?S(?:PD|DP)(?:\.|-Gast)?",
    "GRÜNE": r"(?:BÜNDNIS\s*(?:90)?/?(?:\s*D[1I]E)?|Bündnis\s*90/(?:\s*D[1I]E)?)?\s*[GC]R[UÜ].?\s*[ÑN]EN?(?:/Bündnis 90)?|BÜNDNISSES?\s*90/\s*DIE\s*GRÜNEN|Grünen",
    "FDP": r"\s*F\.?\s*[PDO][.']?[DP]\.?",
    "AfD": r"^AfD$|Alternative für Deutschland",
    "DIE LINKE": r"DIE\s*LIN\s?KEN?|LIN\s?KEN|Die Linke",
    "BSW": r"^BSW$|Bündnis Sahra Wagenknecht",
    "fraktionslos": r"(?:fraktionslos|Parteilos|parteilos)",
    "SSW": r"^SSW$",
    # Historical parties (for older protocols)
    "PDS": r"(?:Gruppe\s*der\s*)?PDS(?:/(?:LL|Linke Liste))?",
    "GB/BHE": r"(?:GB[/-]\s*)?BHE(?:-DG)?",
    "DP": r"^DP$",
    "KPD": r"^KPD$",
    "FVP": r"^FVP$",
}

# Academic titles to extract from names (from Open Discourse)
ACADEMIC_TITLES = [
    "Dr", "Prof", "Frau", "D", "-Ing",
    "von", "und", "zu", "van", "de",
    "Baron", "Freiherr", "Freifrau", "Prinz", "Graf",
    "h", "c",  # for "h.c." (honoris causa)
]


def normalize_party(party: str) -> str | None:
    """Normalize party name using regex patterns.

    Uses comprehensive patterns from Open Discourse to handle
    various spellings and OCR errors in historical protocols.
    """
    party = party.strip()

    for normalized, pattern in FACTION_PATTERNS.items():
        if re.search(pattern, party, re.IGNORECASE):
            return normalized

    return None


def clean_text(text: str) -> str:
    """Clean raw protocol text (adapted from Open Discourse).

    Normalizes:
    - Non-breaking spaces (U+00A0) → regular spaces
    - Various dash characters → standard hyphen
    - Multiple whitespace → single space
    - Tabs → spaces
    """
    # Replace non-breaking space with regular space
    text = text.replace('\xa0', ' ')

    # Handle other unicode spaces
    text = re.sub(r'[\u00a0\u2007\u202f\u2060]', ' ', text)

    # Normalize dashes (from Open Discourse clean_text)
    text = text.replace('—', '-')  # em dash
    text = text.replace('–', '-')  # en dash
    # Note: Open Discourse has OCR artifact replacements here,
    # but we skip them as they can cause issues with empty strings

    # Normalize whitespace
    text = re.sub(r'\t+', ' ', text)
    text = re.sub(r'  +', ' ', text)

    return text


def extract_name_parts(name_raw: str) -> dict:
    """Extract name components and academic titles.

    Returns dict with 'first_name', 'last_name', 'acad_title', 'full_name'.
    Adapted from Open Discourse 02_clean_speeches.py.
    """
    # Remove non-alphabetic chars except hyphen and umlauts
    name_clean = re.sub(r"[^a-zA-ZÖÄÜäöüß\-\s]", " ", name_raw)
    name_clean = re.sub(r"  +", " ", name_clean).strip()

    parts = name_clean.split()

    # Extract academic titles
    titles = [p for p in parts if p in ACADEMIC_TITLES]
    name_parts = [p for p in parts if p not in ACADEMIC_TITLES]

    # Determine first and last name
    if len(name_parts) == 0:
        first_name, last_name = "", ""
    elif len(name_parts) == 1:
        first_name, last_name = "", name_parts[0]
    else:
        first_name = " ".join(name_parts[:-1])
        last_name = name_parts[-1]

    return {
        'first_name': first_name,
        'last_name': last_name,
        'acad_title': " ".join(titles) if titles else None,
        'full_name': name_raw.strip(),
    }


def strip_parenthetical_content(text: str) -> str:
    """Remove parenthetical content from speech text.

    This strips out:
    - Zwischenrufe: (Zuruf von der CDU/CSU: ...)
    - Named interruptions: (Stephan Brandner [AfD]: ...)
    - Applause: (Beifall bei der AfD)
    - Laughter: (Heiterkeit bei der SPD)
    - Other reactions: (Lachen ...), (Widerspruch ...)

    These are NOT the speaker's own words and should not be counted
    in word frequency analysis.
    """
    # Remove all parenthetical content
    # Use non-greedy match to handle nested parens correctly
    cleaned = re.sub(r'\([^)]+\)', '', text)
    # Clean up extra whitespace
    cleaned = re.sub(r'\s+', ' ', cleaned)
    return cleaned.strip()


def classify_speech_type(context: str) -> str:
    """Classify speech introduction type from preceding context.

    Looks at the text BEFORE a speaker's name to determine if this is
    a formal speech (Rede) or an intervention (Zwischenfrage, question time, etc.).

    Returns one of:
        - 'formal': Real Rede with "Wort erteilen" pattern
        - 'question': Fragestunde/Nachfrage question time
        - 'fragestunde': Fragestunde/Regierungsbefragung session
        - 'zwischenfrage': Intermediate question during speech
        - 'kurzintervention': Short intervention
        - 'continuation': End-of-speech continuation (not a new speech)
        - 'other': Cannot classify
    """
    # EXCLUDE: End-of-speech interruptions (continuation, not new speech)
    end_patterns = [
        r'Zeit ist abgelaufen',
        r'Redezeit ist abgelaufen',
        r'kommen Sie.*zum Ende',
        r'zum Ende.*Rede',
        r'müssen zum Ende',
        r'bitte zum Schluss',
    ]
    for p in end_patterns:
        if re.search(p, context, re.IGNORECASE):
            return 'continuation'

    # Intervention patterns (not formal speeches)
    if 'Kurzintervention' in context:
        return 'kurzintervention'
    if 'Zwischenfrage' in context or 'Gelegenheit, zu antworten' in context:
        return 'zwischenfrage'
    if re.search(r'[Ll]assen Sie.*zu\?|[Gg]estatten Sie|[Ee]rlauben Sie', context):
        return 'zwischenfrage'
    if 'Nachfrage' in context or 'Fragesteller' in context or 'weitere Frage' in context:
        return 'question'
    if 'Regierungsbefragung' in context or 'Fragestunde' in context:
        return 'fragestunde'

    # Formal speech patterns (real Reden)
    formal_patterns = [
        r'eröffne.*Aussprache',
        r'erteile.*(?:das\s+)?Wort',
        r'Das Wort hat',
        r'hat (?:jetzt |nun )?(?:das )?Wort',
        r'das Wort geben',
        r'darf ich aufrufen',
        r'[Nn]ächste[rn]?\s+Rede',
        r'[Nn]ächste[rn]?\s+Redner',
        r'rufe.*auf',
        r'bitte.*ans Mikrofon',
        r'erste Rede',
        r'spricht.*(?:Kolleg|Abgeordnet)',
        r'Für die.*Fraktion (?:hat|spricht)',
    ]
    for p in formal_patterns:
        if re.search(p, context):
            return 'formal'

    return 'other'


def extract_parties_from_applause(text: str) -> list[str]:
    """Extract individual party names from applause/heckle text.

    Bundestag protocols contain complex applause annotations like:
    - "(Beifall bei der CDU/CSU sowie bei Abgeordneten der SPD)"
    - "(Beifall bei der AfD und der CDU/CSU)"
    - "(Zuruf des Abg. Dr. Ralf Stegner [SPD])"

    This function parses these and returns normalized party names.

    Args:
        text: The captured applause/heckle text (without parentheses)

    Returns:
        List of normalized party names, e.g. ["CDU/CSU", "SPD"]
    """
    # Strip content after colon (heckle content like "AfD: Oh!")
    text = re.sub(r':\s*[^,)]+', '', text)

    # Split by common separators: "sowie", "und", en-dash, comma
    parts = re.split(r'\s+(?:sowie|und|–|,)\s+', text)

    parties = []
    for part in parts:
        part = part.strip()

        # Try direct normalization first
        party = normalize_party(part)
        if party:
            parties.append(party)
            continue

        # Try extracting from phrases like "bei Abgeordneten der SPD"
        # or "des Abg. Dr. Ralf Stegner [SPD]"
        bracket_match = re.search(r'\[([^\]]+)\]', part)
        if bracket_match:
            party = normalize_party(bracket_match.group(1))
            if party:
                parties.append(party)
                continue

        # Try "der/dem/des PARTY" pattern
        article_match = re.search(r'(?:der|dem|des|bei)\s+(\S+)', part)
        if article_match:
            party = normalize_party(article_match.group(1))
            if party:
                parties.append(party)

    return parties


def parse_speeches_from_protocol(text: str) -> list[dict]:
    """Parse individual speeches from a Plenarprotokoll full text.

    Returns list of dicts with 'speaker', 'party', 'text', and optional
    'first_name', 'last_name', 'acad_title' keys.

    Uses both regular speaker lines "Name (Party):" AND president lines
    "Vizepräsident Name:" as speech boundaries to avoid merging procedural
    text into speaker speeches.

    Speech text is cleaned to remove parenthetical content (Zwischenrufe,
    Beifall, etc.) which are not the speaker's own words.

    Parsing logic adapted from Open Discourse project.
    """
    # Clean text first (NBSP, dashes, whitespace normalization)
    text = clean_text(text)

    speeches = []

    # Pattern for regular speakers: "Name (Party):"
    speaker_pattern = re.compile(r'\n([A-ZÄÖÜ][^(\n:]{2,60})\s*\(([^)]+)\):\s*\n')

    # Pattern for presiding officers (no party affiliation)
    # Adapted from Open Discourse: Präsident, Vizepräsident, Alterspräsident,
    # Bundeskanzler, Bundesminister, etc.
    president_pattern = re.compile(
        r'\n(Vizepräsident(?:in)?|Präsident(?:in)?|Alterspräsident(?:in)?|'
        r'Bundespräsident(?:in)?|Bundeskanzler(?:in)?)\s+'
        r'([A-ZÄÖÜ][^:\n]{2,40}):\s*\n'
    )

    # Find all boundaries (both types)
    boundaries = []

    for m in speaker_pattern.finditer(text):
        boundaries.append({
            'start': m.start(),
            'end': m.end(),
            'speaker': m.group(1).strip(),
            'party': m.group(2).strip(),
            'is_president': False
        })

    for m in president_pattern.finditer(text):
        boundaries.append({
            'start': m.start(),
            'end': m.end(),
            'speaker': f"{m.group(1)} {m.group(2).strip()}",
            'party': None,
            'is_president': True
        })

    # Sort by position in text
    boundaries.sort(key=lambda x: x['start'])

    # Extract speech text between boundaries
    for i, boundary in enumerate(boundaries):
        # Skip president speeches - we only use them as boundaries
        if boundary['is_president']:
            continue

        # Text starts after this boundary's header
        text_start = boundary['end']

        # Text ends at start of next boundary (or end of document)
        if i + 1 < len(boundaries):
            text_end = boundaries[i + 1]['start']
        else:
            text_end = len(text)

        speech_text = text[text_start:text_end].strip()

        # Remove parenthetical content (Zwischenrufe, Beifall, etc.)
        speech_text = strip_parenthetical_content(speech_text)

        # Skip very short speeches (under 50 chars likely procedural)
        if len(speech_text) < 50:
            continue

        party = normalize_party(boundary['party'])
        if party:
            # Classify speech type from preceding context (400 chars before speaker)
            context_start = max(0, boundary['start'] - 400)
            context = text[context_start:boundary['start']]
            speech_type = classify_speech_type(context)
            word_count = len(speech_text.split())

            # Filter: only include formal speeches OR substantial unknowns (500+ words)
            # This filters out Zwischenfragen, Kurzinterventionen, question time, etc.
            if speech_type != 'formal' and not (speech_type == 'other' and word_count >= 500):
                continue

            # Extract name components (Dr., first name, last name)
            name_parts = extract_name_parts(boundary['speaker'])

            speeches.append({
                'speaker': boundary['speaker'],
                'party': party,
                'text': speech_text,
                'type': speech_type,
                'words': word_count,
                'first_name': name_parts['first_name'],
                'last_name': name_parts['last_name'],
                'acad_title': name_parts['acad_title'],
            })

    return speeches


class BundestagMCPClient:
    """Client to interact with bundestag-mcp server via MCP protocol."""

    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url.rstrip("/")
        self.session_id: str | None = None
        self._client: httpx.AsyncClient | None = None

    async def __aenter__(self):
        self._client = httpx.AsyncClient(timeout=120.0)
        await self._initialize_session()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self._client:
            await self._client.aclose()

    async def _initialize_session(self) -> None:
        """Initialize MCP session with the server."""
        init_request = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {"name": "noun-analysis", "version": "0.1.0"},
            },
        }

        response = await self._client.post(
            f"{self.base_url}/mcp",
            json=init_request,
            headers={"Content-Type": "application/json", "Accept": "application/json, text/event-stream"},
        )
        response.raise_for_status()

        self.session_id = response.headers.get("mcp-session-id")

        if "text/event-stream" in response.headers.get("content-type", ""):
            async for line in response.aiter_lines():
                if line.startswith("data:"):
                    data = json.loads(line[5:].strip())
                    if "result" in data:
                        break
        else:
            data = response.json()

        await self._send_initialized()

    async def _send_initialized(self) -> None:
        """Send initialized notification."""
        notification = {
            "jsonrpc": "2.0",
            "method": "notifications/initialized",
        }
        headers = {"Content-Type": "application/json"}
        if self.session_id:
            headers["mcp-session-id"] = self.session_id

        await self._client.post(f"{self.base_url}/mcp", json=notification, headers=headers)

    async def call_tool(self, name: str, arguments: dict[str, Any] = None) -> Any:
        """Call an MCP tool and return the result."""
        request = {
            "jsonrpc": "2.0",
            "id": 2,
            "method": "tools/call",
            "params": {"name": name, "arguments": arguments or {}},
        }
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
        }
        if self.session_id:
            headers["mcp-session-id"] = self.session_id

        # Retry logic for transient errors
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = await self._client.post(f"{self.base_url}/mcp", json=request, headers=headers)
                response.raise_for_status()
                break
            except (httpx.ReadError, httpx.ConnectError, httpx.TimeoutException) as e:
                if attempt == max_retries - 1:
                    raise
                await asyncio.sleep(2 ** attempt)  # Exponential backoff

        if "text/event-stream" in response.headers.get("content-type", ""):
            async for line in response.aiter_lines():
                if line.startswith("data:"):
                    data = json.loads(line[5:].strip())
                    if "result" in data:
                        return self._parse_tool_result(data["result"])
        else:
            data = response.json()
            if "result" in data:
                return self._parse_tool_result(data["result"])

        return None

    def _parse_tool_result(self, result: dict) -> Any:
        """Parse MCP tool result content."""
        if "content" in result and isinstance(result["content"], list):
            for item in result["content"]:
                if item.get("type") == "text":
                    try:
                        return json.loads(item["text"])
                    except json.JSONDecodeError:
                        return item["text"]
        return result

    async def search_speeches(
        self,
        query: str = "",
        limit: int = 100,
        party: str | None = None,
        wahlperiode: int | None = None,
        score_threshold: float = 0.0,
    ) -> list[dict]:
        """Search for speeches using bundestag_search_speeches tool."""
        args = {"query": query, "limit": limit}
        if party:
            args["party"] = party
        if wahlperiode:
            args["wahlperiode"] = wahlperiode
        if score_threshold:
            args["scoreThreshold"] = score_threshold

        result = await self.call_tool("bundestag_search_speeches", args)

        if isinstance(result, dict) and "results" in result:
            return result["results"]
        return result if isinstance(result, list) else []

    async def get_all_speeches_by_party(
        self,
        party: str,
        wahlperiode: int = 20,
        batch_size: int = 100,
        max_speeches: int | None = None,
    ) -> list[dict]:
        """Fetch all speeches for a party (legacy method using chunked search)."""
        all_speeches = []
        offset = 0

        while True:
            speeches = await self.search_speeches(
                query="",
                limit=batch_size,
                party=party,
                wahlperiode=wahlperiode,
            )

            if not speeches:
                break

            all_speeches.extend(speeches)

            if max_speeches and len(all_speeches) >= max_speeches:
                all_speeches = all_speeches[:max_speeches]
                break

            if len(speeches) < batch_size:
                break

            offset += batch_size
            await asyncio.sleep(0.1)

        return all_speeches

    async def search_plenarprotokolle(
        self,
        wahlperiode: int = 20,
        limit: int = 100,
        cursor: str | None = None,
    ) -> dict:
        """Search for Plenarprotokolle.

        Returns dict with 'results', 'cursor', 'hasMore' keys.
        """
        args = {
            "wahlperiode": wahlperiode,
            "limit": limit,
        }
        if cursor:
            args["cursor"] = cursor

        result = await self.call_tool("bundestag_search_plenarprotokolle", args)

        if isinstance(result, dict):
            return {
                "results": result.get("results", []),
                "cursor": result.get("cursor"),
                "hasMore": result.get("hasMore", False),
                "totalResults": result.get("totalResults", 0),
            }
        return {"results": [], "cursor": None, "hasMore": False, "totalResults": 0}

    async def get_plenarprotokoll(
        self,
        protocol_id: int,
        include_full_text: bool = True,
    ) -> dict | None:
        """Get a single Plenarprotokoll by ID.

        Args:
            protocol_id: The numeric ID of the protocol
            include_full_text: Whether to include the full text

        Returns:
            Dict with protocol data and optionally 'fullText' key
        """
        result = await self.call_tool("bundestag_get_plenarprotokoll", {
            "id": protocol_id,
            "includeFullText": include_full_text,
        })

        if isinstance(result, dict) and result.get("success"):
            return {
                "data": result.get("data", {}),
                "fullText": result.get("fullText", ""),
            }
        return None

    async def get_all_protocol_ids(
        self,
        wahlperiode: int = 20,
        herausgeber: str = "BT",
        max_protocols: int = 0,
        progress_callback=None,
    ) -> list[dict]:
        """Fetch all protocol metadata using cursor pagination.

        Args:
            wahlperiode: Legislative period
            herausgeber: Publisher filter ('BT' for Bundestag)
            max_protocols: Maximum protocols to fetch (0 = all)
            progress_callback: Optional callback(count, message)

        Returns:
            List of protocol metadata dicts with 'id', 'dokumentnummer', etc.
        """
        all_protocols = []
        cursor = None
        page = 0
        empty_pages = 0

        while True:
            page += 1
            print(f"  Fetching protocol list page {page} ({len(all_protocols)} protocols so far)...", flush=True)
            if progress_callback:
                progress_callback(len(all_protocols), f"Fetching protocol list (page {page})...")

            result = await self.search_plenarprotokolle(
                wahlperiode=wahlperiode,
                limit=100,
                cursor=cursor,
            )

            protocols = [p for p in result.get("results", []) if p.get("herausgeber") == herausgeber]

            if not protocols:
                empty_pages += 1
                if empty_pages >= 3:
                    print(f"  No more {herausgeber} protocols found after {page} pages.", flush=True)
                    break
            else:
                empty_pages = 0
                all_protocols.extend(protocols)

            if max_protocols > 0 and len(all_protocols) >= max_protocols:
                return all_protocols[:max_protocols]

            cursor = result.get("cursor")
            if not cursor or not result.get("hasMore", False):
                break

        return all_protocols

    async def get_speeches_from_protocols(
        self,
        wahlperiode: int = 20,
        max_protocols: int = 10,
        herausgeber: str = "BT",
        progress_callback=None,
        batch_size: int = 10,
    ) -> dict[str, list[dict]]:
        """Fetch speeches from Plenarprotokolle, grouped by party.

        Args:
            wahlperiode: Legislative period (default 20)
            max_protocols: Maximum number of protocols to fetch (0 = all)
            herausgeber: Publisher filter ('BT' for Bundestag, 'BR' for Bundesrat)
            progress_callback: Optional callback(current, total, protocol_name)
            batch_size: Number of protocols to fetch concurrently

        Returns:
            Dict mapping party names to lists of speech dicts
        """
        speeches_by_party: dict[str, list[dict]] = {}

        # Get all protocol IDs with proper pagination
        protocols = await self.get_all_protocol_ids(
            wahlperiode=wahlperiode,
            herausgeber=herausgeber,
            max_protocols=max_protocols,
            progress_callback=lambda count, msg: progress_callback(count, 0, msg) if progress_callback else None,
        )

        total = len(protocols)
        completed = 0

        # Process in batches for concurrent fetching
        for batch_start in range(0, total, batch_size):
            batch = protocols[batch_start:batch_start + batch_size]

            # Fetch batch concurrently
            async def fetch_one(protocol):
                protocol_id = protocol.get("id")
                if not protocol_id:
                    return None
                return await self.get_plenarprotokoll(int(protocol_id))

            results = await asyncio.gather(*[fetch_one(p) for p in batch])

            # Process results
            for protocol, full_protocol in zip(batch, results):
                completed += 1
                doc_nr = protocol.get("dokumentnummer", "?")

                if progress_callback:
                    progress_callback(completed, total, doc_nr)

                if not full_protocol:
                    continue

                full_text = full_protocol.get("fullText", "")
                if not full_text:
                    continue

                # Parse speeches from protocol
                speeches = parse_speeches_from_protocol(full_text)

                # Group by party
                for speech in speeches:
                    party = speech["party"]
                    if party not in speeches_by_party:
                        speeches_by_party[party] = []
                    speeches_by_party[party].append(speech)

        return speeches_by_party


async def test_connection(base_url: str = "http://localhost:3000") -> bool:
    """Test connection to the MCP server."""
    try:
        async with BundestagMCPClient(base_url) as client:
            # Try to search for protocols (doesn't require indexed data)
            result = await client.search_plenarprotokolle(limit=1)
            return result.get("totalResults", 0) > 0
    except Exception as e:
        print(f"Connection failed: {e}")
        return False
