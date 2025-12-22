#!/usr/bin/env python3
"""Re-process all downloaded protocols with improved parser."""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from noun_analysis.client import parse_speeches_from_protocol


def reprocess_all_protocols(
    fulltext_dir: str = "data_wp21/fulltext",
    output_file: str = "data_wp21/speeches.json"
):
    """Re-process all protocols and create new speeches.json."""
    fulltext_path = Path(fulltext_dir)

    if not fulltext_path.exists():
        print(f"Error: {fulltext_path} does not exist")
        return

    txt_files = sorted(fulltext_path.glob("*.txt"))
    print(f"Found {len(txt_files)} protocol files")

    speeches_by_party = {}
    total_speeches = 0

    for i, txt_file in enumerate(txt_files, 1):
        print(f"[{i}/{len(txt_files)}] Processing {txt_file.name}...", end=" ", flush=True)

        try:
            with open(txt_file, 'r', encoding='utf-8') as f:
                text = f.read()

            speeches = parse_speeches_from_protocol(text)

            # Group by party
            for speech in speeches:
                party = speech['party']
                if party not in speeches_by_party:
                    speeches_by_party[party] = []
                speeches_by_party[party].append(speech)

            total_speeches += len(speeches)
            print(f"{len(speeches)} speeches")

        except Exception as e:
            print(f"ERROR: {e}")

    # Save to JSON
    output_path = Path(output_file)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(speeches_by_party, f, ensure_ascii=False, indent=2)

    print()
    print("=" * 60)
    print(f"Total speeches: {total_speeches}")
    print(f"Parties: {list(speeches_by_party.keys())}")
    for party, speeches in sorted(speeches_by_party.items(), key=lambda x: -len(x[1])):
        dr_count = sum(1 for s in speeches if s.get('acad_title'))
        print(f"  {party:15} {len(speeches):5} speeches ({dr_count} with Dr.)")
    print(f"\nSaved to {output_path}")


if __name__ == "__main__":
    reprocess_all_protocols()
