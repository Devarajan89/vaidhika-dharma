#!/usr/bin/env python3
"""Generate Rigveda samhita markdown docs from verse-index.json."""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Literal

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "src/data/rigveda"
OUTPUT_DIR = ROOT / "src/content/docs/samhita"
IAST_OUTPUT_DIR = ROOT / "src/content/docs/iast/samhita"
STDIN_WORKER = ROOT / "scripts/transliterate-samhita-stdin.mjs"
LINE_WORKER = ROOT / "scripts/.transliterate-line-worker.mjs"
LAST_UPDATED = date.today().isoformat()
SKIP_IAST = os.environ.get("SKIP_IAST") == "1"

Locale = Literal["root", "iast"]

VERSE_MARKER_RE = re.compile(r"॥([०-९0-9]+)(?:॥)?")
LEADING_SPACE_RE = re.compile(r"^[ \t]+", re.MULTILINE)
SVARA_RE = re.compile(r"[\u0900-\u0903\u0951-\u0954]")
DEVANAGARI_DIGIT_MAP = str.maketrans("०१२३४५६७८९", "0123456789")
MANDALA_COUNT = 10
MANDALA_IAST_LABELS = {
    1: "Prathama Maṇḍala",
    2: "Dvitīya Maṇḍala",
    3: "Tṛtīya Maṇḍala",
    4: "Caturtha Maṇḍala",
    5: "Pañcama Maṇḍala",
    6: "Ṣaṣṭha Maṇḍala",
    7: "Saptama Maṇḍala",
    8: "Aṣṭama Maṇḍala",
    9: "Navama Maṇḍala",
    10: "Daśama Maṇḍala",
}
MANDALA_ROOT_LABELS = {
    1: "प्रथम मण्डल",
    2: "द्वितीय मण्डल",
    3: "तृतीय मण्डल",
    4: "चतुर्थ मण्डल",
    5: "पञ्चम मण्डल",
    6: "षष्ठ मण्डल",
    7: "सप्तम मण्डल",
    8: "अष्टम मण्डल",
    9: "नवम मण्डल",
    10: "दशम मण्डल",
}


@dataclass(frozen=True)
class Verse:
    number: int
    text: str
    first_word: str


@dataclass(frozen=True)
class Sukta:
    mandala: int
    number: int
    header: str
    verses: list[Verse]


def parse_verse_number(value: str) -> int:
    return int(value.translate(DEVANAGARI_DIGIT_MAP))


def clean_verse_body(text: str) -> str:
    cleaned = LEADING_SPACE_RE.sub("", text)
    return "\n".join(line.rstrip() for line in cleaned.splitlines()).strip()


METADATA_RE = re.compile(
    r"[०-९0-9]+-[०-९0-9]+|गायत्री|अनुष्टुप|त्रिष्टुप|जगती|उष्णिक|बृहती|पङ्क्ति"
)


def is_mantra_line(line: str) -> bool:
    stripped = line.strip()
    if not stripped:
        return False
    if METADATA_RE.search(stripped) and not SVARA_RE.search(stripped):
        return False
    if SVARA_RE.search(stripped):
        return True
    return len(re.findall(r"[\u0900-\u097F]", stripped)) >= 12


def split_header_and_first_verse(header_and_first_verse: str) -> tuple[str, str]:
    boundary = header_and_first_verse.find("\n\n")
    if boundary != -1:
        header = header_and_first_verse[:boundary].strip()
        remainder = header_and_first_verse[boundary:].strip()
    else:
        parts = [part.strip() for part in re.split(r"[।.]", header_and_first_verse) if part.strip()]
        if len(parts) <= 3:
            return header_and_first_verse.strip(), ""
        header = "। ".join(parts[:3]) + "।"
        remainder = "। ".join(parts[3:])

    lines = [line.strip() for line in remainder.splitlines() if line.strip()]
    mantra_lines = [line for line in lines if is_mantra_line(line)]
    if mantra_lines:
        header_lines = [line for line in lines if line not in mantra_lines]
        if header_lines:
            header = f"{header}\n\n" + "\n".join(header_lines)
        return header.strip(), "\n".join(mantra_lines).strip()

    return header.strip(), remainder.strip()


