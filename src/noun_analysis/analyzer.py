"""spaCy-based word frequency analyzer for German text."""

from collections import Counter
from dataclasses import dataclass, field

import spacy
from spacy.tokens import Doc

from .categorizer import CategoryCounts, ToneScores, WordCategorizer


@dataclass
class AnalysisResult:
    """Result of word frequency analysis."""

    party: str
    noun_counts: Counter = field(default_factory=Counter)
    adjective_counts: Counter = field(default_factory=Counter)
    verb_counts: Counter = field(default_factory=Counter)
    total_words: int = 0
    total_nouns: int = 0
    total_adjectives: int = 0
    total_verbs: int = 0
    speech_count: int = 0

    # Semantic categorization (populated by WordCategorizer)
    category_counts: CategoryCounts | None = None
    tone_scores: ToneScores | None = None

    def top_nouns(self, n: int = 50) -> list[tuple[str, int]]:
        """Get top N most frequent nouns."""
        return self.noun_counts.most_common(n)

    def top_adjectives(self, n: int = 50) -> list[tuple[str, int]]:
        """Get top N most frequent adjectives."""
        return self.adjective_counts.most_common(n)

    def top_verbs(self, n: int = 50) -> list[tuple[str, int]]:
        """Get top N most frequent verbs."""
        return self.verb_counts.most_common(n)

    def frequency_per_1000(self, counts: Counter) -> dict[str, float]:
        """Get word frequency per 1000 words."""
        if self.total_words == 0:
            return {}
        return {
            word: (count / self.total_words) * 1000
            for word, count in counts.items()
        }

    def noun_frequency_per_1000(self) -> dict[str, float]:
        """Get noun frequency per 1000 words."""
        return self.frequency_per_1000(self.noun_counts)

    def adjective_frequency_per_1000(self) -> dict[str, float]:
        """Get adjective frequency per 1000 words."""
        return self.frequency_per_1000(self.adjective_counts)

    def verb_frequency_per_1000(self) -> dict[str, float]:
        """Get verb frequency per 1000 words."""
        return self.frequency_per_1000(self.verb_counts)

    def to_dict(self) -> dict:
        """Convert to dictionary for JSON export."""
        result = {
            "party": self.party,
            "speech_count": self.speech_count,
            "total_words": self.total_words,
            "total_nouns": self.total_nouns,
            "total_adjectives": self.total_adjectives,
            "total_verbs": self.total_verbs,
            "top_nouns": self.top_nouns(500),
            "top_adjectives": self.top_adjectives(500),
            "top_verbs": self.top_verbs(500),
        }

        # Add categorization data if available
        if self.category_counts:
            result["categories"] = self.category_counts.to_dict()
        if self.tone_scores:
            result["tone_scores"] = self.tone_scores.to_dict()

        return result


