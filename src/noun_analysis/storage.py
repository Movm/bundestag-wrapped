"""Data storage for step-based pipeline with resume support."""

import json
from datetime import datetime
from pathlib import Path


class DataStore:
    """Manages persistent storage for the download/parse pipeline.

    Directory structure:
        data_dir/
        ├── state.json          # Progress tracking
        ├── protocols/
        │   ├── {id}.json       # Individual protocol files
        └── speeches.json       # Parsed speeches (after parse step)
    """

    DEFAULT_SERVER = "https://bundestagapi.moritz-waechter.de/mcp"

    def __init__(self, data_dir: Path | str):
        self.data_dir = Path(data_dir)
        self.protocols_dir = self.data_dir / "protocols"
        self.state_file = self.data_dir / "state.json"
        self.speeches_file = self.data_dir / "speeches.json"

    def ensure_dirs(self) -> None:
        """Create data directories if they don't exist."""
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.protocols_dir.mkdir(exist_ok=True)

    def has_state(self) -> bool:
        """Check if state file exists (indicates resume mode)."""
        return self.state_file.exists()

    def load_state(self) -> dict:
        """Load state from disk."""
        if not self.state_file.exists():
            return {}
        return json.loads(self.state_file.read_text())

    def save_state(self, state: dict) -> None:
        """Save state to disk atomically."""
        state["last_updated"] = datetime.now().isoformat()

        # Write to temp file then rename (atomic on POSIX)
        tmp_file = self.state_file.with_suffix(".tmp")
        tmp_file.write_text(json.dumps(state, ensure_ascii=False, indent=2))
        tmp_file.rename(self.state_file)

    def init_state(
        self,
        wahlperiode: int,
        server: str,
        protocol_ids: list[int],
    ) -> dict:
        """Initialize a new state for fresh download."""
        self.ensure_dirs()
        state = {
            "wahlperiode": wahlperiode,
            "server": server,
            "protocol_ids": protocol_ids,
            "downloaded": [],
            "failed": [],
            "parsed": False,
        }
        self.save_state(state)
        return state

    def get_pending_ids(self, state: dict) -> list[int]:
        """Get protocol IDs that still need to be downloaded.

        Returns IDs that are not in downloaded list, plus any failed IDs (for retry).
        """
        downloaded_set = set(state.get("downloaded", []))
        all_ids = state.get("protocol_ids", [])

        # Pending = not downloaded (includes failed for auto-retry)
        pending = [pid for pid in all_ids if pid not in downloaded_set]
        return pending

    def save_protocol(self, protocol_id: int, data: dict) -> None:
        """Save a single protocol to disk."""
        self.ensure_dirs()
        protocol_file = self.protocols_dir / f"{protocol_id}.json"

        # Atomic write
        tmp_file = protocol_file.with_suffix(".tmp")
        tmp_file.write_text(json.dumps(data, ensure_ascii=False, indent=2))
        tmp_file.rename(protocol_file)

    def load_protocol(self, protocol_id: int) -> dict | None:
        """Load a protocol from disk."""
        protocol_file = self.protocols_dir / f"{protocol_id}.json"
        if not protocol_file.exists():
            return None
        return json.loads(protocol_file.read_text())

    def mark_downloaded(self, state: dict, protocol_id: int) -> None:
        """Mark a protocol as successfully downloaded."""
        if protocol_id not in state["downloaded"]:
            state["downloaded"].append(protocol_id)
        # Remove from failed if it was there
        if protocol_id in state.get("failed", []):
            state["failed"].remove(protocol_id)
        self.save_state(state)

    def mark_failed(self, state: dict, protocol_id: int) -> None:
        """Mark a protocol as failed."""
        if protocol_id not in state.get("failed", []):
            state.setdefault("failed", []).append(protocol_id)
        self.save_state(state)

    def get_downloaded_protocols(self) -> list[dict]:
        """Load all downloaded protocols from disk."""
        protocols = []
        for protocol_file in sorted(self.protocols_dir.glob("*.json")):
            try:
                data = json.loads(protocol_file.read_text())
                protocols.append(data)
            except json.JSONDecodeError:
                continue
        return protocols

    def save_speeches(self, speeches_by_party: dict[str, list[dict]]) -> None:
        """Save parsed speeches to disk."""
        tmp_file = self.speeches_file.with_suffix(".tmp")
        tmp_file.write_text(json.dumps(speeches_by_party, ensure_ascii=False, indent=2))
        tmp_file.rename(self.speeches_file)

    def load_speeches(self) -> dict[str, list[dict]] | None:
        """Load parsed speeches from disk."""
        if not self.speeches_file.exists():
            return None
        return json.loads(self.speeches_file.read_text())

    def get_progress_summary(self) -> dict:
        """Get a summary of current progress."""
        state = self.load_state()
        if not state:
            return {"status": "not_started"}

        total = len(state.get("protocol_ids", []))
        downloaded = len(state.get("downloaded", []))
        failed = len(state.get("failed", []))

        return {
            "status": "in_progress" if downloaded < total else "download_complete",
            "wahlperiode": state.get("wahlperiode"),
            "server": state.get("server"),
            "total_protocols": total,
            "downloaded": downloaded,
            "failed": failed,
            "pending": total - downloaded,
            "parsed": state.get("parsed", False),
            "last_updated": state.get("last_updated"),
        }
