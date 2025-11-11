import argparse
import json
import random
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


def pick_set(qbank_dir: Path, module: int, mode: str) -> Path:
    name = f"{mode}_m{module}.jsonl"
    path = qbank_dir / name
    if not path.exists():
        raise SystemExit(f"Set not found: {path}")
    return path


def main() -> None:
    ap = argparse.ArgumentParser(description="MTH 314 Exam 2 Quiz CLI")
    ap.add_argument("--module", type=int, required=True, help="Module number (6–10)")
    ap.add_argument("--mode", choices=["practice", "memorize"], default="practice")
    ap.add_argument("--n", type=int, default=10, help="Number of questions")
    ap.add_argument("--qbank", type=Path, default=Path("data/qbank"))
    args = ap.parse_args()

    set_path = pick_set(args.qbank, args.module, args.mode)
    items = list(read_jsonl(set_path))
    if not items:
        raise SystemExit("No items in set")
    random.shuffle(items)
    items = items[: args.n]

    score = 0
    for i, it in enumerate(items, start=1):
        print()
        print(f"[{i}/{len(items)}] Module {it.get('module')} • {it.get('type').upper()}")
        print(it.get("question"))
        choices = it.get("choices") or []
        if args.mode == "memorize":
            input("Press Enter to reveal answer...")
            ans_idx = int(it.get("answer_index") or 0)
            print("Answer:", (choices[ans_idx] if 0 <= ans_idx < len(choices) else ans_idx))
            print("Why:", it.get("explanation") or "")
            continue

        if choices:
            letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            for idx, ch in enumerate(choices):
                print(f"  {letters[idx]}. {ch}")
            raw = input("Your answer: ").strip().upper()[:1]
            try:
                pick = letters.index(raw)
            except ValueError:
                pick = -1
            ans_idx = int(it.get("answer_index") or 0)
            correct = pick == ans_idx
        else:
            raw = input("True or False? ").strip().lower()
            ans_idx = int(it.get("answer_index") or 0)
            correct = (raw in ["t", "true"] and ans_idx == 0) or (raw in ["f", "false"] and ans_idx == 1)

        if correct:
            print("✅ Correct")
            score += 1
        else:
            print("❌ Incorrect")
        print("Why:", it.get("explanation") or "")

    print()
    print(f"Score: {score}/{len(items)}")


if __name__ == "__main__":
    main()