def extract_words(verse_text: str, count: int = 1) -> str:
    candidate_lines = [line for line in verse_text.splitlines() if line.strip()]
    if not candidate_lines:
        return ""

    best_line = max(
        candidate_lines,
        key=lambda line: len(re.findall(r"[\u0900-\u097F]", line)),
    )
    stripped = SVARA_RE.sub("", best_line)
    words: list[str] = []
    for part in re.split(r"[।\s]+", stripped):
        word = re.sub(r"[^\u0900-\u097F]", "", part)
        if word:
            words.append(word)
            if len(words) >= count:
                break
    return " ".join(words)


def extract_first_word(verse_text: str) -> str:
    return extract_words(verse_text, 1)


def transliterate_line_worker(text: str) -> str:
    result = subprocess.run(
        ["node", str(LINE_WORKER), text],
        capture_output=True,
        text=True,
        check=True,
    )
    return result.stdout


def transliterate_map(strings_by_key: dict[str, str], batch_size: int = 75) -> dict[str, str]:
    if not strings_by_key:
        return {}

    translated: dict[str, str] = {}
    items = list(strings_by_key.items())
    for index in range(0, len(items), batch_size):
        chunk = dict(items[index : index + batch_size])
        translated.update(transliterate_map_once(chunk))
    return translated


def transliterate_map_once(strings_by_key: dict[str, str]) -> dict[str, str]:
    if not strings_by_key:
        return {}

    process = subprocess.Popen(
        ["node", str(STDIN_WORKER)],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1,
    )
    assert process.stdin is not None
    assert process.stdout is not None

    translated: dict[str, str] = {}
    pending = len(strings_by_key)

    for key, text in strings_by_key.items():
        process.stdin.write(
            json.dumps({"id": key, "text": text}, ensure_ascii=False) + "\n"
        )
    process.stdin.close()

    for line in process.stdout:
        payload = json.loads(line)
        if "error" in payload:
            translated[payload["id"]] = transliterate_line_worker(
                strings_by_key[payload["id"]]
            )
        else:
            translated[payload["id"]] = payload["result"]
        pending -= 1
        if pending == 0:
            break

    stderr = process.stderr.read() if process.stderr else ""
    return_code = process.wait()
    if return_code != 0:
        raise RuntimeError(stderr or "IAST transliteration failed")

    if len(translated) != len(strings_by_key):
        missing = set(strings_by_key) - set(translated)
        raise RuntimeError(f"IAST transliteration incomplete: missing {len(missing)} entries")

    return translated


def build_iast_translation_map(
    suktas: list[Sukta],
    toc_entries: list[tuple[int, int, int, str]],
) -> dict[str, str]:
    strings_by_key: dict[str, str] = {}

    for sukta in suktas:
        strings_by_key[f"sukta:{sukta.mandala}:{sukta.number}:header"] = sukta.header
        for verse in sukta.verses:
            strings_by_key[
                f"sukta:{sukta.mandala}:{sukta.number}:verse:{verse.number}"
            ] = verse.text
            strings_by_key[
                f"sukta:{sukta.mandala}:{sukta.number}:verse:{verse.number}:first-word"
            ] = verse.first_word

    for index, (_, _, _, opening_words) in enumerate(toc_entries):
        strings_by_key[f"toc:{index}"] = opening_words

    return transliterate_map(strings_by_key)


def get_iast_sukta(sukta: Sukta, translations: dict[str, str]) -> Sukta:
    prefix = f"sukta:{sukta.mandala}:{sukta.number}"
    return Sukta(
        mandala=sukta.mandala,
        number=sukta.number,
        header=translations[f"{prefix}:header"],
        verses=[
            Verse(
                number=verse.number,
                text=translations[f"{prefix}:verse:{verse.number}"],
                first_word=translations[
                    f"{prefix}:verse:{verse.number}:first-word"
                ],
            )
            for verse in sukta.verses
        ],
    )