class WordAnalyzer:
    """Analyzer for extracting and counting nouns, adjectives, and verbs from German text."""

    # Stopwords - common words that are not meaningful for analysis
    STOPWORD_NOUNS = {
        # Procedural/parliamentary terms
        "herr", "frau", "dame", "kollege", "kollegin",
        "präsident", "präsidentin", "vizepräsident", "vizepräsidentin",
        "abgeordnete", "abgeordneter", "abg",
        "antrag", "drucksache", "nummer", "prozent",
        "beifall", "zuruf", "zwischenfrage",
        # Time words
        "jahr", "jahre", "jahren", "monat", "tag", "zeit", "woche",
        # Generic terms
        "frage", "antwort", "rede", "debatte",
        "punkt", "stelle", "bereich", "rahmen", "grund",
        "art", "weise", "form", "teil", "seite",
        "beispiel", "fall", "sache", "ding", "thema",
        # Party names (analyzed separately)
        "spd", "cdu", "csu", "cdu/csu", "fdp", "afd", "grüne", "grünen",
        "linke", "bsw", "bündnis", "fraktion",
        # Names/titles
        "dr.", "prof.", "dr", "prof",
    }

    STOPWORD_ADJECTIVES = {
        # Generic/weak adjectives
        "groß", "klein", "gut", "schlecht", "neu", "alt",
        "ganz", "viel", "wenig", "mehr", "ander",
        "erst", "letzt", "nächst", "weit", "hoch",
        "klar", "richtig", "falsch", "wichtig",
        # Parliamentary
        "sehr", "geehrt", "lieb", "herzlich",
    }

    STOPWORD_VERBS = {
        # Auxiliary/modal verbs
        "sein", "haben", "werden", "können", "müssen", "sollen", "wollen",
        "dürfen", "mögen", "lassen",
        # Generic verbs
        "machen", "gehen", "kommen", "geben", "nehmen", "sehen",
        "sagen", "wissen", "finden", "stehen", "liegen",
        "heißen", "bleiben", "halten", "bringen", "denken",
    }

    def __init__(self, model: str = "de_core_news_lg"):
        """Initialize with a spaCy model.

        Args:
            model: spaCy model name. Options:
                - de_core_news_sm (small, fast)
                - de_core_news_md (medium)
                - de_core_news_lg (large, most accurate)
        """
        try:
            self.nlp = spacy.load(model)
        except OSError:
            raise RuntimeError(
                f"spaCy model '{model}' not found. Install with:\n"
                f"  python -m spacy download {model}"
            )

        # Disable unused pipeline components for speed
        # Keep morphologizer - it's needed to populate token.pos_
        # Enable ner - needed to detect and merge person names
        self.nlp.select_pipes(enable=["tok2vec", "tagger", "morphologizer", "lemmatizer", "ner"])

        # Semantic word categorizer
        self._categorizer = WordCategorizer()

    def _is_valid_word(self, lemma: str, stopwords: set) -> bool:
        """Check if a word should be included in analysis."""
        return (
            len(lemma) >= 3
            and lemma not in stopwords
            and not lemma.isdigit()
            and not any(c.isdigit() for c in lemma)
            and not lemma.startswith("-")
        )

    def _get_entity_token_indices(self, doc: Doc) -> set[int]:
        """Get indices of tokens that belong to PER (person) entities.

        Used to skip individual name tokens when they've been merged
        into a full name entity.
        """
        entity_tokens = set()
        for ent in doc.ents:
            if ent.label_ == "PER":
                for i in range(ent.start, ent.end):
                    entity_tokens.add(i)
        return entity_tokens

    def extract_words(self, text: str) -> tuple[list[str], list[str], list[str]]:
        """Extract lemmatized nouns, adjectives, and verbs from text.

        Args:
            text: German text to analyze

        Returns:
            Tuple of (nouns, adjectives, verbs) lists
        """
        doc = self.nlp(text)
        nouns = []
        adjectives = []
        verbs = []

        for token in doc:
            lemma = token.lemma_.lower()

            if token.pos_ in ("NOUN", "PROPN"):
                if self._is_valid_word(lemma, self.STOPWORD_NOUNS):
                    nouns.append(lemma)
            elif token.pos_ == "ADJ":
                if self._is_valid_word(lemma, self.STOPWORD_ADJECTIVES):
                    adjectives.append(lemma)
            elif token.pos_ == "VERB":
                if self._is_valid_word(lemma, self.STOPWORD_VERBS):
                    verbs.append(lemma)

        return nouns, adjectives, verbs

    def extract_nouns(self, text: str) -> list[str]:
        """Extract lemmatized nouns from text (for backwards compatibility)."""
        nouns, _, _ = self.extract_words(text)
        return nouns

    def analyze_speeches(
        self,
        speeches: list[dict],
        party: str,
        batch_size: int = 100,
    ) -> AnalysisResult:
        """Analyze a list of speeches and count words using batch processing.

        Args:
            speeches: List of speech dictionaries with 'text' field
            party: Party name for the result
            batch_size: Number of texts to process in each batch

        Returns:
            AnalysisResult with word counts
        """
        result = AnalysisResult(party=party)
        result.speech_count = len(speeches)

        def text_generator():
            """Yield texts one at a time to avoid loading all into memory."""
            for speech in speeches:
                text = speech.get("text", "") or speech.get("payload", {}).get("text", "")
                if text:
                    yield text

        # Process using nlp.pipe() with generator for memory efficiency
        # n_process=1 avoids spawning workers that each load the full model
        for doc in self.nlp.pipe(text_generator(), batch_size=batch_size, n_process=1):
            result.total_words += len([t for t in doc if not t.is_space])

            # Get token indices that are part of person entities
            entity_token_indices = self._get_entity_token_indices(doc)

            # Process person entities as merged names (treated as PROPN)
            for ent in doc.ents:
                if ent.label_ == "PER":
                    merged_name = ent.text.lower()
                    if self._is_valid_word(merged_name, self.STOPWORD_NOUNS):
                        result.noun_counts[merged_name] += 1
                        result.total_nouns += 1

            # Extract words from doc - skip tokens that are part of person entities
            for i, token in enumerate(doc):
                if i in entity_token_indices:
                    continue  # Already counted as merged entity

                lemma = token.lemma_.lower()

                if token.pos_ in ("NOUN", "PROPN"):
                    if self._is_valid_word(lemma, self.STOPWORD_NOUNS):
                        result.noun_counts[lemma] += 1
                        result.total_nouns += 1
                elif token.pos_ == "ADJ":
                    if self._is_valid_word(lemma, self.STOPWORD_ADJECTIVES):
                        result.adjective_counts[lemma] += 1
                        result.total_adjectives += 1
                elif token.pos_ == "VERB":
                    if self._is_valid_word(lemma, self.STOPWORD_VERBS):
                        result.verb_counts[lemma] += 1
                        result.total_verbs += 1

        # Perform semantic categorization on collected words
        result.category_counts = self._categorizer.categorize_words(
            result.adjective_counts,
            result.verb_counts,
        )
        result.tone_scores = self._categorizer.calculate_tone_scores(
            result.category_counts
        )

        return result

    def compare_parties(
        self,
        party_results: list[AnalysisResult],
        top_n: int = 30,
        word_type: str = "noun",
    ) -> dict:
        """Compare word usage across parties.

        Args:
            party_results: List of AnalysisResult for each party
            top_n: Number of top words to compare
            word_type: "noun", "adjective", or "verb"

        Returns:
            Comparison dictionary with relative frequencies
        """
        # Get the right counts based on word type
        if word_type == "adjective":
            get_top = lambda r: r.top_adjectives(top_n)
            get_count = lambda r, w: r.adjective_counts[w]
        elif word_type == "verb":
            get_top = lambda r: r.top_verbs(top_n)
            get_count = lambda r, w: r.verb_counts[w]
        else:
            get_top = lambda r: r.top_nouns(top_n)
            get_count = lambda r, w: r.noun_counts[w]

        # Collect all significant words
        all_words = set()
        for result in party_results:
            all_words.update([w for w, _ in get_top(result)])

        comparison = {}
        for word in all_words:
            comparison[word] = {}
            for result in party_results:
                if result.total_words > 0:
                    freq = (get_count(result, word) / result.total_words) * 1000
                    comparison[word][result.party] = round(freq, 2)

        # Sort by maximum frequency difference
        def freq_variance(word_data):
            values = list(word_data[1].values())
            return max(values) - min(values) if values else 0

        sorted_comparison = dict(
            sorted(comparison.items(), key=freq_variance, reverse=True)
        )

        return sorted_comparison


# Backwards compatibility alias
NounAnalyzer = WordAnalyzer


def load_analyzer(model: str = "de_core_news_lg") -> WordAnalyzer:
    """Load the word analyzer with the specified model."""
    return WordAnalyzer(model)
