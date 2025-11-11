import argparse
import csv
import json
import re
from dataclasses import dataclass
from pathlib import Path


@dataclass
class IndexRow:
    module: int
    topic: str
    title: str
    url: str
    video_id: str


def slugify(value: str) -> str:
    value = re.sub(r"[^A-Za-z0-9]+", "_", value.strip()).strip("_").lower()
    return value


def read_index(index_csv: Path) -> dict[str, IndexRow]:
    rows: dict[str, IndexRow] = {}
    with index_csv.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            title = (r.get("title") or "").strip()
            module_raw = (r.get("module") or "").strip()
            url = (r.get("url") or "").strip()
            topic = (r.get("topic") or "").strip()
            video_id = (r.get("video_id") or slugify(title))
            try:
                module = int(module_raw)
            except ValueError:
                module = 0
            rows[video_id] = IndexRow(module=module, topic=topic, title=title, url=url, video_id=video_id)
    return rows


def normalize_text(text: str) -> str:
    # Normalize CRLF/CR to LF and trim trailing spaces
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    lines = [ln.rstrip() for ln in text.split("\n")]
    return "\n".join(lines).strip() + "\n"


def write_markdown(out_dir: Path, meta: IndexRow, body: str) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{meta.video_id}.md"
    header = {
        "title": meta.title,
        "module": meta.module,
        "url": meta.url,
        "video_id": meta.video_id,
    }
    content = "---\n" + json.dumps(header, ensure_ascii=False, indent=2) + "\n---\n\n" + body
    out_path.write_text(content, encoding="utf-8")
    return out_path


def main() -> None:
    ap = argparse.ArgumentParser(description="Ingest transcript placeholders into Markdown with YAML-like JSON header.")
    ap.add_argument("--index", required=True, type=Path)
    ap.add_argument("--placeholders", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    args = ap.parse_args()

    index_map = read_index(args.index)

    txt_files = sorted((args.placeholders).glob("*.txt"))
    if not txt_files:
        print("No .txt files found in", args.placeholders)
    for tf in txt_files:
        stem = tf.stem
        # Prefer explicit index mapping by exact video_id; otherwise fallback to slug of filename
        video_id = stem if stem in index_map else slugify(stem)
        meta = index_map.get(video_id)
        if meta is None:
            # Fallback meta with minimal fields
            meta = IndexRow(module=0, topic="", title=stem, url="", video_id=video_id)
        raw = tf.read_text(encoding="utf-8", errors="ignore")
        body = normalize_text(raw)
        out_file = write_markdown(args.out, meta, body)
        print("Wrote", out_file)


if __name__ == "__main__":
    main()


