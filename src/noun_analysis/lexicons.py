"""Semantic lexicons for German parliamentary speech analysis.

Scheme D: Communication Style categorization
Focus on HOW things are said, not political content.

Lexicons are organized by word type (adjectives, verbs) and semantic category.
Words are stored as lemmatized forms (lowercase) matching spaCy output.
"""

from dataclasses import dataclass
from enum import Enum


class AdjectiveCategory(Enum):
    """Semantic categories for adjectives (Scheme D)."""
    AFFIRMATIVE = "affirmative"   # Positive evaluations
    CRITICAL = "critical"         # Negative evaluations
    AGGRESSIVE = "aggressive"     # Attacks, ridicule, contempt
    LABELING = "labeling"         # Othering, ideological framing


class VerbCategory(Enum):
    """Semantic categories for verbs (Scheme D)."""
    SOLUTION_ORIENTED = "solution"        # Building, improving, solving
    PROBLEM_FOCUSED = "problem"           # Harming, failing, blocking
    COLLABORATIVE = "collaborative"       # Working together, dialogue
    CONFRONTATIONAL = "confrontational"   # Opposing, attacking, accusing
    DEMANDING = "demanding"               # Insisting, requiring
    ACKNOWLEDGING = "acknowledging"       # Praising, thanking, recognizing


@dataclass
class CategoryInfo:
    """Metadata about a semantic category."""
    name: str
    description: str
    emoji: str
    color: str  # CSS color for visualization


ADJECTIVE_CATEGORY_INFO: dict[AdjectiveCategory, CategoryInfo] = {
    AdjectiveCategory.AFFIRMATIVE: CategoryInfo(
        name="Zustimmend",
        description="Positive Bewertungen und Lob",
        emoji="✅",
        color="#22c55e"
    ),
    AdjectiveCategory.CRITICAL: CategoryInfo(
        name="Kritisch",
        description="Negative Bewertungen und Tadel",
        emoji="❌",
        color="#ef4444"
    ),
    AdjectiveCategory.AGGRESSIVE: CategoryInfo(
        name="Aggressiv",
        description="Angriffe, Spott, Verachtung",
        emoji="💢",
        color="#f97316"
    ),
    AdjectiveCategory.LABELING: CategoryInfo(
        name="Etikettierend",
        description="Ideologische Zuschreibungen, Othering",
        emoji="🏷️",
        color="#8b5cf6"
    ),
}

VERB_CATEGORY_INFO: dict[VerbCategory, CategoryInfo] = {
    VerbCategory.SOLUTION_ORIENTED: CategoryInfo(
        name="Lösungsorientiert",
        description="Aufbauen, verbessern, ermöglichen",
        emoji="🔧",
        color="#22c55e"
    ),
    VerbCategory.PROBLEM_FOCUSED: CategoryInfo(
        name="Problemfokussiert",
        description="Schaden, scheitern, blockieren",
        emoji="⚠️",
        color="#ef4444"
    ),
    VerbCategory.COLLABORATIVE: CategoryInfo(
        name="Kooperativ",
        description="Zusammenarbeiten, verhandeln, einigen",
        emoji="🤝",
        color="#3b82f6"
    ),
    VerbCategory.CONFRONTATIONAL: CategoryInfo(
        name="Konfrontativ",
        description="Angreifen, vorwerfen, ablehnen",
        emoji="⚔️",
        color="#f97316"
    ),
    VerbCategory.DEMANDING: CategoryInfo(
        name="Fordernd",
        description="Fordern, verlangen, bestehen auf",
        emoji="📢",
        color="#eab308"
    ),
    VerbCategory.ACKNOWLEDGING: CategoryInfo(
        name="Anerkennend",
        description="Loben, danken, würdigen",
        emoji="👏",
        color="#06b6d4"
    ),
}


# =============================================================================
# ADJECTIVE LEXICONS (Scheme D)
# =============================================================================

