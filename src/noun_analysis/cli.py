"""CLI interface for Bundestag word frequency analysis."""

import asyncio
import json
from datetime import datetime
from pathlib import Path

import click
import pandas as pd
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn
from rich.table import Table

from .analyzer import WordAnalyzer, AnalysisResult, load_analyzer
from .client import BundestagMCPClient, test_connection, parse_speeches_from_protocol
from .storage import DataStore

console = Console()

# German Bundestag parties (WP 20)
PARTIES = [
    "SPD",
    "CDU/CSU",
    "GRÜNE",
    "FDP",
    "AfD",
    "DIE LINKE",
    "BSW",
    "fraktionslos",
]


@click.group()
@click.option("--server", default="http://localhost:3000", help="MCP server URL")
@click.pass_context
def main(ctx, server: str):
    """Analyze word frequency by party in Bundestag speeches."""
    ctx.ensure_object(dict)
    ctx.obj["server"] = server


@main.command()
@click.pass_context
def test(ctx):
    """Test connection to the MCP server."""
    server = ctx.obj["server"]
    console.print(f"Testing connection to [blue]{server}[/]...")

    success = asyncio.run(test_connection(server))

    if success:
        console.print("[green]Connection successful![/]")
    else:
        console.print("[red]Connection failed![/]")
        raise SystemExit(1)


@main.command()
@click.argument("data_dir", type=click.Path(), required=False)
@click.option("--parties", "-p", multiple=True, help="Parties to analyze (default: all found)")
@click.option("--wahlperiode", "-w", default=20, help="Legislative period")
@click.option("--max-protocols", "-m", default=5, help="Max Plenarprotokolle (0 = all)")
@click.option("--model", default="de_core_news_lg", help="spaCy model")
@click.option("--output-dir", "-o", type=click.Path(), help="Output directory for results")
@click.option("--top", "-n", default=30, help="Number of top words to show per type")
@click.option("--quiet", "-q", is_flag=True, help="Suppress table output (for batch processing)")
@click.pass_context
def analyze(ctx, data_dir, parties, wahlperiode, max_protocols, model, output_dir, top, quiet):
    """Analyze word frequency (nouns, adjectives, verbs) across parties.

    If DATA_DIR is provided, reads from cached speeches.json (requires 'parse' step first).
    Otherwise, fetches directly from MCP server.
    """
    server = ctx.obj["server"]
    selected_parties = set(parties) if parties else None

    console.print(f"\n[bold]Bundestag Word Frequency Analysis[/]")

    # Load analyzer
    with console.status("Loading spaCy model..."):
        try:
            analyzer = load_analyzer(model)
        except RuntimeError as e:
            console.print(f"[red]{e}[/]")
            raise SystemExit(1)

    console.print(f"[green]Loaded model: {model}[/]\n")

    # Check if using cached data
    if data_dir:
        store = DataStore(data_dir)
        speeches_by_party = store.load_speeches()

        if speeches_by_party is None:
            console.print(f"[red]No speeches.json found in {data_dir}. Run 'parse' first.[/]")
            raise SystemExit(1)

        console.print(f"Source: [cyan]{data_dir}/speeches.json[/]")
        state = store.load_state()
        wahlperiode = state.get("wahlperiode", wahlperiode)
        console.print(f"Wahlperiode: {wahlperiode}")

        # Filter parties if specified
        if selected_parties:
            speeches_by_party = {
                p: s for p, s in speeches_by_party.items()
                if p in selected_parties
            }
            console.print(f"Filter parties: {', '.join(selected_parties)}")

        console.print(f"\n[bold]Found {len(speeches_by_party)} parties[/]\n")

        # Analyze each party
        results = []
        for party, speeches in speeches_by_party.items():
            with console.status(f"Analyzing {party}..."):
                result = analyzer.analyze_speeches(speeches, party)
                results.append(result)
            console.print(
                f"  [dim]{party}: {len(speeches)} speeches | "
                f"{result.total_nouns:,} nouns, "
                f"{result.total_adjectives:,} adj, "
                f"{result.total_verbs:,} verbs[/]"
            )
    else:
        # Existing behavior: fetch from server
        console.print(f"Server: {server}")
        console.print(f"Wahlperiode: {wahlperiode}")
        if max_protocols == 0:
            console.print("Protocols: [bold]ALL[/]")
        else:
            console.print(f"Max Plenarprotokolle: {max_protocols}")
        if selected_parties:
            console.print(f"Filter parties: {', '.join(selected_parties)}")
        console.print()

        # Use 0 for "all" which the client now handles with pagination
        fetch_limit = max_protocols

        # Fetch and analyze using Plenarprotokolle
        results = asyncio.run(
            _fetch_and_analyze_protocols(
                server, wahlperiode, fetch_limit, analyzer, selected_parties
            )
        )

    if not results:
        console.print("[yellow]No speeches found![/]")
        raise SystemExit(1)

    # Display results (unless quiet mode)
    if not quiet:
        _display_results(results, top)

        # Compare parties
        if len(results) > 1:
            _display_comparison(analyzer, results, top)

    # Export results
    if output_dir:
        _export_scientific_results(results, output_dir, wahlperiode)
        console.print(f"\n[green]Results exported to {output_dir}/[/]")


