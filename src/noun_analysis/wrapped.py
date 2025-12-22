"""Bundestag Wrapped 2025 - Year in review analysis."""

from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path
import json
import random
import re

import pandas as pd

# Import shared functions from client.py (avoid code duplication)
from noun_analysis.client import (
    normalize_party,
    strip_parenthetical_content,
    classify_speech_type,
    extract_parties_from_applause,
)

# Regex patterns for parsing parliamentary annotations (specific to wrapped)
INTERRUPTER_PATTERN = re.compile(
    r'\(([A-ZÄÖÜ][^\[\]]{2,40})\s*\[([A-ZÄÖÜa-zäöü/\s]+)\]:[^)]+\)'
)
APPLAUSE_PATTERN = re.compile(
    r'\(Beifall bei (?:der |dem )?([^)]+)\)'
)
HECKLE_PATTERN = re.compile(
    r'\(Zurufe? (?:von der |vom |der )?([^)]+)\)'
)


def _normalize_name_for_comparison(name: str) -> str:
    """Extract lastname for self-interruption detection."""
    cleaned = name.replace("Dr.", "").replace("Prof.", "").strip()
    parts = cleaned.split()
    return parts[-1].lower() if parts else ""


def classify_speeches_from_protocols(data_dir: Path) -> dict:
    """Load protocols and classify all speeches by type.

    Returns dict with:
        - speaker_stats: {party: Counter(speaker -> count)} for real speeches only
        - real_speech_counts: {party: count} of real speeches per party
        - all_speeches: list of classified speech dicts
    """
    protocols_dir = data_dir / "protocols"
    if not protocols_dir.exists():
        return {"speaker_stats": {}, "real_speech_counts": {}, "all_speeches": []}

    # Pattern for regular speakers: "Name (Party):"
    speaker_pattern = re.compile(r'\n([A-ZÄÖÜ][^(\n:]{2,60})\s*\(([^)]+)\):\s*\n')
    # Pattern for president/vice-president (no party): "Präsidentin Name:" or "Vizepräsident Name:"
    # Note: "Vizepräsident" has lowercase 'p', "Präsidentin" has uppercase
    president_pattern = re.compile(r'\n(Vizepräsident(?:in)?|Präsident(?:in)?)\s+([A-ZÄÖÜ][^:]{2,40}):\s*\n')

    all_speeches = []

    for protocol_file in protocols_dir.glob("*.json"):
        with open(protocol_file) as f:
            protocol = json.load(f)

        full_text = protocol.get("fullText", "")
        if not full_text or not isinstance(full_text, str):
            continue

        # Find all speech boundaries (both regular speakers AND president announcements)
        speaker_matches = [(m.start(), m.end(), m.group(1).strip(), m.group(2).strip(), 'speaker')
                          for m in speaker_pattern.finditer(full_text)]
        president_matches = [(m.start(), m.end(), m.group(1).strip(), m.group(2).strip(), 'president')
                            for m in president_pattern.finditer(full_text)]

        # Combine and sort by position
        all_boundaries = sorted(speaker_matches + president_matches, key=lambda x: x[0])

        for i, (start_pos, end_pos, role_or_name, party_or_name, boundary_type) in enumerate(all_boundaries):
            # Skip president/vice-president entries (they're just boundaries)
            if boundary_type == 'president':
                continue

            speaker = role_or_name
            raw_party = party_or_name

            # Skip if it's actually a president entry that slipped through
            if 'Präsident' in speaker or 'Vizepräsident' in speaker:
                continue
            if 'Tagesordnung' in speaker:
                continue

            party = normalize_party(raw_party)
            if not party:
                continue

            # Get speech text - ends at NEXT boundary (whether speaker or president)
            if i + 1 < len(all_boundaries):
                text_end = all_boundaries[i + 1][0]
            else:
                text_end = len(full_text)

            speech_text = full_text[end_pos:text_end].strip()
            # Strip parenthetical content (Zwischenrufe, Beifall) for accurate word count
            clean_text = strip_parenthetical_content(speech_text)
            word_count = len(clean_text.split())

            # Classify based on preceding context
            context = full_text[max(0, start_pos - 400):start_pos]
            speech_type = classify_speech_type(context)

            all_speeches.append({
                'speaker': speaker,
                'party': party,
                'type': speech_type,
                'words': word_count,
                'text': speech_text,
            })

    # Aggregate stats - track formal speeches and question time separately
    speaker_stats = {}  # formal speeches only (for backwards compat)
    formal_speaker_stats = {}  # formal speeches
    question_speaker_stats = {}  # question time (question + fragestunde)
    real_speech_counts = {}

    for speech in all_speeches:
        party = speech['party']
        speaker = speech['speaker']
        speech_type = speech['type']

        if party not in speaker_stats:
            speaker_stats[party] = Counter()
            formal_speaker_stats[party] = Counter()
            question_speaker_stats[party] = Counter()
            real_speech_counts[party] = 0

        # Formal speeches: 'formal' type or substantial 'other' (500+ words)
        if speech_type == 'formal' or (speech_type == 'other' and speech['words'] >= 500):
            speaker_stats[party][speaker] += 1
            formal_speaker_stats[party][speaker] += 1
            real_speech_counts[party] += 1

        # Question time: 'question' and 'fragestunde' types
        if speech_type in ('question', 'fragestunde'):
            question_speaker_stats[party][speaker] += 1

    return {
        "speaker_stats": speaker_stats,
        "formal_speaker_stats": formal_speaker_stats,
        "question_speaker_stats": question_speaker_stats,
        "real_speech_counts": real_speech_counts,
        "all_speeches": all_speeches,
    }
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text

PARTY_COLORS = {
    "SPD": "red",
    "CDU/CSU": "bright_black",
    "GRÜNE": "green",
    "AfD": "blue",
    "fraktionslos": "white",
    "FDP": "yellow",
    "DIE LINKE": "magenta",
    "BSW": "cyan",
}

PARTY_EMOJI = {
    "SPD": ":red_circle:",
    "CDU/CSU": ":black_circle:",
    "GRÜNE": ":green_circle:",
    "AfD": ":blue_circle:",
    "fraktionslos": ":white_circle:",
}


