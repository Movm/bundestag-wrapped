# Bundestag Word Frequency Analysis

Analyze word frequency (nouns, adjectives, verbs) by political party in German Bundestag speeches. Fetches speech data via MCP protocol from a bundestag-mcp server, extracts German words using spaCy NLP, and compares usage patterns across parties.

## Features

- **Multi-word analysis**: Extracts nouns, adjectives, and verbs (not just nouns)
- **Lemmatization**: Words reduced to base form for accurate counting ("Wirtschaft" ← "Wirtschaften")
- **Semantic categorization**: Words categorized by topic (economy, security, social, etc.) with tone scores
- **Party comparison**: Relative frequency per 1000 words for cross-party analysis
- **Resumable downloads**: Download protocols incrementally, resume if interrupted
- **Scientific export**: JSON/CSV output with full statistics for research
- **Bundestag Wrapped**: Fun year-in-review visualization of parliamentary activity

## Installation

```bash
# Clone repository
git clone https://github.com/your-username/bundestag-noun-analysis
cd bundestag-noun-analysis

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# or: .venv\Scripts\activate  # Windows

# Install package
pip install -e .

# Download spaCy German model
noun-analysis download-model
# or: python -m spacy download de_core_news_lg
```

## Requirements

- Python 3.10+
- bundestag-mcp server running at localhost:3000 (or specify with `--server`)
- The MCP server must have access to Bundestag DIP API

## Usage

### Test Connection

```bash
noun-analysis test
```

### Quick Analysis (from MCP server)

```bash
# Analyze 5 protocols, all parties
noun-analysis analyze

# Analyze 10 protocols
noun-analysis analyze -m 10

# Analyze ALL protocols (full Wahlperiode)
noun-analysis analyze -m 0

# Filter specific parties
noun-analysis analyze -p SPD -p "CDU/CSU"

# Export results to directory
noun-analysis analyze -m 5 -o ./results

# Batch mode (no tables, just export)
noun-analysis analyze -m 0 -o ./results -q
```

### Offline Workflow (Download → Parse → Analyze)

For large-scale analysis, download protocols first:

```bash
# Download all protocols from Wahlperiode 21
noun-analysis download ./data_wp21 -w 21

# Check download progress
noun-analysis status ./data_wp21

# Parse protocols into speeches
noun-analysis parse ./data_wp21

# Analyze from cached data
noun-analysis analyze ./data_wp21 -o ./results
```

### Bundestag Wrapped 2025

Generate a fun year-in-review visualization:

```bash
noun-analysis wrapped ./data_wp21 -r ./results

# Show specific sections
noun-analysis wrapped -s party    # Party stats
noun-analysis wrapped -s speaker  # Top speakers
noun-analysis wrapped -s drama    # Parliamentary drama
noun-analysis wrapped -s topic    # Hot topics
```

## CLI Reference

### Global Options

| Option | Description | Default |
|--------|-------------|---------|
| `--server` | MCP server URL | `http://localhost:3000` |

### `analyze` Command

| Option | Description | Default |
|--------|-------------|---------|
| `DATA_DIR` | Path to cached data (optional) | - |
| `-p, --parties` | Filter parties (can repeat) | All |
| `-w, --wahlperiode` | Legislative period | 20 |
| `-m, --max-protocols` | Max Plenarprotokolle (0 = all) | 5 |
| `--model` | spaCy model | `de_core_news_lg` |
| `-o, --output-dir` | Export directory | - |
| `-n, --top` | Top words to show | 30 |
| `-q, --quiet` | Suppress table output | false |

### `download` Command

| Option | Description | Default |
|--------|-------------|---------|
| `DATA_DIR` | Directory to save protocols | - |
| `-w, --wahlperiode` | Legislative period | 20 |
| `-m, --max-protocols` | Max protocols (0 = all) | 0 |

## Output Format

When using `-o ./results`, creates:

- `summary.json` - Metadata and per-party statistics
- `nouns.csv` - All nouns with count and per-1000 frequency
- `adjectives.csv` - All adjectives with count and per-1000 frequency
- `verbs.csv` - All verbs with count and per-1000 frequency
- `full_data.json` - Complete data for programmatic access

## Architecture

```
src/noun_analysis/
├── cli.py        # Click CLI, progress display, export
├── client.py     # BundestagMCPClient - async HTTP/MCP client
├── analyzer.py   # WordAnalyzer - spaCy-based word extraction
├── categorizer.py # Semantic word categorization
├── lexicons.py   # Political topic lexicons
├── storage.py    # Data persistence for offline workflow
└── wrapped.py    # Bundestag Wrapped visualization
```

**Data Flow:**
```
CLI → MCP Client → bundestag-mcp server → Bundestag DIP API
         ↓
    WordAnalyzer (spaCy de_core_news_lg)
         ↓
    Categorizer (semantic analysis)
         ↓
    Export (JSON/CSV)
```

## Methodology

- **Lemmatization**: Words reduced to dictionary form using spaCy
- **Stopwords**: Common parliamentary terms filtered (e.g., "Herr", "Frau", "Kollege", "Antrag")
- **Normalization**: Frequencies calculated per 1000 words for fair comparison
- **Party aliases**: Normalized (e.g., "BÜNDNIS 90/DIE GRÜNEN" → "GRÜNE")
- **spaCy model**: `de_core_news_lg` for best German POS tagging accuracy

## License

MIT