async def _fetch_and_analyze_protocols(
    server: str,
    wahlperiode: int,
    max_protocols: int,
    analyzer: WordAnalyzer,
    selected_parties: set[str] | None = None,
) -> list[AnalysisResult]:
    """Fetch speeches from Plenarprotokolle and analyze them."""
    results = []

    async with BundestagMCPClient(server) as client:
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TextColumn("{task.completed}/{task.total}"),
            console=console,
        ) as progress:
            # Total will be updated once we know how many protocols exist
            task = progress.add_task("Fetching Plenarprotokolle...", total=None)

            def update_progress(current, total, doc_nr):
                progress.update(task, completed=current, total=total,
                              description=f"Fetching {doc_nr}...")

            # Fetch all speeches grouped by party (batch_size=20 for stability)
            speeches_by_party = await client.get_speeches_from_protocols(
                wahlperiode=wahlperiode,
                max_protocols=max_protocols,
                progress_callback=update_progress,
                batch_size=20,
            )

        # Filter parties if specified
        if selected_parties:
            speeches_by_party = {
                p: s for p, s in speeches_by_party.items()
                if p in selected_parties
            }

        # Analyze each party
        console.print(f"\n[bold]Found {len(speeches_by_party)} parties[/]\n")

        for party, speeches in speeches_by_party.items():
            with console.status(f"Analyzing {party}..."):
                result = analyzer.analyze_speeches(speeches, party)
                results.append(result)
            console.print(
                f"  [dim]{party}: {len(speeches)} speeches | "
                f"{result.total_nouns:,} nouns, "
                f"{result.total_adjectives:,} adj, "
                f"{result.total_verbs:,} verbs[/]"
            )

    return results




def _display_results(results: list[AnalysisResult], top_n: int):
    """Display individual party results for all word types."""
    for result in results:
        # Nouns
        table = Table(title=f"\n{result.party} - Top {top_n} Nouns")
        table.add_column("Noun", style="cyan")
        table.add_column("Count", justify="right")
        table.add_column("per 1000", justify="right")

        freq = result.noun_frequency_per_1000()
        for word, count in result.top_nouns(top_n):
            table.add_row(word, str(count), f"{freq.get(word, 0):.2f}")
        console.print(table)

        # Adjectives
        table = Table(title=f"{result.party} - Top {top_n} Adjectives")
        table.add_column("Adjective", style="yellow")
        table.add_column("Count", justify="right")
        table.add_column("per 1000", justify="right")

        freq = result.adjective_frequency_per_1000()
        for word, count in result.top_adjectives(top_n):
            table.add_row(word, str(count), f"{freq.get(word, 0):.2f}")
        console.print(table)

        # Verbs
        table = Table(title=f"{result.party} - Top {top_n} Verbs")
        table.add_column("Verb", style="green")
        table.add_column("Count", justify="right")
        table.add_column("per 1000", justify="right")

        freq = result.verb_frequency_per_1000()
        for word, count in result.top_verbs(top_n):
            table.add_row(word, str(count), f"{freq.get(word, 0):.2f}")
        console.print(table)