@dataclass
class WrappedData:
    """Container for all wrapped analysis data."""

    metadata: dict
    party_stats: dict
    top_words: dict
    speaker_stats: dict = field(default_factory=dict)  # formal speeches (backwards compat)
    question_speaker_stats: dict = field(default_factory=dict)  # question time speakers
    word_frequencies: dict = field(default_factory=dict)
    drama_stats: dict = field(default_factory=dict)
    all_speeches: list = field(default_factory=list)  # For detailed stats
    speeches_by_party: dict = field(default_factory=dict)  # Grouped speeches
    tone_data: dict = field(default_factory=dict)  # {party: ToneScores dict}
    category_data: dict = field(default_factory=dict)  # {party: CategoryCounts dict}

    @classmethod
    def load(cls, results_dir: Path, data_dir: Path) -> "WrappedData":
        """Load all data needed for wrapped analysis."""
        results_dir = Path(results_dir)
        data_dir = Path(data_dir)

        # Load full_data.json
        full_data_path = results_dir / "full_data.json"
        with open(full_data_path) as f:
            full_data = json.load(f)

        metadata = full_data["metadata"]

        # Build party_stats, top_words, and tone data from results
        party_stats = {}
        top_words = {}
        tone_data = {}
        category_data = {}
        for result in full_data["results"]:
            party = result["party"]
            party_stats[party] = {
                "speeches": result["speech_count"],
                "total_words": result["total_words"],
                "total_nouns": result["total_nouns"],
                "total_adjectives": result["total_adjectives"],
                "total_verbs": result["total_verbs"],
                "unique_nouns": len(result["top_nouns"]),
            }
            top_words[party] = {
                "nouns": result["top_nouns"],
                "adjectives": result["top_adjectives"],
                "verbs": result["top_verbs"],
            }
            # Load tone scores and category data if available
            if "tone_scores" in result:
                tone_data[party] = result["tone_scores"]
            if "categories" in result:
                category_data[party] = result["categories"]

        # Load and classify speeches from protocol files
        # Uses context-based classification to distinguish real speeches from interruptions
        classified = classify_speeches_from_protocols(data_dir)
        speaker_stats = classified["speaker_stats"]
        question_speaker_stats = classified["question_speaker_stats"]
        real_speech_counts = classified["real_speech_counts"]
        all_speeches = classified["all_speeches"]

        # Override party_stats speech counts with classified real speech counts
        for party in party_stats:
            if party in real_speech_counts:
                party_stats[party]["real_speeches"] = real_speech_counts[party]

        # Store all speeches for drama parsing
        speeches_by_party = {}
        for speech in all_speeches:
            party = speech['party']
            if party not in speeches_by_party:
                speeches_by_party[party] = []
            speeches_by_party[party].append(speech)

        # Load speeches.json for detailed statistics (word counts, academic titles)
        speeches_json_path = data_dir / "speeches.json"
        detailed_speeches = []
        if speeches_json_path.exists():
            with open(speeches_json_path) as f:
                speeches_json = json.load(f)
            for party_name, speeches_list in speeches_json.items():
                for s in speeches_list:
                    detailed_speeches.append({**s, 'party': party_name})

            # Calculate detailed stats per party
            for party_name in party_stats:
                party_speeches = [s for s in detailed_speeches if s.get('party') == party_name]
                if party_speeches:
                    word_counts = [s.get('words', 0) for s in party_speeches]
                    dr_count = sum(1 for s in party_speeches if s.get('acad_title'))
                    party_stats[party_name].update({
                        "min_words": min(word_counts) if word_counts else 0,
                        "max_words": max(word_counts) if word_counts else 0,
                        "avg_words": sum(word_counts) / len(word_counts) if word_counts else 0,
                        "dr_count": dr_count,
                        "dr_ratio": dr_count / len(party_speeches) if party_speeches else 0,
                    })

        # Load word frequencies from CSVs
        word_frequencies = {}
        for word_type in ["nouns", "adjectives", "verbs"]:
            csv_path = results_dir / f"{word_type}.csv"
            if csv_path.exists():
                df = pd.read_csv(csv_path)
                word_frequencies[word_type] = df

        # Parse drama stats from speeches
        drama_stats = {
            "interrupters": Counter(),  # speaker -> count of times they interrupted
            "interrupted": Counter(),   # speaker -> count of interruptions in their speech
            "applause_by_party": Counter(),  # party -> applause count
            "heckles_by_party": Counter(),   # party -> heckle count
        }

        for party, speeches in speeches_by_party.items():
            for speech in speeches:
                text = speech.get("text", "")
                speaker = speech.get("speaker", "")

                # Count interruptions in this speech (who interrupted)
                speaker_lastname = _normalize_name_for_comparison(speaker)
                for match in INTERRUPTER_PATTERN.finditer(text):
                    interrupter_name = match.group(1).strip()
                    interrupter_party = match.group(2).strip()

                    # Skip noise patterns (Beifall, Zuruf mixed with names)
                    if any(x in interrupter_name for x in ["Beifall", "Zuruf", "Lachen", "Heiterkeit"]):
                        continue

                    # Skip self-interruptions (speaker responding to heckles in their own speech)
                    interrupter_lastname = _normalize_name_for_comparison(interrupter_name)
                    if speaker_lastname == interrupter_lastname:
                        continue

                    drama_stats["interrupters"][(interrupter_name, interrupter_party)] += 1
                    drama_stats["interrupted"][(speaker, party)] += 1

                # Count applause events - split multi-party applause
                for match in APPLAUSE_PATTERN.finditer(text):
                    applause_text = match.group(1).strip()
                    parties = extract_parties_from_applause(applause_text)
                    for applause_party in parties:
                        drama_stats["applause_by_party"][applause_party] += 1

                # Count heckles - split multi-party heckles
                for match in HECKLE_PATTERN.finditer(text):
                    heckle_text = match.group(1).strip()
                    parties = extract_parties_from_applause(heckle_text)
                    for heckle_party in parties:
                        drama_stats["heckles_by_party"][heckle_party] += 1

        return cls(
            metadata=metadata,
            party_stats=party_stats,
            top_words=top_words,
            speaker_stats=speaker_stats,
            question_speaker_stats=question_speaker_stats,
            word_frequencies=word_frequencies,
            drama_stats=drama_stats,
            all_speeches=detailed_speeches,
            speeches_by_party=speeches_by_party,
            tone_data=tone_data,
            category_data=category_data,
        )

    def get_distinctive_words(
        self, party: str, word_type: str = "nouns", top_n: int = 5
    ) -> list[tuple[str, float]]:
        """Find words distinctive to this party (high relative frequency)."""
        if word_type not in self.word_frequencies:
            return []

        df = self.word_frequencies[word_type]
        party_col = f"{party}_per1000"

        if party_col not in df.columns:
            return []

        other_parties = [p for p in self.metadata["parties"] if p != party]
        other_cols = [f"{p}_per1000" for p in other_parties if f"{p}_per1000" in df.columns]

        if not other_cols:
            return []

        # Calculate average of other parties
        df = df.copy()
        df["others_avg"] = df[other_cols].mean(axis=1)
        df["ratio"] = df[party_col] / (df["others_avg"] + 0.001)

        # Filter: meaningful frequency and high ratio
        distinctive = df[(df[party_col] > 0.1) & (df["ratio"] > 1.5)]
        distinctive = distinctive.nlargest(top_n, "ratio")

        return [(row["word"], row["ratio"]) for _, row in distinctive.iterrows()]

    def get_key_topics(
        self, party: str, word_type: str = "nouns", top_n: int = 10
    ) -> list[tuple[str, int, float]]:
        """Find words that are both frequent AND distinctive.

        Combines two metrics:
        - Frequency: word must be in party's top 100 by count
        - Distinctiveness: ratio vs other parties must be > 2.0

        Returns: [(word, count, ratio), ...]
        """
        if word_type not in self.word_frequencies:
            return []

        df = self.word_frequencies[word_type]
        party_count_col = f"{party}_count"
        party_freq_col = f"{party}_per1000"

        if party_count_col not in df.columns:
            return []

        other_parties = [p for p in self.metadata["parties"] if p != party]
        other_cols = [f"{p}_per1000" for p in other_parties if f"{p}_per1000" in df.columns]

        if not other_cols:
            return []

        df = df.copy()
        df["others_avg"] = df[other_cols].mean(axis=1)
        df["ratio"] = df[party_freq_col] / (df["others_avg"] + 0.001)

        # Filter: top 100 by count AND ratio > 2.0
        top_100 = df.nlargest(100, party_count_col)
        key_topics = top_100[top_100["ratio"] > 2.0]
        key_topics = key_topics.nlargest(top_n * 2, "ratio")  # Get extra for filtering

        results = [
            (row["word"], int(row[party_count_col]), row["ratio"])
            for _, row in key_topics.iterrows()
        ]

        # Filter out substring duplicates (e.g., "merz" when "friedrich merz" exists)
        # Keep the more specific (longer) version
        filtered = []
        words_added = set()
        for word, count, ratio in results:
            # Check if this word is a substring of an already added word
            is_substring = any(word in added and word != added for added in words_added)
            # Check if an already added word is a substring of this word
            supersedes = [added for added in words_added if added in word and added != word]

            if is_substring:
                continue  # Skip, we already have the full name
            if supersedes:
                # Remove the shorter version, add this longer one
                filtered = [(w, c, r) for w, c, r in filtered if w not in supersedes]
                words_added -= set(supersedes)

            filtered.append((word, count, ratio))
            words_added.add(word)

            if len(filtered) >= top_n:
                break

        return filtered[:top_n]

    def get_communication_style(self, party: str) -> dict:
        """Calculate style metrics for a party."""
        stats = self.party_stats.get(party, {})
        if not stats:
            return {}

        total_words = stats.get("total_words", 1)
        speeches = stats.get("speeches", 1)

        return {
            "avg_speech_length": total_words / speeches,
            "vocabulary_richness": stats.get("unique_nouns", 0) / max(stats.get("total_nouns", 1), 1),
            "descriptiveness": stats.get("total_adjectives", 0) / max(stats.get("total_nouns", 1), 1),
            "action_orientation": stats.get("total_verbs", 0) / max(stats.get("total_nouns", 1), 1),
        }

    def get_top_speakers(self, n: int = 10) -> list[tuple[str, str, int]]:
        """Get top N speakers across all parties (formal speeches only)."""
        all_speakers = []
        for party, counts in self.speaker_stats.items():
            for speaker, count in counts.items():
                all_speakers.append((speaker, party, count))

        all_speakers.sort(key=lambda x: x[2], reverse=True)
        return all_speakers[:n]

    def get_formal_speakers(self, n: int = 10) -> list[tuple[str, str, int]]:
        """Get top N formal speech speakers (same as get_top_speakers)."""
        return self.get_top_speakers(n)

    def get_question_time_speakers(self, n: int = 10) -> list[tuple[str, str, int]]:
        """Get top N question time participants."""
        all_speakers = []
        for party, counts in self.question_speaker_stats.items():
            for speaker, count in counts.items():
                all_speakers.append((speaker, party, count))

        all_speakers.sort(key=lambda x: x[2], reverse=True)
        return all_speakers[:n]

    def get_party_champion(self, party: str) -> tuple[str, int] | None:
        """Get the most active speaker for a party."""
        if party not in self.speaker_stats:
            return None
        counts = self.speaker_stats[party]
        if not counts:
            return None
        speaker, count = counts.most_common(1)[0]
        return (speaker, count)

    def get_hot_topics(self, n: int = 10) -> list[str]:
        """Get words that are top across multiple parties."""
        word_party_count: Counter = Counter()

        for party in self.metadata["parties"]:
            if party not in self.top_words:
                continue
            top_50 = [w for w, _ in self.top_words[party]["nouns"][:50]]
            for word in top_50:
                word_party_count[word] += 1

        # Filter to words discussed by 3+ parties
        hot = [(w, c) for w, c in word_party_count.items() if c >= 3]
        hot.sort(key=lambda x: x[1], reverse=True)

        return [w for w, _ in hot[:n]]

    def get_unique_speaker_count(self) -> int:
        """Get total number of unique speakers."""
        all_speakers = set()
        for counts in self.speaker_stats.values():
            all_speakers.update(counts.keys())
        return len(all_speakers)

    def get_top_interrupters(self, n: int = 10) -> list[tuple[str, str, int]]:
        """Get speakers who interrupt the most."""
        interrupters = self.drama_stats.get("interrupters", Counter())
        top = interrupters.most_common(n)
        return [(name, party, count) for (name, party), count in top]

    def get_most_interrupted(self, n: int = 10) -> list[tuple[str, str, int]]:
        """Get speakers who get interrupted the most."""
        interrupted = self.drama_stats.get("interrupted", Counter())
        top = interrupted.most_common(n)
        return [(name, party, count) for (name, party), count in top]

    def get_applause_ranking(self, n: int = 10) -> list[tuple[str, int]]:
        """Get parties/groups by applause received."""
        applause = self.drama_stats.get("applause_by_party", Counter())
        return applause.most_common(n)

    def get_heckle_ranking(self, n: int = 10) -> list[tuple[str, int]]:
        """Get parties/groups by heckles given."""
        heckles = self.drama_stats.get("heckles_by_party", Counter())
        return heckles.most_common(n)

    def get_marathon_speakers(self, n: int = 5) -> list[tuple[str, str, int]]:
        """Get speakers with the longest individual speeches."""
        if not self.all_speeches:
            return []
        sorted_speeches = sorted(self.all_speeches, key=lambda x: x.get('words', 0), reverse=True)
        return [(s['speaker'], s['party'], s['words']) for s in sorted_speeches[:n]]

    def get_verbose_speakers(self, n: int = 5, min_speeches: int = 5) -> list[tuple[str, str, float, int]]:
        """Get speakers with highest average words per speech.

        Returns: [(speaker, party, avg_words, speech_count), ...]
        """
        if not self.all_speeches:
            return []

        speaker_words: dict = {}
        speaker_counts: Counter = Counter()
        speaker_party: dict = {}

        for s in self.all_speeches:
            key = s['speaker']
            speaker_words[key] = speaker_words.get(key, 0) + s.get('words', 0)
            speaker_counts[key] += 1
            speaker_party[key] = s['party']

        verbose = [
            (speaker, speaker_party[speaker], speaker_words[speaker] / count, count)
            for speaker, count in speaker_counts.items()
            if count >= min_speeches
        ]
        verbose.sort(key=lambda x: x[2], reverse=True)
        return verbose[:n]

    def get_wordiest_speakers(self, n: int = 5) -> list[tuple[str, str, int, int]]:
        """Get speakers with most total words spoken.

        Returns: [(speaker, party, total_words, speech_count), ...]
        """
        if not self.all_speeches:
            return []

        speaker_words: dict = {}
        speaker_counts: Counter = Counter()
        speaker_party: dict = {}

        for s in self.all_speeches:
            key = s['speaker']
            speaker_words[key] = speaker_words.get(key, 0) + s.get('words', 0)
            speaker_counts[key] += 1
            speaker_party[key] = s['party']

        wordiest = [
            (speaker, speaker_party[speaker], speaker_words[speaker], speaker_counts[speaker])
            for speaker in speaker_words
        ]
        wordiest.sort(key=lambda x: x[2], reverse=True)
        return wordiest[:n]

    def get_party_top_speakers(self, party: str, n: int = 3) -> list[tuple[str, int]]:
        """Get top N speakers for a specific party."""
        if party not in self.speaker_stats:
            return []
        return self.speaker_stats[party].most_common(n)

    def get_academic_ranking(self) -> list[tuple[str, float, int, int]]:
        """Get parties ranked by percentage of speakers with academic titles.

        Returns: [(party, dr_ratio, dr_count, total), ...]
        """
        ranking = []
        for party, stats in self.party_stats.items():
            dr_ratio = stats.get("dr_ratio", 0)
            dr_count = stats.get("dr_count", 0)
            total = stats.get("speeches", 0)
            ranking.append((party, dr_ratio, dr_count, total))
        ranking.sort(key=lambda x: x[1], reverse=True)
        return ranking

    def get_exclusive_words(self, n: int = 3, min_count: int = 10) -> dict[str, list[tuple[str, int]]]:
        """Get words exclusively used by each party.

        Returns: {party: [(word, count), ...]}
        """
        if "nouns" not in self.word_frequencies:
            return {}

        df = self.word_frequencies["nouns"]
        party_cols = [c for c in df.columns if c.endswith('_count')]
        result = {}

        for col in party_cols:
            party = col.replace('_count', '')
            # Find words where this party has min_count+ and others have 0
            mask = (df[col] >= min_count)
            for other_col in party_cols:
                if other_col != col:
                    mask = mask & (df[other_col] == 0)

            exclusive = df[mask].nlargest(n, col)
            if len(exclusive) > 0:
                result[party] = [(row['word'], int(row[col])) for _, row in exclusive.iterrows()]

        return result

    def get_speech_length_stats(self) -> list[tuple[str, int, int, int]]:
        """Get speech length stats per party.

        Returns: [(party, min, avg, max), ...]
        """
        stats = []
        for party in self.metadata.get("parties", []):
            ps = self.party_stats.get(party, {})
            stats.append((
                party,
                ps.get("min_words", 0),
                int(ps.get("avg_words", 0)),
                ps.get("max_words", 0),
            ))
        return stats

    # =========================================================================
    # TONE ANALYSIS METHODS (Scheme D: Communication Style)
    # =========================================================================

    def get_tone_comparison(self) -> list[dict]:
        """Get all parties' tone scores for comparison table."""
        comparison = []
        for party in self.metadata.get("parties", []):
            if party in self.tone_data:
                comparison.append({
                    "party": party,
                    **self.tone_data[party]
                })
        return comparison

    def get_aggression_ranking(self) -> list[tuple[str, float]]:
        """Rank parties by aggression index (highest first)."""
        ranking = [
            (party, scores.get("aggression", 0))
            for party, scores in self.tone_data.items()
        ]
        return sorted(ranking, key=lambda x: x[1], reverse=True)

    def get_labeling_ranking(self) -> list[tuple[str, float]]:
        """Rank parties by labeling index (highest first).

        Labeling captures "othering" language like "ideologisch", "radikal".
        """
        ranking = [
            (party, scores.get("labeling", 0))
            for party, scores in self.tone_data.items()
        ]
        return sorted(ranking, key=lambda x: x[1], reverse=True)

    def get_affirmative_ranking(self) -> list[tuple[str, float]]:
        """Rank parties by affirmative score (highest first)."""
        ranking = [
            (party, scores.get("affirmative", 50))
            for party, scores in self.tone_data.items()
        ]
        return sorted(ranking, key=lambda x: x[1], reverse=True)

    def get_collaboration_ranking(self) -> list[tuple[str, float]]:
        """Rank parties by collaboration score (highest first)."""
        ranking = [
            (party, scores.get("collaboration", 50))
            for party, scores in self.tone_data.items()
        ]
        return sorted(ranking, key=lambda x: x[1], reverse=True)

    def get_solution_focus_ranking(self) -> list[tuple[str, float]]:
        """Rank parties by solution focus score (highest first)."""
        ranking = [
            (party, scores.get("solution_focus", 50))
            for party, scores in self.tone_data.items()
        ]
        return sorted(ranking, key=lambda x: x[1], reverse=True)

    def get_demand_ranking(self) -> list[tuple[str, float]]:
        """Rank parties by demand intensity (highest first)."""
        ranking = [
            (party, scores.get("demand_intensity", 0))
            for party, scores in self.tone_data.items()
        ]
        return sorted(ranking, key=lambda x: x[1], reverse=True)

    def get_acknowledgment_ranking(self) -> list[tuple[str, float]]:
        """Rank parties by acknowledgment rate (highest first)."""
        ranking = [
            (party, scores.get("acknowledgment", 0))
            for party, scores in self.tone_data.items()
        ]
        return sorted(ranking, key=lambda x: x[1], reverse=True)

    # Legacy aliases for backwards compatibility
    def get_aggressiveness_ranking(self) -> list[tuple[str, float]]:
        """Legacy alias for get_aggression_ranking."""
        return self.get_aggression_ranking()

    def get_positivity_ranking(self) -> list[tuple[str, float]]:
        """Legacy alias for get_affirmative_ranking."""
        return self.get_affirmative_ranking()

    def get_cooperation_ranking(self) -> list[tuple[str, float]]:
        """Legacy alias for get_collaboration_ranking."""
        return self.get_collaboration_ranking()

    def get_hope_ranking(self) -> list[tuple[str, float]]:
        """Legacy alias - returns solution_focus_ranking for Scheme D."""
        return self.get_solution_focus_ranking()

    def get_top_words_by_category(
        self,
        party: str,
        word_type: str,  # "adjectives" or "verbs"
        category: str,
        n: int = 5
    ) -> list[tuple[str, int]]:
        """Get top N words in a category for a party.

        Args:
            party: Party name
            word_type: "adjectives" or "verbs"
            category: Category name (e.g., "aggressive", "cooperative")
            n: Number of words to return

        Returns: [(word, count), ...]
        """
        if party not in self.category_data:
            return []

        cat_data = self.category_data[party].get(word_type, {})
        words = cat_data.get(category, {})

        if isinstance(words, dict):
            return sorted(words.items(), key=lambda x: x[1], reverse=True)[:n]
        return []

    def has_tone_data(self) -> bool:
        """Check if tone analysis data is available."""
        return bool(self.tone_data)

    def _generate_quiz_questions(self) -> list[dict]:
        """Generate quiz questions from the data."""
        questions = []
        parties = self.metadata.get("parties", [])

        # Get signature words for word-guessing quizzes
        party_signatures = {}
        for party in parties:
            sigs = self.get_distinctive_words(party, "nouns", 3)
            if sigs:
                party_signatures[party] = sigs

        # Quiz 0: ONE signature word quiz (pick the most distinctive)
        # Find the party with the highest ratio signature word
        best_sig = None
        for party, sigs in party_signatures.items():
            if not sigs or party == "fraktionslos":
                continue
            word, ratio = sigs[0]
            if best_sig is None or ratio > best_sig[2]:
                best_sig = (party, word, ratio)

        if best_sig:
            party, word, ratio = best_sig
            other_parties = [p for p in parties if p != party and p != "fraktionslos"][:3]
            options = [party] + other_parties
            random.shuffle(options)
            questions.append({
                "type": "guess-party",
                "question": "Welche Partei nutzt dieses Wort am häufigsten?",
                "word": word,
                "options": options,
                "correctAnswer": party,
                "explanation": f"{party} verwendet \"{word}\" {ratio:.1f}x häufiger als andere.",
                "ratio": round(ratio, 1),
            })

        # Quiz 1: ONE key topic quiz (frequent + distinctive word)
        # Pick a party with interesting key topics
        key_topic_candidates = []
        for party in parties:
            if party == "fraktionslos":
                continue
            topics = self.get_key_topics(party, "nouns", 3)
            if topics:
                word, count, ratio = topics[0]
                key_topic_candidates.append((party, word, count, ratio))

        if key_topic_candidates:
            # Pick the one with highest ratio (most distinctive)
            key_topic_candidates.sort(key=lambda x: x[3], reverse=True)
            party, word, count, ratio = key_topic_candidates[0]
            other_parties = [p for p in parties if p != party and p != "fraktionslos"][:3]
            options = [party] + other_parties
            random.shuffle(options)
            questions.append({
                "type": "guess-party",
                "question": "Welche Fraktion redet besonders oft über dieses Thema?",
                "word": word,
                "options": options,
                "correctAnswer": party,
                "explanation": f"{party} verwendet \"{word}\" {count:,}× ({ratio:.1f}x häufiger als andere).",
                "ratio": round(ratio, 1),
            })

        # Quiz: Most speeches
        party_speeches = [(p, self.party_stats.get(p, {}).get("real_speeches", 0)) for p in parties]
        party_speeches.sort(key=lambda x: x[1], reverse=True)
        if party_speeches:
            top_party = party_speeches[0][0]
            top_count = party_speeches[0][1]
            options = [p for p, _ in party_speeches[:4]]
            random.shuffle(options)
            questions.append({
                "type": "prediction",
                "question": "Welche Partei hat die meisten Reden gehalten?",
                "options": options,
                "correctAnswer": top_party,
                "explanation": f"{top_party} mit {top_count} Reden!",
            })

        # Quiz: Top interrupter
        interrupters = self.get_top_interrupters(4)
        if interrupters:
            top_name, top_party, top_count = interrupters[0]
            options = [f"{n} ({p})" for n, p, _ in interrupters]
            random.shuffle(options)
            questions.append({
                "type": "prediction",
                "question": "Wer hat am meisten unterbrochen?",
                "options": options,
                "correctAnswer": f"{top_name} ({top_party})",
                "explanation": f"{top_name} ({top_party}) mit {top_count} Unterbrechungen!",
            })

        # Quiz: Applause champion
        applause = self.get_applause_ranking(4)
        if applause:
            top_party, top_count = applause[0]
            options = [p for p, _ in applause]
            random.shuffle(options)
            questions.append({
                "type": "prediction",
                "question": "Welche Partei applaudiert am meisten?",
                "options": options,
                "correctAnswer": top_party,
                "explanation": f"{top_party} mit {top_count:,} Beifallsbekundungen!",
            })

        # Quiz: Loudest heckler
        heckles = self.get_heckle_ranking(4)
        if heckles:
            top_party, top_count = heckles[0]
            options = [p for p, _ in heckles]
            random.shuffle(options)
            questions.append({
                "type": "prediction",
                "question": "Welche Partei ruft am lautesten dazwischen?",
                "options": options,
                "correctAnswer": top_party,
                "explanation": f"{top_party} mit {top_count:,} Zwischenrufen!",
            })

        # Quiz: Top speaker
        speakers = self.get_top_speakers(4)
        if speakers:
            top_name, top_party, top_count = speakers[0]
            options = [f"{n} ({p})" for n, p, _ in speakers]
            random.shuffle(options)
            questions.append({
                "type": "prediction",
                "question": "Wer hat die meisten Reden gehalten?",
                "options": options,
                "correctAnswer": f"{top_name} ({top_party})",
                "explanation": f"{top_name} ({top_party}) mit {top_count} Reden!",
            })

        # Quiz: Most words total
        wordiest = self.get_wordiest_speakers(4)
        if wordiest:
            top_name, top_party, total_words, speech_count = wordiest[0]
            options = [f"{n} ({p})" for n, p, _, _ in wordiest]
            random.shuffle(options)
            questions.append({
                "type": "prediction",
                "question": "Wer hat insgesamt die meisten Wörter gesprochen?",
                "options": options,
                "correctAnswer": f"{top_name} ({top_party})",
                "explanation": f"{top_name} mit {total_words:,} Wörtern aus {speech_count} Reden!",
            })

        # Quiz: Hot topic
        hot = self.get_hot_topics(4)
        if hot:
            questions.append({
                "type": "prediction",
                "question": "Welches Wort nutzen ALLE Parteien am meisten?",
                "options": hot[:4],
                "correctAnswer": hot[0],
                "explanation": f'"{hot[0]}" ist das gemeinsame Top-Wort aller Parteien!',
            })

        # Quiz: Moin! (who uses regional greetings)
        # Search for "moin" in speeches by party
        moin_counts = {}
        for party in parties:
            party_nouns = self.top_words.get(party, {}).get("nouns", [])
            for word, count in party_nouns:
                if word.lower() == "moin":
                    moin_counts[party] = count
                    break

        if moin_counts:
            top_moin = max(moin_counts.items(), key=lambda x: x[1])
            options = list(moin_counts.keys())[:4]
            if len(options) < 4:
                # Add other parties as options
                for p in parties:
                    if p not in options:
                        options.append(p)
                    if len(options) >= 4:
                        break
            random.shuffle(options)
            questions.append({
                "type": "prediction",
                "question": 'Wer sagt am häufigsten "Moin"?',
                "options": options,
                "correctAnswer": top_moin[0],
                "explanation": f'{top_moin[0]} grüßt mit {top_moin[1]}x "Moin"!',
            })
        else:
            # Fallback: random fun question about regional dialects
            options = parties[:4] if len(parties) >= 4 else parties
            random.shuffle(options)
            questions.append({
                "type": "prediction",
                "question": 'Wer sagt am häufigsten "Moin"?',
                "options": options,
                "correctAnswer": options[0],  # Placeholder
                "explanation": "Im Bundestag grüßt man eher formal!",
            })

        # Quiz: Most unique speakers (spread of speakers)
        speaker_spread = [
            (p, len(self.speaker_stats.get(p, {})))
            for p in parties if p != "fraktionslos"
        ]
        speaker_spread.sort(key=lambda x: x[1], reverse=True)
        if speaker_spread:
            top_party = speaker_spread[0][0]
            top_count = speaker_spread[0][1]
            options = [p for p, _ in speaker_spread[:4]]
            random.shuffle(options)
            questions.append({
                "type": "prediction",
                "question": "Welche Fraktion hat die meisten verschiedenen Redner?",
                "options": options,
                "correctAnswer": top_party,
                "explanation": f"{top_party} mit {top_count} verschiedenen Rednern!",
            })

        # Quiz: Top question asker (Zwischenfragen/Fragestunde)
        all_questioners = []
        for party, counts in self.question_speaker_stats.items():
            for speaker, count in counts.items():
                all_questioners.append((speaker, party, count))
        all_questioners.sort(key=lambda x: x[2], reverse=True)
        if all_questioners:
            top_name, top_party, top_count = all_questioners[0]
            options = [f"{n} ({p})" for n, p, _ in all_questioners[:4]]
            random.shuffle(options)
            questions.append({
                "type": "prediction",
                "question": "Wer stellt die meisten Zwischenfragen?",
                "options": options,
                "correctAnswer": f"{top_name} ({top_party})",
                "explanation": f"{top_name} ({top_party}) mit {top_count} Fragen!",
            })

        # Quiz: Which party asks the most questions (aggregated by party)
        party_question_totals = [
            (party, sum(counts.values()))
            for party, counts in self.question_speaker_stats.items()
        ]
        party_question_totals.sort(key=lambda x: x[1], reverse=True)
        if party_question_totals and len(party_question_totals) >= 4:
            top_party, top_count = party_question_totals[0]
            options = [p for p, _ in party_question_totals[:4]]
            random.shuffle(options)
            questions.append({
                "type": "prediction",
                "question": "Welche Fraktion stellt insgesamt die meisten Fragen?",
                "options": options,
                "correctAnswer": top_party,
                "explanation": f"{top_party} mit {top_count} Fragen insgesamt!",
            })

        # =====================================================================
        # TONE ANALYSIS QUIZ QUESTIONS (Scheme D)
        # =====================================================================

        if self.has_tone_data():
            # Quiz: Most aggressive party
            agg_ranking = self.get_aggression_ranking()
            if agg_ranking and len(agg_ranking) >= 4:
                top_party, top_score = agg_ranking[0]
                options = [p for p, _ in agg_ranking[:4]]
                random.shuffle(options)
                questions.append({
                    "type": "prediction",
                    "question": "Welche Partei nutzt die aggressivste Sprache?",
                    "options": options,
                    "correctAnswer": top_party,
                    "explanation": f"{top_party} mit {top_score:.0f}% aggressiven Adjektiven!",
                })

            # Quiz: Most labeling party (NEW in Scheme D)
            label_ranking = self.get_labeling_ranking()
            if label_ranking and len(label_ranking) >= 4:
                top_party, top_score = label_ranking[0]
                options = [p for p, _ in label_ranking[:4]]
                random.shuffle(options)
                questions.append({
                    "type": "prediction",
                    "question": 'Wer nutzt am meisten "ideologische Labels"?',
                    "options": options,
                    "correctAnswer": top_party,
                    "explanation": f'{top_party} mit {top_score:.0f}% Etikettierungen wie "ideologisch", "radikal"!',
                })

            # Quiz: Most collaborative party
            collab_ranking = self.get_collaboration_ranking()
            if collab_ranking and len(collab_ranking) >= 4:
                top_party, top_score = collab_ranking[0]
                options = [p for p, _ in collab_ranking[:4]]
                random.shuffle(options)
                questions.append({
                    "type": "prediction",
                    "question": "Welche Fraktion nutzt die kooperativste Sprache?",
                    "options": options,
                    "correctAnswer": top_party,
                    "explanation": f"{top_party} mit {top_score:.0f}% kooperativen Verben!",
                })

            # Quiz: Most solution-oriented party
            solution_ranking = self.get_solution_focus_ranking()
            if solution_ranking and len(solution_ranking) >= 4:
                top_party, top_score = solution_ranking[0]
                options = [p for p, _ in solution_ranking[:4]]
                random.shuffle(options)
                questions.append({
                    "type": "prediction",
                    "question": "Welche Partei spricht am lösungsorientiertesten?",
                    "options": options,
                    "correctAnswer": top_party,
                    "explanation": f"{top_party} mit {top_score:.0f}% lösungsorientierten Verben!",
                })

            # Quiz: Most demanding party (NEW in Scheme D)
            demand_ranking = self.get_demand_ranking()
            if demand_ranking and len(demand_ranking) >= 4:
                top_party, top_score = demand_ranking[0]
                options = [p for p, _ in demand_ranking[:4]]
                random.shuffle(options)
                questions.append({
                    "type": "prediction",
                    "question": "Welche Partei fordert am meisten?",
                    "options": options,
                    "correctAnswer": top_party,
                    "explanation": f'{top_party} mit {top_score:.0f}% fordernden Verben wie "fordern", "verlangen"!',
                })

            # Quiz: Guess party by labeling word (key Scheme D insight)
            best_label_word = None
            for party in parties:
                if party == "fraktionslos":
                    continue
                words = self.get_top_words_by_category(party, "adjectives", "labeling", 1)
                if words:
                    word, count = words[0]
                    if best_label_word is None or count > best_label_word[2]:
                        best_label_word = (party, word, count)

            if best_label_word:
                party, word, count = best_label_word
                other_parties = [p for p in parties if p != party and p != "fraktionslos"][:3]
                options = [party] + other_parties
                random.shuffle(options)
                questions.append({
                    "type": "guess-party",
                    "question": f'Wer bezeichnet Gegner als "{word}"?',
                    "word": word,
                    "options": options,
                    "correctAnswer": party,
                    "explanation": f'{party} verwendet "{word}" {count}× als Label!',
                })

            # Quiz: Guess party by aggressive word
            best_agg_word = None
            for party in parties:
                if party == "fraktionslos":
                    continue
                words = self.get_top_words_by_category(party, "adjectives", "aggressive", 1)
                if words:
                    word, count = words[0]
                    if best_agg_word is None or count > best_agg_word[2]:
                        best_agg_word = (party, word, count)

            if best_agg_word:
                party, word, count = best_agg_word
                other_parties = [p for p in parties if p != party and p != "fraktionslos"][:3]
                options = [party] + other_parties
                random.shuffle(options)
                questions.append({
                    "type": "guess-party",
                    "question": f'Wer sagt "{word}" am häufigsten?',
                    "word": word,
                    "options": options,
                    "correctAnswer": party,
                    "explanation": f'{party} verwendet "{word}" {count}×!',
                })

        return questions

    def to_web_json(self) -> dict:
        """Export data in format expected by web app."""
        parties_data = []
        for party in self.metadata.get("parties", []):
            stats = self.party_stats.get(party, {})
            style = self.get_communication_style(party)
            champion = self.get_party_champion(party)

            # Count unique speakers for this party
            unique_speakers = len(self.speaker_stats.get(party, {}))

            parties_data.append({
                "party": party,
                "speeches": stats.get("real_speeches", stats.get("speeches", 0)),
                "totalWords": stats.get("total_words", 0),
                "uniqueSpeakers": unique_speakers,
                "topWords": [
                    {"word": w, "count": c}
                    for w, c in self.top_words.get(party, {}).get("nouns", [])[:7]
                ],
                "signatureWords": [
                    {"word": w, "ratio": round(r, 1)}
                    for w, r in self.get_distinctive_words(party, "nouns", 5)
                ],
                "keyTopics": [
                    {"word": w, "count": c, "ratio": round(r, 1)}
                    for w, c, r in self.get_key_topics(party, "nouns", 5)
                ],
                "avgSpeechLength": int(style.get("avg_speech_length", 0)),
                "descriptiveness": round(style.get("descriptiveness", 0) * 100, 1),
                "topSpeaker": {
                    "name": champion[0],
                    "speeches": champion[1]
                } if champion else {"name": "", "speeches": 0},
            })

        return {
            "metadata": {
                "totalSpeeches": self.metadata.get("total_speeches", 0),
                "totalWords": self.metadata.get("total_words", 0),
                "partyCount": len(self.metadata.get("parties", [])),
                "speakerCount": self.get_unique_speaker_count(),
                "wahlperiode": self.metadata.get("wahlperiode", 0),
                "sitzungen": self.metadata.get("sitzungen", 50),
            },
            "parties": parties_data,
            "drama": {
                "topInterrupters": [
                    {"name": n, "party": p, "count": c}
                    for n, p, c in self.get_top_interrupters(5)
                ],
                "mostInterrupted": [
                    {"name": n, "party": p, "count": c}
                    for n, p, c in self.get_most_interrupted(5)
                ],
                "applauseChampions": [
                    {"party": p, "count": c}
                    for p, c in self.get_applause_ranking(5)
                ],
                "loudestHecklers": [
                    {"party": p, "count": c}
                    for p, c in self.get_heckle_ranking(5)
                ],
            },
            "topSpeakers": [
                {"name": n, "party": p, "speeches": c}
                for n, p, c in self.get_top_speakers(20)
            ],
            "topSpeakersByWords": [
                {"name": n, "party": p, "totalWords": w, "speeches": c}
                for n, p, w, c in self.get_wordiest_speakers(20)
            ],
            "hotTopics": self.get_hot_topics(15),
            "quizQuestions": self._generate_quiz_questions(),
            "toneAnalysis": self._build_tone_analysis_json() if self.has_tone_data() else None,
            "funFacts": self._generate_fun_facts(),
        }

    def _generate_fun_facts(self) -> list[dict]:
        """Generate fun facts including tone analysis insights."""
        facts = []
        meta = self.metadata

        # Basic stats facts
        total_words = meta.get("total_words", 0)
        total_speeches = meta.get("total_speeches", 0)
        sitzungen = meta.get("sitzungen", 50)

        if total_words and sitzungen:
            words_per_day = total_words // sitzungen
            facts.append({
                "emoji": "📅",
                "value": f"{words_per_day:,}",
                "label": "Wörter pro Sitzungstag",
                "category": "general",
            })

        if total_words and total_speeches:
            avg_words = total_words // total_speeches
            facts.append({
                "emoji": "🎤",
                "value": f"{avg_words:,}",
                "label": "Wörter pro Rede",
                "category": "general",
            })

        books = total_words // 50000 if total_words else 0
        if books:
            facts.append({
                "emoji": "📚",
                "value": str(books),
                "label": "Bücher-Äquivalent",
                "category": "general",
            })

        # Tone analysis facts (Scheme D)
        if self.has_tone_data():
            # Most aggressive party
            agg_ranking = self.get_aggression_ranking()
            if agg_ranking:
                top_party, top_score = agg_ranking[0]
                facts.append({
                    "emoji": "💢",
                    "value": f"{top_score:.0f}%",
                    "label": f"Aggression ({top_party})",
                    "sublabel": "aggressivste Sprache",
                    "category": "tone",
                })

            # Most labeling party (key Scheme D insight)
            label_ranking = self.get_labeling_ranking()
            if label_ranking:
                top_party, top_score = label_ranking[0]
                if top_score > 1:  # Only show if significant
                    facts.append({
                        "emoji": "🏷️",
                        "value": f"{top_score:.0f}%",
                        "label": f"Etikettierung ({top_party})",
                        "sublabel": '"ideologisch", "radikal"...',
                        "category": "tone",
                    })

            # Most collaborative party
            collab_ranking = self.get_collaboration_ranking()
            if collab_ranking:
                top_party, top_score = collab_ranking[0]
                facts.append({
                    "emoji": "🤝",
                    "value": f"{top_score:.0f}%",
                    "label": f"Kooperation ({top_party})",
                    "sublabel": "kooperativste Sprache",
                    "category": "tone",
                })

            # Top labeling word (key insight)
            best_label = None
            for party in self.metadata.get("parties", []):
                words = self.get_top_words_by_category(party, "adjectives", "labeling", 1)
                if words:
                    word, count = words[0]
                    if best_label is None or count > best_label[1]:
                        best_label = (word, count, party)

            if best_label:
                word, count, party = best_label
                facts.append({
                    "emoji": "🎯",
                    "value": f'"{word}"',
                    "label": f"{count}× ({party})",
                    "sublabel": "häufigstes Label",
                    "category": "tone",
                })

            # Top aggressive word
            best_word = None
            for party in self.metadata.get("parties", []):
                words = self.get_top_words_by_category(party, "adjectives", "aggressive", 1)
                if words:
                    word, count = words[0]
                    if best_word is None or count > best_word[1]:
                        best_word = (word, count, party)

            if best_word:
                word, count, party = best_word
                facts.append({
                    "emoji": "🔥",
                    "value": f'"{word}"',
                    "label": f"{count}× ({party})",
                    "sublabel": "häufigstes Kampfwort",
                    "category": "tone",
                })

            # Affirmative spread (difference between most and least affirmative)
            aff_ranking = self.get_affirmative_ranking()
            if aff_ranking and len(aff_ranking) >= 2:
                most_aff = aff_ranking[0]
                least_aff = aff_ranking[-1]
                spread = most_aff[1] - least_aff[1]
                if spread > 10:
                    facts.append({
                        "emoji": "📊",
                        "value": f"{spread:.0f}%",
                        "label": "Positivitäts-Spread",
                        "sublabel": f"{most_aff[0]} vs {least_aff[0]}",
                        "category": "tone",
                    })

        return facts

    def _build_tone_analysis_json(self) -> dict:
        """Build tone analysis section for web JSON export (Scheme D)."""
        parties_tone = []
        for party in self.metadata.get("parties", []):
            if party not in self.tone_data:
                continue
            parties_tone.append({
                "party": party,
                "scores": self.tone_data[party],
                # Adjective categories (Scheme D)
                "topAffirmative": [
                    {"word": w, "count": c}
                    for w, c in self.get_top_words_by_category(party, "adjectives", "affirmative", 5)
                ],
                "topCritical": [
                    {"word": w, "count": c}
                    for w, c in self.get_top_words_by_category(party, "adjectives", "critical", 5)
                ],
                "topAggressive": [
                    {"word": w, "count": c}
                    for w, c in self.get_top_words_by_category(party, "adjectives", "aggressive", 5)
                ],
                "topLabeling": [
                    {"word": w, "count": c}
                    for w, c in self.get_top_words_by_category(party, "adjectives", "labeling", 5)
                ],
                # Verb categories (Scheme D)
                "topSolution": [
                    {"word": w, "count": c}
                    for w, c in self.get_top_words_by_category(party, "verbs", "solution", 5)
                ],
                "topProblem": [
                    {"word": w, "count": c}
                    for w, c in self.get_top_words_by_category(party, "verbs", "problem", 5)
                ],
                "topCollaborative": [
                    {"word": w, "count": c}
                    for w, c in self.get_top_words_by_category(party, "verbs", "collaborative", 5)
                ],
                "topConfrontational": [
                    {"word": w, "count": c}
                    for w, c in self.get_top_words_by_category(party, "verbs", "confrontational", 5)
                ],
                "topDemanding": [
                    {"word": w, "count": c}
                    for w, c in self.get_top_words_by_category(party, "verbs", "demanding", 5)
                ],
                "topAcknowledging": [
                    {"word": w, "count": c}
                    for w, c in self.get_top_words_by_category(party, "verbs", "acknowledging", 5)
                ],
            })

        return {
            "parties": parties_tone,
            "rankings": {
                # Adjective-based scores
                "affirmative": [
                    {"party": p, "score": round(s, 1)}
                    for p, s in self.get_affirmative_ranking()
                ],
                "aggression": [
                    {"party": p, "score": round(s, 1)}
                    for p, s in self.get_aggression_ranking()
                ],
                "labeling": [
                    {"party": p, "score": round(s, 1)}
                    for p, s in self.get_labeling_ranking()
                ],
                # Verb-based scores
                "solutionFocus": [
                    {"party": p, "score": round(s, 1)}
                    for p, s in self.get_solution_focus_ranking()
                ],
                "collaboration": [
                    {"party": p, "score": round(s, 1)}
                    for p, s in self.get_collaboration_ranking()
                ],
                "demandIntensity": [
                    {"party": p, "score": round(s, 1)}
                    for p, s in self.get_demand_ranking()
                ],
                "acknowledgment": [
                    {"party": p, "score": round(s, 1)}
                    for p, s in self.get_acknowledgment_ranking()
                ],
            },
        }


