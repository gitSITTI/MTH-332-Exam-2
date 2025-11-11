# Sync questions data to public directory
$source = "../../data/qbank/drafts.jsonl"
$dest = "public/qbank/drafts.jsonl"

if (Test-Path $source) {
    New-Item -ItemType Directory -Force -Path "public/qbank" | Out-Null
    Copy-Item $source -Destination $dest -Force
    Write-Host "Synced questions data to public directory"
} else {
    Write-Host "Source file not found: $source"
}

# Also sync video index and images
Write-Host "Running prepare_web_data script..."
python ../../scripts/06_prepare_web_data.py --csv ../../exam2_resources/Exam2_Video_Index.csv --images ../../data/images --out-json public/data/video-index.json --out-images public/data/images --out-metadata public/data/images/metadata.json

# Build consolidated lecture resources map (transcripts + images)
python ../../scripts/08_build_lecture_links.py --csv ../../exam2_resources/Exam2_Video_Index.csv --images ../../data/images --transcripts ../../data/transcripts --out ../../app/web-react/public/data/lecture-resources.json