def _display_comparison(
    analyzer: WordAnalyzer, results: list[AnalysisResult], top_n: int
):
    """Display party comparison tables for all word types."""
    parties = [r.party for r in results]

    for word_type, title, style in [
        ("noun", "Nouns", "cyan"),
        ("adjective", "Adjectives", "yellow"),
        ("verb", "Verbs", "green"),
    ]:
        comparison = analyzer.compare_parties(results, top_n, word_type=word_type)

        table = Table(title=f"\n{title} - Party Comparison (per 1000 words)")
        table.add_column(title[:-1], style=style)

        for party in parties:
            table.add_column(party, justify="right")

        # Show top 20 most differentiating words
        for word, freqs in list(comparison.items())[:20]:
            row = [word]
            values = [freqs.get(p, 0) for p in parties]
            max_val = max(values) if values else 0

            for party in parties:
                val = freqs.get(party, 0)
                if val == max_val and max_val > 0:
                    row.append(f"[bold green]{val:.2f}[/]")
                else:
                    row.append(f"{val:.2f}")

            table.add_row(*row)

        console.print(table)


def _export_scientific_results(results: list[AnalysisResult], output_dir: str, wahlperiode: int):
    """Export comprehensive results for scientific analysis.

    Creates multiple files:
    - summary.json: Overview with metadata
    - nouns.csv: All nouns with counts and frequencies per party
    - adjectives.csv: All adjectives with counts and frequencies per party
    - verbs.csv: All verbs with counts and frequencies per party
    - full_data.json: Complete data for programmatic access
    """
    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().isoformat()
    parties = [r.party for r in results]

    # Summary JSON
    summary = {
        "metadata": {
            "generated_at": timestamp,
            "wahlperiode": wahlperiode,
            "parties": parties,
            "total_speeches": sum(r.speech_count for r in results),
            "total_words": sum(r.total_words for r in results),
        },
        "party_stats": [
            {
                "party": r.party,
                "speeches": r.speech_count,
                "total_words": r.total_words,
                "unique_nouns": len(r.noun_counts),
                "unique_adjectives": len(r.adjective_counts),
                "unique_verbs": len(r.verb_counts),
                "total_nouns": r.total_nouns,
                "total_adjectives": r.total_adjectives,
                "total_verbs": r.total_verbs,
            }
            for r in results
        ],
    }
    (out_path / "summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2)
    )

    # Export each word type to CSV
    for word_type, get_counts in [
        ("nouns", lambda r: r.noun_counts),
        ("adjectives", lambda r: r.adjective_counts),
        ("verbs", lambda r: r.verb_counts),
    ]:
        # Collect all unique words
        all_words = set()
        for r in results:
            all_words.update(get_counts(r).keys())

        rows = []
        for word in sorted(all_words):
            row = {"word": word}
            for r in results:
                count = get_counts(r)[word]
                row[f"{r.party}_count"] = count
                if r.total_words > 0:
                    row[f"{r.party}_per1000"] = round(
                        (count / r.total_words) * 1000, 4
                    )
                else:
                    row[f"{r.party}_per1000"] = 0.0
            rows.append(row)

        df = pd.DataFrame(rows)
        df.to_csv(out_path / f"{word_type}.csv", index=False)

    # Full JSON export
    full_data = {
        "metadata": summary["metadata"],
        "results": [r.to_dict() for r in results],
    }
    (out_path / "full_data.json").write_text(
        json.dumps(full_data, ensure_ascii=False, indent=2)
    )

    console.print(f"  [dim]Created: summary.json, nouns.csv, adjectives.csv, verbs.csv, full_data.json[/]")


@main.command()
@click.option("--model", default="de_core_news_lg", help="spaCy model to download")
def download_model(model: str):
    """Download the required spaCy model."""
    import subprocess
    import sys

    console.print(f"Downloading spaCy model: {model}")
    subprocess.run([sys.executable, "-m", "spacy", "download", model], check=True)
    console.print(f"[green]Model {model} downloaded successfully![/]")


