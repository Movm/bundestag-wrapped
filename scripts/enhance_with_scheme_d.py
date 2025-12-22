#!/usr/bin/env python3
"""Re-enhance existing data with Scheme D categorization."""

import json
from collections import Counter
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from noun_analysis.categorizer import WordCategorizer, CategoryCounts, ToneScores


def enhance_party_data(party_data: dict) -> dict:
    """Add Scheme D categorization to party data."""
    categorizer = WordCategorizer()
    
    # Build counters from top words lists
    adj_counts = Counter()
    verb_counts = Counter()
    
    for word, count in party_data.get("top_adjectives", []):
        adj_counts[word] = count
    
    for word, count in party_data.get("top_verbs", []):
        verb_counts[word] = count
    
    # Categorize
    category_counts = categorizer.categorize_words(adj_counts, verb_counts)
    tone_scores = categorizer.calculate_tone_scores(category_counts)
    
    # Add to party data
    party_data["categories"] = category_counts.to_dict()
    party_data["tone_scores"] = tone_scores.to_dict()
    
    return party_data


def main():
    data_dir = Path(__file__).parent.parent / "results_wp21"
    full_data_path = data_dir / "full_data.json"
    
    if not full_data_path.exists():
        print(f"Error: {full_data_path} not found")
        return 1
    
    print(f"Loading {full_data_path}...")
    with open(full_data_path) as f:
        full_data = json.load(f)
    
    print(f"Found {len(full_data['results'])} party results")
    
    for i, party_data in enumerate(full_data["results"]):
        party = party_data["party"]
        print(f"  Enhancing {party}...")
        full_data["results"][i] = enhance_party_data(party_data)
        
        # Print summary
        scores = full_data["results"][i]["tone_scores"]
        print(f"    Affirmative: {scores['affirmative']:.0f}%")
        print(f"    Aggression: {scores['aggression']:.0f}%")
        print(f"    Labeling: {scores['labeling']:.0f}%")
        print(f"    Solution Focus: {scores['solution_focus']:.0f}%")
        print(f"    Collaboration: {scores['collaboration']:.0f}%")
    
    # Save enhanced data
    print(f"\nSaving to {full_data_path}...")
    with open(full_data_path, "w") as f:
        json.dump(full_data, f, indent=2, ensure_ascii=False)
    
    print("Done!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
