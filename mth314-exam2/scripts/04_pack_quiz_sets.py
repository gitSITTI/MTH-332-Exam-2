import argparse
import json
from pathlib import Path
from typing import Iterable


def read_jsonl(path: Path) -> Iterable[dict]:
    with path.open(encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                yield json.loads(line)
            except Exception:
                continue


def main() -> None:
    ap = argparse.ArgumentParser(description="Pack final qbank into practice/memorize sets per module")
    ap.add_argument("--final", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--module", type=int, default=None)
    args = ap.parse_args()

    args.out.mkdir(parents=True, exist_ok=True)
    items = list(read_jsonl(args.final))
    if args.module is not None:
        items = [x for x in items if int(x.get("module") or 0) == args.module]

    # group by module
    by_mod: dict[int, list[dict]] = {}
    for it in items:
        m = int(it.get("module") or 0)
        by_mod.setdefault(m, []).append(it)

    for m, arr in by_mod.items():
        # practice is the array as-is
        practice_path = args.out / f"practice_m{m}.jsonl"
        with practice_path.open("w", encoding="utf-8") as f:
            for it in arr:
                f.write(json.dumps(it, ensure_ascii=False) + "\n")

        # memorize mirrors practice; consumers can choose answer-first display
        memorize_path = args.out / f"memorize_m{m}.jsonl"
        with memorize_path.open("w", encoding="utf-8") as f:
            for it in arr:
                f.write(json.dumps(it, ensure_ascii=False) + "\n")
        print("Packed module", m, "→", practice_path.name, ",", memorize_path.name)


if __name__ == "__main__":
    main()


