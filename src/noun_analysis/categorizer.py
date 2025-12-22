"""Word categorization engine for semantic analysis.

Scheme D: Communication Style categorization
"""

from collections import Counter
from dataclasses import dataclass, field

from .lexicons import (
    AdjectiveCategory,
    VerbCategory,
    categorize_adjective,
    categorize_verb,
)


@dataclass
class CategoryCounts:
    """Counts of words in each semantic category (Scheme D)."""

    # Adjective categories
    adj_affirmative: Counter = field(default_factory=Counter)
    adj_critical: Counter = field(default_factory=Counter)
    adj_aggressive: Counter = field(default_factory=Counter)
    adj_labeling: Counter = field(default_factory=Counter)

    # Verb categories
    verb_solution: Counter = field(default_factory=Counter)
    verb_problem: Counter = field(default_factory=Counter)
    verb_collaborative: Counter = field(default_factory=Counter)
    verb_confrontational: Counter = field(default_factory=Counter)
    verb_demanding: Counter = field(default_factory=Counter)
    verb_acknowledging: Counter = field(default_factory=Counter)

    # Totals for normalization
    total_adjectives: int = 0
    total_verbs: int = 0

    def get_adjective_counter(self, category: AdjectiveCategory) -> Counter:
        """Get counter for adjective category."""
        return {
            AdjectiveCategory.AFFIRMATIVE: self.adj_affirmative,
            AdjectiveCategory.CRITICAL: self.adj_critical,
            AdjectiveCategory.AGGRESSIVE: self.adj_aggressive,
            AdjectiveCategory.LABELING: self.adj_labeling,
        }[category]

    def get_verb_counter(self, category: VerbCategory) -> Counter:
        """Get counter for verb category."""
        return {
            VerbCategory.SOLUTION_ORIENTED: self.verb_solution,
            VerbCategory.PROBLEM_FOCUSED: self.verb_problem,
            VerbCategory.COLLABORATIVE: self.verb_collaborative,
            VerbCategory.CONFRONTATIONAL: self.verb_confrontational,
            VerbCategory.DEMANDING: self.verb_demanding,
            VerbCategory.ACKNOWLEDGING: self.verb_acknowledging,
        }[category]

    def adjective_category_totals(self) -> dict[AdjectiveCategory, int]:
        """Get total count per adjective category."""
        return {
            AdjectiveCategory.AFFIRMATIVE: sum(self.adj_affirmative.values()),
            AdjectiveCategory.CRITICAL: sum(self.adj_critical.values()),
            AdjectiveCategory.AGGRESSIVE: sum(self.adj_aggressive.values()),
            AdjectiveCategory.LABELING: sum(self.adj_labeling.values()),
        }

    def verb_category_totals(self) -> dict[VerbCategory, int]:
        """Get total count per verb category."""
        return {
            VerbCategory.SOLUTION_ORIENTED: sum(self.verb_solution.values()),
            VerbCategory.PROBLEM_FOCUSED: sum(self.verb_problem.values()),
            VerbCategory.COLLABORATIVE: sum(self.verb_collaborative.values()),
            VerbCategory.CONFRONTATIONAL: sum(self.verb_confrontational.values()),
            VerbCategory.DEMANDING: sum(self.verb_demanding.values()),
            VerbCategory.ACKNOWLEDGING: sum(self.verb_acknowledging.values()),
        }

    def to_dict(self) -> dict:
        """Export to dictionary for JSON serialization."""
        return {
            "adjectives": {
                "affirmative": dict(self.adj_affirmative.most_common(50)),
                "critical": dict(self.adj_critical.most_common(50)),
                "aggressive": dict(self.adj_aggressive.most_common(50)),
                "labeling": dict(self.adj_labeling.most_common(50)),
                "totals": {
                    cat.value: count
                    for cat, count in self.adjective_category_totals().items()
                },
                "total_analyzed": self.total_adjectives,
            },
            "verbs": {
                "solution": dict(self.verb_solution.most_common(50)),
                "problem": dict(self.verb_problem.most_common(50)),
                "collaborative": dict(self.verb_collaborative.most_common(50)),
                "confrontational": dict(self.verb_confrontational.most_common(50)),
                "demanding": dict(self.verb_demanding.most_common(50)),
                "acknowledging": dict(self.verb_acknowledging.most_common(50)),
                "totals": {
                    cat.value: count
                    for cat, count in self.verb_category_totals().items()
                },
                "total_analyzed": self.total_verbs,
            },
        }