@main.command()
@click.argument("data_dir", type=click.Path())
@click.option("--wahlperiode", "-w", default=20, help="Legislative period")
@click.option("--max-protocols", "-m", default=0, help="Max protocols (0 = all)")
@click.pass_context
def download(ctx, data_dir: str, wahlperiode: int, max_protocols: int):
    """Download Plenarprotokolle to disk for later analysis.

    Supports resume: if state.json exists, continues from where it left off.
    """
    server = ctx.obj["server"]
    store = DataStore(data_dir)

    # Check for resume mode
    if store.has_state():
        state = store.load_state()
        console.print(f"[yellow]Resuming download from {data_dir}[/]")
        console.print(f"  Server: {state['server']}")
        console.print(f"  Wahlperiode: {state['wahlperiode']}")

        pending = store.get_pending_ids(state)
        console.print(f"  Already downloaded: {len(state['downloaded'])}")
        console.print(f"  Pending: {len(pending)}")

        if not pending:
            console.print("[green]Download already complete![/]")
            return

        # Use server from state
        server = state["server"]
    else:
        state = None
        pending = None
        console.print(f"[bold]Starting fresh download to {data_dir}[/]")
        console.print(f"  Server: {server}")
        console.print(f"  Wahlperiode: {wahlperiode}")
        if max_protocols:
            console.print(f"  Max protocols: {max_protocols}")

    asyncio.run(_download_protocols(store, server, wahlperiode, max_protocols, state, pending))


async def _download_protocols(
    store: DataStore,
    server: str,
    wahlperiode: int,
    max_protocols: int,
    state: dict | None,
    pending: list[int] | None,
):
    """Download protocols with progress tracking."""
    async with BundestagMCPClient(server) as client:
        # If no state, fetch protocol list first
        if state is None:
            console.print("\nFetching protocol list...")
            protocols = await client.get_all_protocol_ids(
                wahlperiode=wahlperiode,
                herausgeber="BT",
                max_protocols=max_protocols,
            )
            protocol_ids = [int(p["id"]) for p in protocols]
            console.print(f"  Found {len(protocol_ids)} protocols")

            state = store.init_state(wahlperiode, server, protocol_ids)
            pending = protocol_ids

        # Download each protocol
        total = len(pending)
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TextColumn("{task.completed}/{task.total}"),
            console=console,
        ) as progress:
            task = progress.add_task("Downloading...", total=total)

            for i, protocol_id in enumerate(pending):
                progress.update(task, description=f"Protocol {protocol_id}")

                try:
                    result = await client.get_plenarprotokoll(protocol_id, include_full_text=True)
                    if result:
                        store.save_protocol(protocol_id, result)
                        store.mark_downloaded(state, protocol_id)
                    else:
                        store.mark_failed(state, protocol_id)
                except Exception as e:
                    console.print(f"\n[red]Failed {protocol_id}: {e}[/]")
                    store.mark_failed(state, protocol_id)

                progress.update(task, completed=i + 1)

    # Summary
    summary = store.get_progress_summary()
    console.print(f"\n[green]Download complete![/]")
    console.print(f"  Downloaded: {summary['downloaded']}")
    if summary["failed"]:
        console.print(f"  [yellow]Failed: {summary['failed']} (will retry on next run)[/]")


@main.command()
@click.argument("data_dir", type=click.Path(exists=True))
def parse(data_dir: str):
    """Parse downloaded protocols into speeches.json."""
    store = DataStore(data_dir)

    if not store.has_state():
        console.print("[red]No state.json found. Run 'download' first.[/]")
        raise SystemExit(1)

    state = store.load_state()
    downloaded = state.get("downloaded", [])

    if not downloaded:
        console.print("[yellow]No protocols downloaded yet.[/]")
        raise SystemExit(1)

    console.print(f"[bold]Parsing {len(downloaded)} protocols...[/]")

    speeches_by_party: dict[str, list[dict]] = {}

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TextColumn("{task.completed}/{task.total}"),
        console=console,
    ) as progress:
        task = progress.add_task("Parsing...", total=len(downloaded))

        for i, protocol_id in enumerate(downloaded):
            progress.update(task, description=f"Protocol {protocol_id}")

            protocol = store.load_protocol(protocol_id)
            if not protocol:
                continue

            full_text = protocol.get("fullText", "")
            if not full_text or not isinstance(full_text, str):
                continue

            speeches = parse_speeches_from_protocol(full_text)
            for speech in speeches:
                party = speech["party"]
                if party not in speeches_by_party:
                    speeches_by_party[party] = []
                speeches_by_party[party].append(speech)

            progress.update(task, completed=i + 1)

    # Save speeches
    store.save_speeches(speeches_by_party)

    # Update state
    state["parsed"] = True
    store.save_state(state)

    # Summary
    total_speeches = sum(len(s) for s in speeches_by_party.values())
    console.print(f"\n[green]Parsing complete![/]")
    console.print(f"  Total speeches: {total_speeches}")
    console.print(f"  Parties: {', '.join(speeches_by_party.keys())}")
    console.print(f"  Saved to: {store.speeches_file}")