class WrappedRenderer:
    """Render wrapped analysis to terminal using Rich."""

    def __init__(self, console: Console, use_emoji: bool = True):
        self.console = console
        self.use_emoji = use_emoji

    def _bar(self, value: float, max_value: float, width: int = 10) -> str:
        """Create a simple bar visualization."""
        filled = int((value / max_value) * width) if max_value > 0 else 0
        return "█" * filled + "░" * (width - filled)

    def _party_style(self, party: str) -> str:
        """Get Rich style for a party."""
        return PARTY_COLORS.get(party, "white")

    def render_header(self, data: WrappedData) -> None:
        """Render the header panel with summary stats."""
        meta = data.metadata
        total_speeches = meta.get("total_speeches", 0)
        total_words = meta.get("total_words", 0)
        parties = len(meta.get("parties", []))
        speakers = data.get_unique_speaker_count()
        wp = meta.get("wahlperiode", "?")

        header_text = Text()
        header_text.append("BUNDESTAG WRAPPED 2025\n", style="bold magenta")
        header_text.append(f"Wahlperiode {wp} - Your Year in Parliament\n\n", style="dim")
        header_text.append(f"{total_speeches:,} speeches", style="cyan")
        header_text.append(" | ", style="dim")
        header_text.append(f"{total_words:,} words", style="cyan")
        header_text.append(" | ", style="dim")
        header_text.append(f"{parties} parties", style="cyan")
        header_text.append(" | ", style="dim")
        header_text.append(f"{speakers} speakers", style="cyan")

        self.console.print(Panel(header_text, border_style="magenta"))
        self.console.print()

    def render_party_section(self, data: WrappedData, party: str) -> None:
        """Render analysis for a single party."""
        stats = data.party_stats.get(party, {})
        if not stats:
            return

        style = self._party_style(party)

        # Party header - use real_speeches (400+ words) if available
        speeches = stats.get("real_speeches", stats.get("speeches", 0))
        words = stats.get("total_words", 0)

        table = Table(
            title=f"{party}",
            title_style=f"bold {style}",
            border_style=style,
            show_header=False,
            expand=False,
            padding=(0, 1),
        )
        table.add_column("", style="dim")
        table.add_column("")

        table.add_row("Speeches", f"{speeches:,}")
        table.add_row("Words", f"{words:,}")

        # Speech length stats
        min_w = stats.get("min_words", 0)
        max_w = stats.get("max_words", 0)
        avg_w = stats.get("avg_words", 0)
        if max_w > 0:
            table.add_row("Speech length", f"{min_w}-{max_w} words (avg {avg_w:.0f})")

        # Academic title ratio
        dr_ratio = stats.get("dr_ratio", 0)
        dr_count = stats.get("dr_count", 0)
        if dr_count > 0:
            table.add_row("With Dr. title", f"{dr_ratio*100:.1f}% ({dr_count})")

        # Top nouns - expanded to 10
        top_nouns = data.top_words.get(party, {}).get("nouns", [])[:10]
        if top_nouns:
            max_count = top_nouns[0][1] if top_nouns else 1
            table.add_row("", "")
            table.add_row("[bold]Top 10 Words[/]", "")
            for word, count in top_nouns[:10]:
                bar = self._bar(count, max_count, 12)
                table.add_row(f"  {word}", f"{bar} {count:,}")

        # Key Topics (frequent + distinctive)
        key_topics = data.get_key_topics(party, "nouns", 5)
        if key_topics:
            table.add_row("", "")
            table.add_row("[bold]Key Topics[/]", "[dim](frequent + distinctive)[/]")
            for word, count, ratio in key_topics:
                table.add_row(f"  {word}", f"{count:,} ({ratio:.1f}x)")

        # Distinctive words - expanded to 10
        distinctive = data.get_distinctive_words(party, "nouns", 10)
        if distinctive:
            table.add_row("", "")
            table.add_row("[bold]Signature Words (10)[/]", "")
            for word, ratio in distinctive[:10]:
                table.add_row(f"  {word}", f"[dim]{ratio:.1f}x[/]")

        # Top 5 speakers for this party
        top_speakers = data.get_party_top_speakers(party, 5)
        if top_speakers:
            table.add_row("", "")
            table.add_row("[bold]Top Speakers[/]", "")
            medals = ["[yellow]1.[/]", "[white]2.[/]", "[orange3]3.[/]", "4.", "5."]
            for i, (speaker, count) in enumerate(top_speakers):
                rank = medals[i] if i < len(medals) else f"{i+1}."
                table.add_row(f"  {rank} {speaker}", f"{count} speeches")

        self.console.print(table)
        self.console.print()

    def render_speaker_section(self, data: WrappedData) -> None:
        """Render speaker leaderboard with formal speeches and question time."""
        medals = ["[yellow]1.[/]", "[white]2.[/]", "[orange3]3.[/]"]

        # TOP SPEAKERS (Formal Speeches)
        formal_speakers = data.get_formal_speakers(15)
        if formal_speakers:
            table = Table(
                title="TOP SPEAKERS (Formal Speeches)",
                title_style="bold yellow",
                border_style="yellow",
            )
            table.add_column("#", style="dim", width=3)
            table.add_column("Speaker", style="bold")
            table.add_column("Party", style="dim")
            table.add_column("Speeches", justify="right", style="cyan")

            for i, (speaker, party, count) in enumerate(formal_speakers):
                rank = medals[i] if i < 3 else f"{i+1}."
                party_styled = f"[{self._party_style(party)}]{party}[/]"
                table.add_row(rank, speaker, party_styled, f"{count}")

            self.console.print(table)
            self.console.print()

        # QUESTION TIME CHAMPIONS
        question_speakers = data.get_question_time_speakers(10)
        if question_speakers:
            table = Table(
                title="QUESTION TIME CHAMPIONS",
                title_style="bold cyan",
                border_style="cyan",
            )
            table.add_column("#", style="dim", width=3)
            table.add_column("Speaker", style="bold")
            table.add_column("Party", style="dim")
            table.add_column("Questions", justify="right", style="cyan")

            for i, (speaker, party, count) in enumerate(question_speakers):
                rank = medals[i] if i < 3 else f"{i+1}."
                party_styled = f"[{self._party_style(party)}]{party}[/]"
                table.add_row(rank, speaker, party_styled, f"{count}")

            self.console.print(table)
            self.console.print()

    def render_drama_section(self, data: WrappedData) -> None:
        """Render drama stats - interruptions, applause, heckles."""
        table = Table(
            title="DRAMA KINGS & QUEENS",
            title_style="bold red",
            border_style="red",
            show_header=False,
        )
        table.add_column("", width=45)
        table.add_column("", justify="right")

        # Top Interrupters - expanded to 10
        interrupters = data.get_top_interrupters(10)
        if interrupters:
            table.add_row("[bold]Top 10 Interrupters[/]", "")
            for i, (name, party, count) in enumerate(interrupters):
                medal = ["[yellow]1.[/]", "[white]2.[/]", "[orange3]3.[/]"][i] if i < 3 else f"{i+1}."
                party_styled = f"[{self._party_style(party)}]{party}[/]"
                table.add_row(f"  {medal} {name} ({party_styled})", f"{count}")

        table.add_row("", "")

        # Most Interrupted - expanded to 10
        interrupted = data.get_most_interrupted(10)
        if interrupted:
            table.add_row("[bold]Most Interrupted (10)[/]", "")
            for i, (name, party, count) in enumerate(interrupted):
                medal = ["[yellow]1.[/]", "[white]2.[/]", "[orange3]3.[/]"][i] if i < 3 else f"{i+1}."
                party_styled = f"[{self._party_style(party)}]{party}[/]"
                table.add_row(f"  {medal} {name} ({party_styled})", f"{count} times")

        table.add_row("", "")

        # Applause Champions
        applause = data.get_applause_ranking(6)
        if applause:
            table.add_row("[bold]Applause by Party[/]", "")
            for target, count in applause:
                table.add_row(f"  {target}", f"{count:,}")

        table.add_row("", "")

        # Heckle Sources
        heckles = data.get_heckle_ranking(6)
        if heckles:
            table.add_row("[bold]Heckles by Party[/]", "")
            for source, count in heckles:
                table.add_row(f"  {source}", f"{count:,}")

        self.console.print(table)
        self.console.print()

    def render_records_section(self, data: WrappedData) -> None:
        """Render records - marathon speakers, verbose speakers."""
        table = Table(
            title="RECORDS & STATS",
            title_style="bold green",
            border_style="green",
            show_header=False,
        )
        table.add_column("", width=45)
        table.add_column("", justify="right")

        # Marathon speakers (longest single speeches)
        marathon = data.get_marathon_speakers(5)
        if marathon:
            table.add_row("[bold]Longest Speeches[/]", "")
            for i, (name, party, words) in enumerate(marathon):
                medal = ["[yellow]1.[/]", "[white]2.[/]", "[orange3]3.[/]"][i] if i < 3 else f"{i+1}."
                party_styled = f"[{self._party_style(party)}]{party}[/]"
                table.add_row(f"  {medal} {name} ({party_styled})", f"{words:,} words")

        table.add_row("", "")

        # Verbose speakers (highest avg words per speech)
        verbose = data.get_verbose_speakers(5, min_speeches=5)
        if verbose:
            table.add_row("[bold]Most Verbose (avg words, 5+ speeches)[/]", "")
            for i, (name, party, avg, count) in enumerate(verbose):
                medal = ["[yellow]1.[/]", "[white]2.[/]", "[orange3]3.[/]"][i] if i < 3 else f"{i+1}."
                party_styled = f"[{self._party_style(party)}]{party}[/]"
                table.add_row(f"  {medal} {name} ({party_styled})", f"{avg:.0f} avg ({count} speeches)")

        table.add_row("", "")

        # Wordiest speakers (most total words)
        wordiest = data.get_wordiest_speakers(5)
        if wordiest:
            table.add_row("[bold]Most Words Total[/]", "")
            for i, (name, party, total, count) in enumerate(wordiest):
                medal = ["[yellow]1.[/]", "[white]2.[/]", "[orange3]3.[/]"][i] if i < 3 else f"{i+1}."
                party_styled = f"[{self._party_style(party)}]{party}[/]"
                table.add_row(f"  {medal} {name} ({party_styled})", f"{total:,} words ({count} speeches)")

        table.add_row("", "")

        # Academic title ranking
        academic = data.get_academic_ranking()
        if academic:
            table.add_row("[bold]Academic Titles (Dr.) by Party[/]", "")
            for party, ratio, count, total in academic:
                if ratio > 0:
                    party_styled = f"[{self._party_style(party)}]{party}[/]"
                    table.add_row(f"  {party_styled}", f"{ratio*100:.1f}% ({count}/{total})")

        self.console.print(table)
        self.console.print()

    def render_vocabulary_section(self, data: WrappedData) -> None:
        """Render exclusive vocabulary - words only used by one party."""
        exclusive = data.get_exclusive_words(n=5, min_count=10)
        if not exclusive:
            return

        table = Table(
            title="EXCLUSIVE VOCABULARY",
            title_style="bold cyan",
            border_style="cyan",
            show_header=False,
        )
        table.add_column("Party", width=15)
        table.add_column("Words only this party uses", width=50)

        for party in data.metadata.get("parties", []):
            if party in exclusive:
                party_styled = f"[{self._party_style(party)}]{party}[/]"
                words = ", ".join(f"{w} ({c})" for w, c in exclusive[party])
                table.add_row(party_styled, words)

        self.console.print(table)
        self.console.print()

    def render_topic_section(self, data: WrappedData) -> None:
        """Render hot topics and trends."""
        hot_topics = data.get_hot_topics(15)
        if not hot_topics:
            return

        topic_text = Text()
        topic_text.append("HOT TOPICS\n", style="bold cyan")
        topic_text.append("Words discussed by all parties\n\n", style="dim")

        for i, topic in enumerate(hot_topics):
            if i > 0:
                topic_text.append(" | ", style="dim")
            topic_text.append(topic, style="bold")

        self.console.print(Panel(topic_text, border_style="cyan"))
        self.console.print()

    def render_tone_section(self, data: WrappedData) -> None:
        """Render tone analysis section (Scheme D: Communication Style)."""
        if not data.has_tone_data():
            return

        # Main comparison table with Scheme D scores
        table = Table(
            title="TONE ANALYSIS (Communication Style)",
            title_style="bold magenta",
            border_style="magenta",
        )
        table.add_column("Party", style="bold", width=12)
        table.add_column("Affirm.", justify="right", width=8)
        table.add_column("Aggr.", justify="right", width=7)
        table.add_column("Label", justify="right", width=7)
        table.add_column("Collab.", justify="right", width=8)
        table.add_column("Solution", justify="right", width=8)

        for party in data.metadata.get("parties", []):
            if party not in data.tone_data:
                continue
            scores = data.tone_data[party]
            party_styled = f"[{self._party_style(party)}]{party}[/]"

            # Color-code the values (Scheme D)
            aff = scores.get("affirmative", 50)
            agg = scores.get("aggression", 0)
            label = scores.get("labeling", 0)
            collab = scores.get("collaboration", 50)
            sol = scores.get("solution_focus", 50)

            aff_style = "green" if aff > 55 else "red" if aff < 45 else ""
            agg_style = "red" if agg > 10 else "green" if agg < 5 else ""
            label_style = "magenta" if label > 3 else ""  # Highlight labeling
            collab_style = "green" if collab > 55 else "red" if collab < 45 else ""
            sol_style = "green" if sol > 55 else "red" if sol < 45 else ""

            table.add_row(
                party_styled,
                f"[{aff_style}]{aff:.0f}%[/]" if aff_style else f"{aff:.0f}%",
                f"[{agg_style}]{agg:.0f}%[/]" if agg_style else f"{agg:.0f}%",
                f"[{label_style}]{label:.0f}%[/]" if label_style else f"{label:.0f}%",
                f"[{collab_style}]{collab:.0f}%[/]" if collab_style else f"{collab:.0f}%",
                f"[{sol_style}]{sol:.0f}%[/]" if sol_style else f"{sol:.0f}%",
            )

        self.console.print(table)
        self.console.print()

        # Top labeling words by party (key Scheme D insight)
        label_table = Table(
            title="Ideological Labeling (Othering)",
            title_style="bold magenta",
            border_style="magenta",
            show_header=False,
        )
        label_table.add_column("Party", width=12)
        label_table.add_column("Top Labeling Adjectives", width=55)

        for party in data.metadata.get("parties", []):
            words = data.get_top_words_by_category(party, "adjectives", "labeling", 5)
            if words:
                party_styled = f"[{self._party_style(party)}]{party}[/]"
                word_str = ", ".join(f"{w} ({c})" for w, c in words)
                label_table.add_row(party_styled, word_str)

        self.console.print(label_table)
        self.console.print()

        # Top aggressive words by party
        agg_table = Table(
            title="Most Aggressive Language",
            title_style="bold red",
            border_style="red",
            show_header=False,
        )
        agg_table.add_column("Party", width=12)
        agg_table.add_column("Top Aggressive Adjectives", width=55)

        for party in data.metadata.get("parties", []):
            words = data.get_top_words_by_category(party, "adjectives", "aggressive", 5)
            if words:
                party_styled = f"[{self._party_style(party)}]{party}[/]"
                word_str = ", ".join(f"{w} ({c})" for w, c in words)
                agg_table.add_row(party_styled, word_str)

        self.console.print(agg_table)
        self.console.print()

        # Top collaborative words (Scheme D: collaborative verbs)
        collab_table = Table(
            title="Most Collaborative Language",
            title_style="bold blue",
            border_style="blue",
            show_header=False,
        )
        collab_table.add_column("Party", width=12)
        collab_table.add_column("Top Collaborative Verbs", width=55)

        for party in data.metadata.get("parties", []):
            words = data.get_top_words_by_category(party, "verbs", "collaborative", 5)
            if words:
                party_styled = f"[{self._party_style(party)}]{party}[/]"
                word_str = ", ".join(f"{w} ({c})" for w, c in words)
                collab_table.add_row(party_styled, word_str)

        self.console.print(collab_table)
        self.console.print()

    def render_all(self, data: WrappedData, parties: list[str] | None = None) -> None:
        """Render full wrapped report."""
        self.render_header(data)

        # Render party sections
        party_list = parties or data.metadata.get("parties", [])
        for party in party_list:
            self.render_party_section(data, party)

        self.render_speaker_section(data)
        self.render_records_section(data)
        self.render_drama_section(data)
        self.render_tone_section(data)  # NEW: Tone analysis
        self.render_vocabulary_section(data)
        self.render_topic_section(data)

        # Footer
        self.console.print(
            "[dim]Generated by noun-analysis | "
            "Data: Bundestag DIP API[/]"
        )