def format_sukta_header(header: str) -> str:
    return " ".join(line.strip() for line in header.splitlines() if line.strip())


def parse_sukta_text(text: str) -> tuple[str, list[Verse]]:
    matches = list(VERSE_MARKER_RE.finditer(text))
    if not matches:
        return text.strip(), []

    preamble = text[: matches[0].start()].strip()
    header, first_verse_text = split_header_and_first_verse(preamble)

    verses: list[Verse] = []
    for index, match in enumerate(matches):
        start = matches[index - 1].end() if index else 0
        end = match.start()
        body = first_verse_text if index == 0 else text[start:end]
        cleaned = clean_verse_body(body)
        verses.append(
            Verse(
                number=parse_verse_number(match.group(1)),
                text=cleaned,
                first_word=extract_first_word(cleaned),
            )
        )

    return header, verses


def load_mandala(mandala_number: int) -> list[Sukta]:
    index_path = DATA_DIR / "verse-index.json"
    if not index_path.exists():
        raise FileNotFoundError(f"Missing verse index: {index_path}")

    index = json.loads(index_path.read_text(encoding="utf-8"))
    verses = index.get("verses", index)
    sukta_index = index.get("suktas", {})

    suktas: list[Sukta] = []
    for key, record in sorted(
        sukta_index.items(),
        key=lambda item: (item[1]["mandala"], item[1]["sukta"]),
    ):
        if record["mandala"] != mandala_number:
            continue

        parsed_verses: list[Verse] = []
        for verse_number in record["verses"]:
            verse_key = f"{record['mandala']}:{record['sukta']}:{verse_number}"
            verse_record = verses[verse_key]
            cleaned = clean_verse_body(verse_record["text"])
            parsed_verses.append(
                Verse(
                    number=verse_number,
                    text=cleaned,
                    first_word=extract_first_word(cleaned),
                )
            )

        suktas.append(
            Sukta(
                mandala=record["mandala"],
                number=record["sukta"],
                header=record["header"],
                verses=parsed_verses,
            )
        )

    return suktas


def mandala_dir_name(mandala: int) -> str:
    return f"Mandala_{mandala:02d}"


def sukta_file_name(sukta: int) -> str:
    return f"sukta_{sukta:03d}.mdx"