ADJECTIVE_LEXICONS: dict[AdjectiveCategory, set[str]] = {
    AdjectiveCategory.AFFIRMATIVE: {
        # Strength/Success
        "stark", "erfolgreich", "wirksam", "effektiv", "leistungsfähig",
        "kompetent", "qualifiziert", "professionell", "zuverlässig",
        "kraftvoll", "mächtig", "tatkräftig",
        # Safety/Security
        "sicher", "stabil", "geschützt", "bewährt", "solide",
        "verlässlich", "beständig",
        # Importance/Value
        "bedeutend", "wertvoll", "wesentlich", "zentral",
        "entscheidend", "maßgeblich", "grundlegend", "elementar",
        # Quality
        "hervorragend", "ausgezeichnet", "vorbildlich", "beispielhaft",
        "exzellent", "erstklassig", "hochwertig", "brillant",
        # Progress
        "innovativ", "zukunftsfähig", "fortschrittlich",
        "nachhaltig", "zukunftsweisend", "bahnbrechend",
        # Fairness
        "gerecht", "fair", "ausgewogen", "vernünftig", "angemessen",
        "sachlich", "konstruktiv", "lösungsorientiert",
        # Social
        "solidarisch", "sozial", "menschlich", "würdig",
        "respektvoll", "demokratisch", "freiheitlich",
        # Economic
        "wirtschaftlich", "rentabel", "produktiv", "wettbewerbsfähig",
    },

    AdjectiveCategory.CRITICAL: {
        # Danger
        "gefährlich", "riskant", "bedrohlich", "kritisch", "prekär",
        "unsicher", "instabil", "brisant",
        # Failure
        "gescheitert", "verfehlt", "misslungen", "fehlgeschlagen",
        "erfolglos", "wirkungslos",
        # Wrong
        "falsch", "irrig", "fehlerhaft", "mangelhaft",
        "unzutreffend", "irreführend",
        # Bad quality
        "schlecht", "schlimm", "übel", "miserabel", "katastrophal",
        "desaströs", "verheerend", "fatal", "dramatisch",
        # Harmful
        "schädlich", "nachteilig", "destruktiv", "kontraproduktiv",
        "problematisch", "bedenklich",
        # Unfair
        "ungerecht", "unfair", "einseitig", "parteiisch",
        "willkürlich", "diskriminierend",
        # Weakness
        "schwach", "ineffektiv", "unzureichend",
        "ungenügend", "insuffizient", "inadäquat",
        # Economic
        "teuer", "kostspielig", "unbezahlbar", "verschwenderisch",
    },

    AdjectiveCategory.AGGRESSIVE: {
        # Absurdity/Ridicule
        "absurd", "lächerlich", "grotesk", "bizarr", "abwegig",
        "unsinnig", "wahnwitzig", "irrsinnig", "haarsträubend",
        "hanebüchen", "aberwitzig",
        # Irresponsibility
        "unverantwortlich", "fahrlässig", "rücksichtslos", "skrupellos",
        "verantwortungslos", "gewissenlos", "leichtsinnig",
        # Scandal
        "skandalös", "empörend", "unerhört", "unverschämt", "dreist",
        "ungeheuerlich", "unfassbar", "bodenlos", "schändlich",
        # Incompetence
        "inkompetent", "unfähig", "dilettantisch", "stümperhaft",
        "amateurhaft", "unprofessionell", "planlos", "kopflos",
        # Dishonesty
        "verlogen", "heuchlerisch", "scheinheilig", "unehrlich",
        "unglaubwürdig", "doppelzüngig", "korrupt", "betrügerisch",
        # Contempt
        "erbärmlich", "armselig", "kläglich", "jämmerlich",
        "peinlich", "beschämend", "blamabel",
    },

    AdjectiveCategory.LABELING: {
        # Ideological labeling
        "ideologisch", "ideologiegetrieben", "ideologieverblendet",
        # Political extremism labels
        "radikal", "extremistisch", "fanatisch", "fundamentalistisch",
        "verblendet", "verbohrt", "dogmatisch",
        # Left-right labels (when used pejoratively)
        "links", "linksradikal", "linksextrem", "linksgrün",
        "rechts", "rechtsradikal", "rechtsextrem", "rechtspopulistisch",
        # Movement labels
        "populistisch", "nationalistisch", "sozialistisch", "kommunistisch",
        "klimahysterisch", "woke",
        # Othering
        "weltfremd", "realitätsfern", "abgehoben", "elitär",
        # Anti-system
        "systemisch", "staatsfeindlich", "verfassungsfeindlich",
    },
}


# =============================================================================
# VERB LEXICONS (Scheme D)
# =============================================================================

