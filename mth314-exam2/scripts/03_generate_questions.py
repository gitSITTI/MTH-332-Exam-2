import argparse
import json
import re
from pathlib import Path
from typing import Iterable


def read_segments(seg_dir: Path) -> Iterable[dict]:
    for jf in sorted(seg_dir.glob("*.jsonl")):
        with jf.open(encoding="utf-8") as f:
            for line in f:
                if not line.strip():
                    continue
                try:
                    yield json.loads(line)
                except Exception:
                    continue


def has_any(text: str, keywords: list[str]) -> bool:
    t = text.lower()
    return any(k in t for k in keywords)


def gen_for_segment(seg: dict) -> list[dict]:
    m = int(seg.get("module") or 0)
    text = str(seg.get("text") or "")
    items: list[dict] = []

    if m == 6 and has_any(text, ["induction", "base case", "inductive step", "assume"]):
        items.append({
            "id": "M6-IND-BC-" + str(abs(hash(text)) % 10_000),
            "module": 6,
            "type": "tf",
            "question": "In mathematical induction, the base case verifies the statement for the first value in the domain.",
            "answer_index": 0,
            "choices": ["True", "False"],
            "explanation": "Base case anchors the proof at the initial value.",
            "tags": ["induction", "base-case"],
            "assets": {"diagram": None},
        })

    if m == 7 and has_any(text, ["product rule", "sum rule", "permutation", "combination", "counting"]):
        items.append({
            "id": "M7-CNT-PR-" + str(abs(hash(text)) % 10_000),
            "module": 7,
            "type": "mcq",
            "question": "Which rule applies when counting outcomes from independent sequential choices?",
            "choices": ["Product rule", "Sum rule", "Inclusion–exclusion", "Pigeonhole principle"],
            "answer_index": 0,
            "explanation": "Independent stages multiply the counts → product rule.",
            "tags": ["counting", "product-rule"],
            "assets": {"diagram": None},
        })

    if m == 8 and has_any(text, ["conditional", "independent", "bayes", "probability"]):
        items.append({
            "id": "M8-PROB-IND-" + str(abs(hash(text)) % 10_000),
            "module": 8,
            "type": "mcq",
            "question": "Events A and B are independent iff:",
            "choices": ["P(A∩B) = P(A)P(B)", "P(A|B) = P(B)", "P(A∪B) = P(A)+P(B)", "P(A|B) = 1"],
            "answer_index": 0,
            "explanation": "Independence is defined by P(A∩B) = P(A)P(B).",
            "tags": ["probability", "independence"],
            "assets": {"diagram": None},
        })

    if m == 9 and has_any(text, ["reflexive", "symmetric", "transitive", "relation"]):
        items.append({
            "id": "M9-REL-TF-" + str(abs(hash(text)) % 10_000),
            "module": 9,
            "type": "tf",
            "question": "A relation R on a set S is reflexive if ∀x∈S, (x,x)∈R.",
            "answer_index": 0,
            "choices": ["True", "False"],
            "explanation": "Reflexivity requires every element to relate to itself.",
            "tags": ["relations", "reflexive"],
            "assets": {"diagram": None},
        })

    if m == 10 and has_any(text, ["graph", "euler", "hamilton", "tree", "degree"]):
        items.append({
            "id": "M10-GRAPH-TREE-" + str(abs(hash(text)) % 10_000),
            "module": 10,
            "type": "mcq",
            "question": "In any tree with V vertices, the number of edges E equals:",
            "choices": ["V−1", "V", "V+1", "2V−1"],
            "answer_index": 0,
            "explanation": "Trees are connected and acyclic ⇒ E = V − 1.",
            "tags": ["graphs", "trees"],
            "assets": {"diagram": None},
        })

    return items


def main() -> None:
    ap = argparse.ArgumentParser(description="Generate draft MCQ/TF questions from segments")
    ap.add_argument("--segments", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    args = ap.parse_args()

    args.out.parent.mkdir(parents=True, exist_ok=True)
    total = 0
    with args.out.open("w", encoding="utf-8") as f:
        for seg in read_segments(args.segments):
            items = gen_for_segment(seg)
            for it in items:
                f.write(json.dumps(it, ensure_ascii=False) + "\n")
                total += 1
    print("Draft items:", total, "→", args.out)


if __name__ == "__main__":
    main()