def yaml_quote(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def format_verse_count_label(count: int, locale: Locale) -> str:
    if locale == "iast":
        return "1 mantra" if count == 1 else f"{count} mantras"
    return "१ मन्त्रः" if count == 1 else f"{count} मन्त्राः"


def render_sukta_mdx(sukta: Sukta, locale: Locale) -> str:
    return "\n".join(
        [
            render_sukta_frontmatter(sukta, locale),
            "",
            "import RigvedaSukta from '/src/components/content/RigvedaSukta.astro';",
            "",
            f'<RigvedaSukta mandala={{{sukta.mandala}}} sukta={{{sukta.number}}} locale="{locale}" />',
            "",
        ]
    )


def render_mandala_index_mdx(mandala: int, locale: Locale, sukta_count: int) -> str:
    slug_prefix = "iast/rigveda-samhita" if locale == "iast" else "rigveda-samhita"
    label = MANDALA_IAST_LABELS[mandala] if locale == "iast" else MANDALA_ROOT_LABELS[mandala]

    if locale == "iast":
        title = label
        description = f"Ṛgveda Śākala Saṃhitā — {label} ({sukta_count} sūktas)."
    else:
        title = label
        description = f"ऋग्वेद शाकल संहिता — {label} ({sukta_count} सूक्तानि)."

    return "\n".join(
        [
            "---",
            f"title: {yaml_quote(title)}",
            f"slug: {slug_prefix}/mandala-{mandala}",
            "sidebar:",
            f"  label: {yaml_quote(label)}",
            f"  order: {mandala}",
            "tableOfContents: false",
            f"description: {yaml_quote(description)}",
            f"lastUpdated: {LAST_UPDATED}",
            "---",
            "",
            "import RigvedaMandala from '/src/components/content/RigvedaMandala.astro';",
            "",
            f'<RigvedaMandala mandala={{{mandala}}} locale="{locale}" />',
            "",
        ]
    )


def render_sukta_frontmatter(sukta: Sukta, locale: Locale) -> str:
    first_word = sukta.verses[0].first_word if sukta.verses else ""
    verse_label = format_verse_count_label(len(sukta.verses), locale)
    slug_prefix = "iast/rigveda-samhita" if locale == "iast" else "rigveda-samhita"
    sidebar_label = f"{sukta.number} {first_word}"

    if locale == "iast":
        title = f"Sūktam {sukta.number} — {first_word} ({verse_label})"
        description = (
            f"Ṛgveda Saṃhitā — {MANDALA_IAST_LABELS[sukta.mandala]}, Sūktam {sukta.number}"
        )
    else:
        title = f"सूक्तम् {sukta.number} — {first_word} ({verse_label})"
        description = f"ऋग्वेद संहिता — मण्डल {sukta.mandala}, सूक्तम् {sukta.number}"

    return "\n".join(
        [
            "---",
            f"title: {yaml_quote(title)}",
            f"slug: {slug_prefix}/mandala-{sukta.mandala}/sukta-{sukta.number}",
            "sidebar:",
            f"  label: {yaml_quote(sidebar_label)}",
            f"  order: {sukta.number}",
            "tableOfContents: false",
            f"description: {yaml_quote(description)}",
            f"lastUpdated: {LAST_UPDATED}",
            "---",
        ]
    )


def render_index_frontmatter(verse_count: int, locale: Locale) -> str:
    slug = "iast/rigveda-samhita" if locale == "iast" else "rigveda-samhita"
    if locale == "iast":
        title = "Śākala Saṃhitā (Ṛgveda) — Index"
        sidebar_label = "Śākala Saṃhitā"
        description = f"Complete index of all {verse_count:,} Rigveda mantras across 10 Maṇḍalas."
    else:
        title = "शाकल संहिता (ऋग्वेद) — सूची"
        sidebar_label = "शाकल संहिता"
        description = f"Complete index of all {verse_count:,} Rigveda mantras across 10 Mandalas."

    return "\n".join(
        [
            "---",
            f"title: {yaml_quote(title)}",
            f"slug: {slug}",
            "sidebar:",
            f"  label: {yaml_quote(sidebar_label)}",
            "  order: 1",
            "tableOfContents:",
            "  minHeadingLevel: 2",
            "  maxHeadingLevel: 2",
            f"description: {yaml_quote(description)}",
            f"lastUpdated: {LAST_UPDATED}",
            "---",
        ]
    )


def transliterate_opening_words(
    toc_entries: list[tuple[int, int, int, str]],
    translations: dict[str, str],
) -> list[str]:
    return [translations[f"toc:{index}"] for index in range(len(toc_entries))]


def render_sukta_markdown(sukta: Sukta, locale: Locale) -> str:
    return render_sukta_mdx(sukta, locale)


def get_mandala_sukta_counts(suktas: list[Sukta]) -> dict[int, int]:
    counts: dict[int, int] = {}
    for sukta in suktas:
        counts[sukta.mandala] = counts.get(sukta.mandala, 0) + 1
    return counts


def render_mandala_navigation(mandala_counts: dict[int, int], locale: Locale) -> list[str]:
    if locale == "iast":
        lines = [
            "## Śākala Saṃhitā — Maṇḍalas",
            "",
            "| Maṇḍala | Sūktas |",
            "|---------|-------:|",
        ]
        labels = MANDALA_IAST_LABELS
    else:
        lines = [
            "## शाकल संहिता — मण्डलाः",
            "",
            "| मण्डल | सूक्तानि |",
            "|-------|--------:|",
        ]
        labels = MANDALA_ROOT_LABELS

    for mandala_number in range(1, MANDALA_COUNT + 1):
        label = labels[mandala_number]
        count = mandala_counts.get(mandala_number, 0)
        lines.append(f"| [{label}](#mandala-{mandala_number}) | {count} |")

    lines.append("")
    return lines


def render_table_of_contents(
    toc_entries: list[tuple[int, int, int, str]],
    locale: Locale,
    mandala_counts: dict[int, int],
    opening_words_display: list[str] | None = None,
) -> str:
    lines = [
        render_index_frontmatter(len(toc_entries), locale),
        "",
        "# Śākala Saṃhitā — Table of Contents"
        if locale == "iast"
        else "# शाकल संहिता — सूची",
        "",
        f"Complete index of all {len(toc_entries):,} mantras across 10 "
        f"{'Maṇḍalas' if locale == 'iast' else 'Mandalas'}.",
        "",
        *render_mandala_navigation(mandala_counts, locale),
    ]

    current_mandala = None
    for index, (mandala, sukta, verse, opening_words) in enumerate(toc_entries):
        display_words = (
            opening_words_display[index] if opening_words_display is not None else opening_words
        )
        if mandala != current_mandala:
            if current_mandala is not None:
                lines.append("")
            current_mandala = mandala
            mandala_heading = (
                f"## Maṇḍala {mandala}" if locale == "iast" else f"## Mandala {mandala}"
            )
            lines.extend(
                [
                    mandala_heading,
                    "",
                    "| Mandala | Sukta | Verse | First Words |",
                    "|--------:|------:|------:|-------------|",
                ]
            )

        link = f"[{display_words}](mandala-{mandala}/#sukta-{sukta})"
        lines.append(f"| {mandala} | {sukta} | {verse} | {link} |")

    return "\n".join(lines).rstrip() + "\n"


def refresh_iast_index_intro(suktas: list[Sukta], toc_entries: list[tuple[int, int, int, str]]) -> None:
    iast_index = IAST_OUTPUT_DIR / "index.md"
    if not iast_index.is_file():
        return

    content = iast_index.read_text(encoding="utf-8")
    marker = "\n## Maṇḍala 1"
    marker_index = content.find(marker)
    if marker_index == -1:
        return

    intro_lines = [
        render_index_frontmatter(len(toc_entries), "iast"),
        "",
        "# Śākala Saṃhitā — Table of Contents",
        "",
        f"Complete index of all {len(toc_entries):,} mantras across 10 Maṇḍalas.",
        "",
        *render_mandala_navigation(get_mandala_sukta_counts(suktas), "iast"),
    ]
    iast_index.write_text("\n".join(intro_lines) + content[marker_index:], encoding="utf-8")


def write_locale_outputs(
    suktas: list[Sukta],
    toc_entries: list[tuple[int, int, int, str]],
    output_dir: Path,
    locale: Locale,
    translations: dict[str, str] | None = None,
) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    opening_words_display = (
        transliterate_opening_words(toc_entries, translations) if translations else None
    )

    for sukta in suktas:
        localized_sukta = (
            get_iast_sukta(sukta, translations) if translations is not None else sukta
        )
        mandala_path = output_dir / mandala_dir_name(localized_sukta.mandala)
        mandala_path.mkdir(parents=True, exist_ok=True)
        output_file = mandala_path / sukta_file_name(localized_sukta.number)
        output_file.write_text(
            render_sukta_mdx(localized_sukta, locale),
            encoding="utf-8",
        )

        mandala_index = mandala_path / "index.mdx"
        mandala_index.write_text(
            render_mandala_index_mdx(
                localized_sukta.mandala,
                locale,
                sum(1 for item in suktas if item.mandala == localized_sukta.mandala),
            ),
            encoding="utf-8",
        )
        legacy_index = mandala_path / "index.md"
        if legacy_index.is_file():
            legacy_index.unlink()

    (output_dir / "index.md").write_text(
        render_table_of_contents(
            toc_entries,
            locale,
            get_mandala_sukta_counts(suktas),
            opening_words_display,
        ),
        encoding="utf-8",
    )


def generate() -> dict[str, int]:
    if not DATA_DIR.exists():
        raise FileNotFoundError(f"Rigveda data directory not found: {DATA_DIR}")

    toc_entries: list[tuple[int, int, int, str]] = []
    stats = {
        "mandalas": 0,
        "suktas": 0,
        "verses": 0,
    }
    all_suktas: list[Sukta] = []

    for mandala_number in range(1, MANDALA_COUNT + 1):
        suktas = load_mandala(mandala_number)
        all_suktas.extend(suktas)
        stats["mandalas"] += 1

        for sukta in suktas:
            stats["suktas"] += 1
            for verse in sukta.verses:
                toc_entries.append(
                    (sukta.mandala, sukta.number, verse.number, extract_words(verse.text, 2))
                )
                stats["verses"] += 1

    write_locale_outputs(all_suktas, toc_entries, OUTPUT_DIR, "root")
    if not SKIP_IAST:
        print("Transliterating all mantras to IAST (this may take several minutes)...")
        translations = build_iast_translation_map(all_suktas, toc_entries)
        print(f"  Transliterated {len(translations):,} strings")
        write_locale_outputs(
            all_suktas,
            toc_entries,
            IAST_OUTPUT_DIR,
            "iast",
            translations,
        )
    else:
        refresh_iast_index_intro(all_suktas, toc_entries)

    return stats


def verify() -> None:
    for output_dir in [OUTPUT_DIR, *([] if SKIP_IAST else [IAST_OUTPUT_DIR])]:
        missing_mandalas = []
        for mandala_number in range(1, MANDALA_COUNT + 1):
            mandala_path = output_dir / mandala_dir_name(mandala_number)
            if not mandala_path.is_dir():
                missing_mandalas.append(mandala_number)
                continue

            sukta_files = sorted(mandala_path.glob("sukta_*.md"))
            if not sukta_files:
                missing_mandalas.append(mandala_number)

        if missing_mandalas:
            label = "IAST " if output_dir == IAST_OUTPUT_DIR else ""
            raise RuntimeError(
                f"Verification failed: missing {label}mandala output for {missing_mandalas}"
            )

        if not (output_dir / "index.md").is_file():
            label = "IAST " if output_dir == IAST_OUTPUT_DIR else ""
            raise RuntimeError(f"Verification failed: missing {label}table of contents")


def main() -> int:
    print(f"Reading mandala JSON from: {DATA_DIR}")
    print(f"Writing Devanagari docs to: {OUTPUT_DIR}")
    if SKIP_IAST:
        print("Skipping IAST output (SKIP_IAST=1)")
    else:
        print(f"Writing IAST docs to: {IAST_OUTPUT_DIR}")

    stats = generate()
    verify()

    print("\nGeneration complete:")
    print(f"  Mandalas: {stats['mandalas']}/{MANDALA_COUNT}")
    print(f"  Suktas:   {stats['suktas']:,}")
    print(f"  Verses:   {stats['verses']:,}")
    print(f"  TOC:      {OUTPUT_DIR / 'index.md'}")
    if not SKIP_IAST:
        print(f"  IAST TOC: {IAST_OUTPUT_DIR / 'index.md'}")

    for mandala_number in range(1, MANDALA_COUNT + 1):
        mandala_path = OUTPUT_DIR / mandala_dir_name(mandala_number)
        sukta_count = len(list(mandala_path.glob("sukta_*.md")))
        print(f"  {mandala_dir_name(mandala_number)}: {sukta_count} sukta files")

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"Error: {error}", file=sys.stderr)
        raise SystemExit(1)
