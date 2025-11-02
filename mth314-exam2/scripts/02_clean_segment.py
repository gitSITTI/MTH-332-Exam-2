import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterator


HEADER_RE = re.compile(r"^---\s*$")


def parse_header(text: str) -> tuple[dict, str]:
    lines = text.splitlines()
    if not lines or not HEADER_RE.match(lines[0]):
        return {}, text
    try:
        idx = next(i for i, ln in enumerate(lines[1:], start=1) if HEADER_RE.match(ln))
    except StopIteration:
        return {}, text
    header_raw = "\n".join(lines[1:idx])
    try:
        meta = json.loads(header_raw)
    except Exception:
        meta = {}
    body = "\n".join(lines[idx + 1 :])
    return meta, body


def parse_ts_to_seconds(s: str) -> int | None:
    # supports mm:ss or hh:mm:ss
    m = re.search(r"(?:(\d{1,2}):)?(\d{1,2}):(\d{2})", s)
    if not m:
        return None
    h = int(m.group(1) or 0)
    m_ = int(m.group(2))
    sec = int(m.group(3))
    return h * 3600 + m_ * 60 + sec


def iter_segments_from_text(text: str) -> Iterator[tuple[int | None, int | None, str]]:
    # naive approach: if timestamp lines exist, use them as boundaries; otherwise chunk by length
    lines = text.splitlines()
    chunks: list[tuple[int | None, str]] = []
    for ln in lines:
        ts = parse_ts_to_seconds(ln)
        if ts is not None:
            chunks.append((ts, ""))
        else:
            if chunks:
                ts_last, acc = chunks[-1]
                chunks[-1] = (ts_last, (acc + ("\n" if acc else "") + ln).strip())
            else:
                chunks.append((None, ln))

    # emit segments with start/end seconds when available
    for i, (start_s, txt) in enumerate(chunks):
        end_s = chunks[i + 1][0] if i + 1 < len(chunks) else None
        txt = txt.strip()
        if not txt:
            continue
        yield start_s, end_s, txt


def chunk_by_chars(text: str, min_len: int = 600, max_len: int = 900) -> Iterator[str]:
    buf: list[str] = []
    cur = 0
    while cur < len(text):
        end = min(len(text), cur + max_len)
        # try to break on newline near target window
        win = text[cur:end]
        br = win.rfind("\n")
        if br >= min_len // 2:
            end = cur + br
        yield text[cur:end].strip()
        cur = end


def main() -> None:
    ap = argparse.ArgumentParser(description="Segment Markdown transcripts into JSONL segments")
    ap.add_argument("--transcripts", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    args = ap.parse_args()

    args.out.mkdir(parents=True, exist_ok=True)

    for md in sorted(args.transcripts.glob("*.md")):
        meta, body = parse_header(md.read_text(encoding="utf-8"))
        video_id = meta.get("video_id") or md.stem
        module = meta.get("module") or 0

        # If no timestamps present at all, chunk by characters
        has_ts = bool(re.search(r"\b\d{1,2}:\d{2}(?::\d{2})?\b", body))
        out_path = args.out / f"{video_id}.jsonl"
        with out_path.open("w", encoding="utf-8") as f:
            if has_ts:
                for start_s, end_s, txt in iter_segments_from_text(body):
                    obj = {
                        "video_id": video_id,
                        "module": module,
                        "start": start_s,
                        "end": end_s,
                        "text": txt,
                    }
                    f.write(json.dumps(obj, ensure_ascii=False) + "\n")
            else:
                for chunk in chunk_by_chars(body):
                    obj = {
                        "video_id": video_id,
                        "module": module,
                        "start": None,
                        "end": None,
                        "text": chunk,
                    }
                    f.write(json.dumps(obj, ensure_ascii=False) + "\n")
        print("Wrote", out_path)


if __name__ == "__main__":
    main()


