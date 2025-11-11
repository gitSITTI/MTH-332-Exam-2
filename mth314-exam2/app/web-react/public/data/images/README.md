# Lecture Images

This directory stores organized lecture screenshots and diagrams.

## Structure

```
data/images/
  module_3/          # Module 3 images (Asymptotics, Number Theory)
  module_6/          # Module 6 images (Induction)
  module_7/          # Module 7 images (Counting)
  module_8/          # Module 8 images (Probability)
  module_9/          # Module 9 images (Relations)
  module_10/         # Module 10 images (Graphs & Trees)
  metadata.json      # Image metadata (auto-generated)
```

## Usage

### Save an image:
```bash
python scripts/05_organize_images.py \
  --image screenshot.png \
  --module 3 \
  --topic "Big O" \
  --description "Proving 3x²+x = O(x³)" \
  --video_id 3_Math_314_-_Asymptotics_and_Number_Theory_(Senger)
```

### List all images:
```bash
python scripts/05_organize_images.py --list
```

### Reference in questions:
After saving an image, update question items in `data/qbank/drafts.jsonl` or `final.jsonl`:
```json
{
  "assets": {
    "diagram": "module_3/m3_big_o_01.png"
  }
}
```

### Bulk import

Put images in a folder (e.g., `inbox_images`) then:

```bash
# All images share the same module/topic (and optional video_id)
python scripts/05_bulk_organize_images.py \
  --dir inbox_images \
  --module 3 \
  --topic "Big O" \
  --video_id 3_Math_314_-_Asymptotics_and_Number_Theory_(Senger)

# Or provide a CSV mapping per file
python scripts/05_bulk_organize_images.py --dir inbox_images --map images_map.csv

# images_map.csv columns: file,module,topic,description,video_id
# example row: slide1.png,3,"Divisibility","Theorem 4.1.1 part 1",3_Math_314_-_Number_Theory_Continued_(Senger)
```