@main.command()
@click.argument("data_dir", type=click.Path(exists=True))
def status(data_dir: str):
    """Show download/parse progress for a data directory."""
    store = DataStore(data_dir)
    summary = store.get_progress_summary()

    if summary["status"] == "not_started":
        console.print("[yellow]No download started in this directory.[/]")
        return

    table = Table(title=f"Status: {data_dir}")
    table.add_column("Property", style="cyan")
    table.add_column("Value", justify="right")

    table.add_row("Wahlperiode", str(summary["wahlperiode"]))
    table.add_row("Server", summary["server"])
    table.add_row("Total protocols", str(summary["total_protocols"]))
    table.add_row("Downloaded", f"[green]{summary['downloaded']}[/]")
    table.add_row("Pending", str(summary["pending"]))
    if summary["failed"]:
        table.add_row("Failed", f"[red]{summary['failed']}[/]")
    table.add_row("Parsed", "[green]Yes[/]" if summary["parsed"] else "[yellow]No[/]")
    table.add_row("Last updated", summary["last_updated"] or "-")

    console.print(table)


@main.command()
@click.argument("data_dir", type=click.Path(exists=True), required=False, default="./data_wp21")
@click.option("--results-dir", "-r", type=click.Path(exists=True), default="./results_wp21", help="Results directory")
@click.option("--party", "-p", multiple=True, help="Filter to specific parties")
@click.option("--section", "-s", type=click.Choice(["party", "speaker", "drama", "topic", "all"]), default="all", help="Section to display")
@click.option("--no-emoji", is_flag=True, help="Disable emoji output")
def wrapped(data_dir: str, results_dir: str, party: tuple, section: str, no_emoji: bool):
    """Generate Bundestag Wrapped 2025 - Your Year in Parliament."""
    from pathlib import Path
    from .wrapped import WrappedData, WrappedRenderer

    console.print()

    try:
        data = WrappedData.load(Path(results_dir), Path(data_dir))
    except FileNotFoundError as e:
        console.print(f"[red]Error: Could not load data - {e}[/]")
        console.print("[dim]Make sure to run 'analyze' first to generate results.[/]")
        raise SystemExit(1)

    renderer = WrappedRenderer(console, use_emoji=not no_emoji)
    parties = list(party) if party else None

    if section == "all":
        renderer.render_all(data, parties)
    elif section == "party":
        renderer.render_header(data)
        for p in (parties or data.metadata["parties"]):
            renderer.render_party_section(data, p)
    elif section == "speaker":
        renderer.render_header(data)
        renderer.render_speaker_section(data)
    elif section == "drama":
        renderer.render_header(data)
        renderer.render_drama_section(data)
    elif section == "topic":
        renderer.render_header(data)
        renderer.render_topic_section(data)


@main.command("export-web")
@click.argument("data_dir", type=click.Path(exists=True), required=False, default="./data_wp21")
@click.option("--results-dir", "-r", type=click.Path(exists=True), default="./results_wp21", help="Results directory")
@click.option("--output", "-o", type=click.Path(), default="./web/public/wrapped.json", help="Output JSON file")
def export_web(data_dir: str, results_dir: str, output: str):
    """Export wrapped data as JSON for the web app."""
    from pathlib import Path
    from .wrapped import WrappedData

    console.print(f"[bold]Exporting wrapped data for web app...[/]")
    console.print(f"  Data dir: {data_dir}")
    console.print(f"  Results dir: {results_dir}")

    try:
        data = WrappedData.load(Path(results_dir), Path(data_dir))
    except FileNotFoundError as e:
        console.print(f"[red]Error: Could not load data - {e}[/]")
        console.print("[dim]Make sure to run 'analyze' first to generate results.[/]")
        raise SystemExit(1)

    # Export to JSON
    web_data = data.to_web_json()
    output_path = Path(output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(web_data, ensure_ascii=False, indent=2))

    console.print(f"\n[green]Exported to {output}[/]")
    console.print(f"  Parties: {len(web_data['parties'])}")
    console.print(f"  Quiz questions: {len(web_data['quizQuestions'])}")
    console.print(f"  Top speakers: {len(web_data['topSpeakers'])}")


if __name__ == "__main__":
    main()
