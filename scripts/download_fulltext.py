#!/usr/bin/env python3
"""Download full text of all Plenarprotokolle and save as .txt files."""

import asyncio
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from noun_analysis.client import BundestagMCPClient


SERVER_URL = "https://bundestagapi.moritz-waechter.de"


async def download_all_protocols(wahlperiode: int = 21, output_dir: str = "data_wp21/fulltext"):
    """Download all protocol full texts."""
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    async with BundestagMCPClient(SERVER_URL) as client:
        # Get all protocol IDs
        print(f"Fetching protocol list for WP{wahlperiode}...")
        protocols = await client.get_all_protocol_ids(
            wahlperiode=wahlperiode,
            herausgeber="BT",
            max_protocols=0,  # All
        )

        print(f"Found {len(protocols)} protocols. Downloading full text...")

        for i, protocol in enumerate(protocols, 1):
            protocol_id = protocol.get("id")
            doc_nr = protocol.get("dokumentnummer", "unknown")

            # Skip if already downloaded
            txt_file = output_path / f"{doc_nr.replace('/', '_')}.txt"
            if txt_file.exists():
                print(f"  [{i}/{len(protocols)}] {doc_nr} - already exists, skipping")
                continue

            print(f"  [{i}/{len(protocols)}] Downloading {doc_nr}...", end=" ", flush=True)

            try:
                result = await client.get_plenarprotokoll(int(protocol_id), include_full_text=True)

                if result and result.get("fullText"):
                    full_text = result["fullText"]
                    txt_file.write_text(full_text, encoding="utf-8")
                    print(f"OK ({len(full_text):,} chars)")
                else:
                    print("no fullText")
            except Exception as e:
                print(f"ERROR: {e}")

            await asyncio.sleep(0.2)  # Rate limiting

    print(f"\nDone! Files saved to {output_path}/")


if __name__ == "__main__":
    asyncio.run(download_all_protocols())
