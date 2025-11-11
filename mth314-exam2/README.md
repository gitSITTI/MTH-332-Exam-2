# MTH 314 – Exam 2 Study Builder

A lightweight pipeline to turn curated Exam 2 resources (Modules 6–10) into:
- cleaned transcripts per video
- normalized question bank (MCQ/TF, with optional diagrams)
- a practice/memorize quiz tool (CLI first, simple web later)

## Requirements
- Python 3.11+
- pip

Optional for nicer CLI:
- Windows Terminal or any modern terminal

## Setup
```bash
python -m venv .venv
# Windows PowerShell
. .venv/Scripts/Activate.ps1
# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt
```

## Project
```
mth314-exam2/
  exam2_resources/            # CSV index + raw transcript placeholders
  scripts/                    # pipeline steps 01–04
  data/                       # cleaned transcripts, segments, qbank, images
  app/                        # CLI quiz and minimal web shell
  docs/                       # roadmap, style, acceptance criteria
```

## Workflows
1) Ingest transcripts → Markdown
```bash
python scripts/01_ingest_transcripts.py \
  --index exam2_resources/Exam2_Video_Index.csv \
  --placeholders exam2_resources/transcripts_placeholders \
  --out data/transcripts
```

2) Segment transcripts → JSONL segments
```bash
python scripts/02_clean_segment.py \
  --transcripts data/transcripts \
  --out data/segments
```

3) Generate draft questions → JSONL
```bash
python scripts/03_generate_questions.py \
  --segments data/segments \
  --out data/qbank/drafts.jsonl
```

4) Human review drafts → save to `data/qbank/final.jsonl`

5) Pack quiz sets
```bash
python scripts/04_pack_quiz_sets.py \
  --final data/qbank/final.jsonl \
  --out data/qbank
```

6) Run CLI quiz
```bash
python app/cli/quiz_cli.py --module 7 --mode practice --n 10
```

## Notes
- No auto-scraping: paste transcripts into `exam2_resources/transcripts_placeholders/*.txt`.
- Scope: Modules 6–10 only.
- JSONL is one JSON object per line.