VERB_LEXICONS: dict[VerbCategory, set[str]] = {
    VerbCategory.SOLUTION_ORIENTED: {
        # Support
        "unterstützen", "fördern", "stärken", "helfen", "beistehen",
        "assistieren", "beitragen", "mitwirken",
        # Building
        "aufbauen", "entwickeln", "gestalten", "schaffen", "errichten",
        "etablieren", "gründen", "initiieren",
        # Investment
        "investieren", "finanzieren", "bereitstellen", "zuweisen",
        "bewilligen", "ausgeben",
        # Protection
        "schützen", "bewahren", "sichern", "verteidigen", "garantieren",
        "wahren", "erhalten",
        # Improvement
        "verbessern", "optimieren", "modernisieren", "reformieren",
        "erneuern", "weiterentwickeln", "ausbauen", "erweitern",
        # Solving
        "lösen", "beheben", "beseitigen", "überwinden", "meistern",
        # Enabling
        "ermöglichen", "erlauben", "eröffnen", "befähigen",
        "berechtigen", "freigeben",
        # Progress
        "vorankommen", "fortschreiten", "gelingen", "erreichen",
        "verwirklichen", "realisieren", "umsetzen",
        # Healing/Repair
        "heilen", "reparieren", "wiederherstellen", "sanieren",
        "rehabilitieren", "regenerieren",
        # Future
        "planen", "vorbereiten", "anstreben", "beabsichtigen",
        "vorhaben", "anvisieren",
    },

    VerbCategory.PROBLEM_FOCUSED: {
        # Destruction
        "zerstören", "vernichten", "ruinieren", "demolieren",
        "kaputtmachen", "zunichtemachen", "zersetzen",
        # Reduction
        "kürzen", "streichen", "reduzieren", "abbauen", "einsparen",
        "zusammenstreichen", "halbieren", "dezimieren",
        # Endangerment
        "gefährden", "bedrohen", "riskieren", "aufs-spiel-setzen",
        "untergraben", "aushöhlen",
        # Failure
        "versagen", "scheitern", "fehlschlagen", "versäumen",
        "vernachlässigen", "verpassen",
        # Harm
        "schaden", "schädigen", "beeinträchtigen",
        "schwächen", "beschädigen", "belasten",
        # Blocking
        "blockieren", "verhindern", "sabotieren", "torpedieren",
        "boykottieren", "obstruieren",
        # Escalation/Alarm
        "eskalieren", "verschlimmern", "verschlechtern",
        "verschärfen", "zuspitzen",
        # Collapse
        "zusammenbrechen", "kollabieren", "abstürzen", "einbrechen",
    },

    VerbCategory.COLLABORATIVE: {
        # Agreement
        "zustimmen", "einwilligen", "genehmigen", "billigen",
        "befürworten", "gutheißen",
        # Collaboration
        "zusammenarbeiten", "kooperieren", "mitwirken", "mitarbeiten",
        "partizipieren", "teilnehmen",
        # Compromise
        "einigen", "vermitteln", "ausgleichen", "annähern",
        "überbrücken", "versöhnen",
        # Dialogue
        "verhandeln", "beraten", "diskutieren", "austauschen",
        "konsultieren", "abstimmen",
        # Inclusion
        "einbeziehen", "einbinden", "beteiligen", "integrieren",
        "berücksichtigen", "respektieren",
    },

    VerbCategory.CONFRONTATIONAL: {
        # Attack
        "angreifen", "attackieren", "bekämpfen", "bekriegen",
        "anfechten", "anprangern",
        # Accusation
        "vorwerfen", "beschuldigen", "bezichtigen", "anklagen",
        "unterstellen", "verleumden", "diffamieren",
        # Criticism
        "kritisieren", "tadeln", "rügen", "beanstanden", "bemängeln",
        "monieren", "missbilligen",
        # Rejection
        "ablehnen", "zurückweisen", "verwerfen", "widersprechen",
        "verweigern", "abweisen", "abschmettern",
        # Blame
        "verantworten", "verurteilen", "brandmarken", "geißeln",
        # Dispute
        "bestreiten", "anzweifeln", "infrage-stellen", "dementieren",
        "widerlegen",
        # Threat/Warning (confrontational context)
        "drohen", "androhen", "warnen", "mahnen",
    },

    VerbCategory.DEMANDING: {
        # Direct demands
        "fordern", "verlangen", "bestehen", "drängen", "pochen",
        "beharren", "insistieren",
        # Necessity/obligation
        "müssen", "zwingen", "nötigen", "verpflichten",
        "auffordern", "auferlegen",
        # Pressure
        "druck-machen", "unter-druck-setzen", "einfordern",
        "durchsetzen", "erzwingen",
        # Urging
        "aufrufen", "appellieren", "anmahnen", "ermahnen",
        "beschwören", "antreiben",
    },

    VerbCategory.ACKNOWLEDGING: {
        # Praise
        "loben", "würdigen", "honorieren", "wertschätzen",
        "anerkennen", "respektieren",
        # Thanks
        "danken", "bedanken", "verdanken",
        # Welcome
        "begrüßen", "willkommen-heißen", "freuen",
        # Recognition
        "gratulieren", "beglückwünschen", "feiern",
        "hervorheben", "betonen",
        # Appreciation
        "schätzen", "achten", "ehren", "hochachten",
    },
}


def get_all_categorized_adjectives() -> dict[str, AdjectiveCategory]:
    """Build reverse lookup: word -> category for adjectives."""
    lookup = {}
    for category, words in ADJECTIVE_LEXICONS.items():
        for word in words:
            lookup[word] = category
    return lookup


def get_all_categorized_verbs() -> dict[str, VerbCategory]:
    """Build reverse lookup: word -> category for verbs."""
    lookup = {}
    for category, words in VERB_LEXICONS.items():
        for word in words:
            lookup[word] = category
    return lookup


# Pre-built lookups for performance
_ADJ_LOOKUP: dict[str, AdjectiveCategory] | None = None
_VERB_LOOKUP: dict[str, VerbCategory] | None = None


def categorize_adjective(lemma: str) -> AdjectiveCategory | None:
    """Fast categorization of a single adjective lemma."""
    global _ADJ_LOOKUP
    if _ADJ_LOOKUP is None:
        _ADJ_LOOKUP = get_all_categorized_adjectives()
    return _ADJ_LOOKUP.get(lemma.lower())


def categorize_verb(lemma: str) -> VerbCategory | None:
    """Fast categorization of a single verb lemma."""
    global _VERB_LOOKUP
    if _VERB_LOOKUP is None:
        _VERB_LOOKUP = get_all_categorized_verbs()
    return _VERB_LOOKUP.get(lemma.lower())
