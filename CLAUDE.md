# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Python CLI tool for analyzing noun frequency by political party in German Bundestag speeches. Fetches speech data via MCP protocol from a bundestag-mcp server, extracts German nouns using spaCy NLP, and compares usage patterns across parties.

## Commands

```bash
# Install (editable mode)
pip install -e .

# Download required spaCy model
noun-analysis download-model
# or: python -m spacy download de_core_news_lg

# Test MCP server connection
noun-analysis test

# Run analysis (fetches Plenarprotokolle, extracts nouns/adjectives/verbs)
noun-analysis analyze                          # 5 protocols, all parties
noun-analysis analyze -m 10                    # 10 protocols
noun-analysis analyze -m 0                     # ALL protocols (full Wahlperiode)
noun-analysis analyze -p SPD -p "CDU/CSU"     # filter specific parties
noun-analysis analyze -m 5 -o ./results        # export to directory
noun-analysis analyze -m 0 -o ./results -q     # batch mode (no tables, just export)

# Run tests
pytest
pytest tests/test_analyzer.py -v              # single file
```

## Architecture

```
src/noun_analysis/
├── cli.py      # Click CLI, progress display, export (JSON/CSV)
├── client.py   # BundestagMCPClient - async HTTP client for MCP protocol
└── analyzer.py # NounAnalyzer - spaCy-based noun extraction and counting
```

**Data Flow:** CLI → MCP Client → bundestag-mcp server → Bundestag DIP API

**Key Classes:**
- `BundestagMCPClient` (client.py): Async context manager, handles MCP session initialization and tool calls via JSON-RPC over HTTP. Fetches Plenarprotokolle full text and parses speeches by party.
- `NounAnalyzer` (analyzer.py): Loads spaCy `de_core_news_lg` model, extracts lemmatized nouns, filters German stopwords
- `AnalysisResult` (analyzer.py): Dataclass holding per-party noun counts with frequency calculations
- `parse_speeches_from_protocol()` (client.py): Regex-based parser that extracts individual speeches from protocol text, matching pattern `Speaker Name (PARTY):`

## Requirements

- Python 3.10+
- External bundestag-mcp server running at localhost:3000 (configurable via `--server`)
- The MCP server must have access to Bundestag DIP API (no Qdrant/indexing required)

## Key Implementation Details

- Uses `httpx` with SSE support for MCP protocol communication
- Fetches full Plenarprotokolle via `bundestag_get_plenarprotokoll` with `includeFullText: True`
- Parses speeches from protocol text using regex pattern `Name (PARTY):`
- spaCy pipeline optimized: `tok2vec`, `tagger`, `morphologizer`, `lemmatizer` enabled
- Extracts three word types: nouns (NOUN/PROPN), adjectives (ADJ), verbs (VERB)
- Word frequencies normalized per 1000 words for cross-party comparison
- Stopwords filtered per word type in `WordAnalyzer.STOPWORD_NOUNS/ADJECTIVES/VERBS`
- Party names normalized via `PARTY_ALIASES` dict (e.g., "BÜNDNIS 90/DIE GRÜNEN" → "GRÜNE")

## Scientific Export Format

When using `-o ./results`, creates:
- `summary.json` - Metadata and per-party statistics
- `nouns.csv` - All nouns with count and per-1000 frequency per party
- `adjectives.csv` - All adjectives with count and per-1000 frequency per party
- `verbs.csv` - All verbs with count and per-1000 frequency per party
- `full_data.json` - Complete data for programmatic access