@dataclass
class ToneScores:
    """Aggregate tone/sentiment scores derived from categorization (Scheme D).

    All scores are on a 0-100 scale.
    """

    # Adjective-based scores
    affirmative_score: float = 50.0      # AFFIRMATIVE / (AFFIRMATIVE + CRITICAL)
    aggression_index: float = 0.0        # AGGRESSIVE / total_categorized_adj
    labeling_index: float = 0.0          # LABELING / total_categorized_adj

    # Verb-based scores
    solution_focus: float = 50.0         # SOLUTION / (SOLUTION + PROBLEM)
    collaboration_score: float = 50.0    # COLLABORATIVE / (COLLAB + CONFRONT)
    demand_intensity: float = 0.0        # DEMANDING / total_categorized_verbs
    acknowledgment_rate: float = 0.0     # ACKNOWLEDGING / total_categorized_verbs

    def to_dict(self) -> dict:
        """Export to dictionary."""
        return {
            "affirmative": round(self.affirmative_score, 1),
            "aggression": round(self.aggression_index, 1),
            "labeling": round(self.labeling_index, 1),
            "solution_focus": round(self.solution_focus, 1),
            "collaboration": round(self.collaboration_score, 1),
            "demand_intensity": round(self.demand_intensity, 1),
            "acknowledgment": round(self.acknowledgment_rate, 1),
        }


class WordCategorizer:
    """Categorizes words into semantic categories using lexicons."""

    def categorize_words(
        self,
        adjective_counts: Counter,
        verb_counts: Counter,
    ) -> CategoryCounts:
        """Categorize word counts from analysis results.

        Args:
            adjective_counts: Counter of adjective lemmas -> count
            verb_counts: Counter of verb lemmas -> count

        Returns:
            CategoryCounts with counts per category
        """
        counts = CategoryCounts()
        counts.total_adjectives = sum(adjective_counts.values())
        counts.total_verbs = sum(verb_counts.values())

        for adj, count in adjective_counts.items():
            category = categorize_adjective(adj)
            if category:
                counts.get_adjective_counter(category)[adj] += count

        for verb, count in verb_counts.items():
            category = categorize_verb(verb)
            if category:
                counts.get_verb_counter(category)[verb] += count

        return counts

    def calculate_tone_scores(self, counts: CategoryCounts) -> ToneScores:
        """Calculate aggregate tone scores from category counts (Scheme D).

        Score formulas:
        - Affirmative: AFFIRMATIVE / (AFFIRMATIVE + CRITICAL) * 100
        - Aggression: AGGRESSIVE / total_categorized_adj * 100
        - Labeling: LABELING / total_categorized_adj * 100
        - Solution Focus: SOLUTION / (SOLUTION + PROBLEM) * 100
        - Collaboration: COLLABORATIVE / (COLLABORATIVE + CONFRONTATIONAL) * 100
        - Demand Intensity: DEMANDING / total_categorized_verbs * 100
        - Acknowledgment: ACKNOWLEDGING / total_categorized_verbs * 100
        """
        scores = ToneScores()

        adj_totals = counts.adjective_category_totals()
        verb_totals = counts.verb_category_totals()

        # Affirmative vs Critical
        aff = adj_totals[AdjectiveCategory.AFFIRMATIVE]
        crit = adj_totals[AdjectiveCategory.CRITICAL]
        if aff + crit > 0:
            scores.affirmative_score = (aff / (aff + crit)) * 100

        # Aggression Index (% of categorized adjectives that are aggressive)
        total_cat_adj = sum(adj_totals.values())
        if total_cat_adj > 0:
            scores.aggression_index = (
                adj_totals[AdjectiveCategory.AGGRESSIVE] / total_cat_adj
            ) * 100
            # Labeling Index (new in Scheme D)
            scores.labeling_index = (
                adj_totals[AdjectiveCategory.LABELING] / total_cat_adj
            ) * 100

        # Solution Focus (SOLUTION vs PROBLEM)
        sol = verb_totals[VerbCategory.SOLUTION_ORIENTED]
        prob = verb_totals[VerbCategory.PROBLEM_FOCUSED]
        if sol + prob > 0:
            scores.solution_focus = (sol / (sol + prob)) * 100

        # Collaboration Score (COLLABORATIVE vs CONFRONTATIONAL)
        collab = verb_totals[VerbCategory.COLLABORATIVE]
        conf = verb_totals[VerbCategory.CONFRONTATIONAL]
        if collab + conf > 0:
            scores.collaboration_score = (collab / (collab + conf)) * 100

        # Demand and Acknowledgment indices (% of categorized verbs)
        total_cat_verb = sum(verb_totals.values())
        if total_cat_verb > 0:
            scores.demand_intensity = (
                verb_totals[VerbCategory.DEMANDING] / total_cat_verb
            ) * 100
            scores.acknowledgment_rate = (
                verb_totals[VerbCategory.ACKNOWLEDGING] / total_cat_verb
            ) * 100

        return scores
