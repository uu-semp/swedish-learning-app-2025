import csv
import json
import sys

# FIXME: xFrednet: Indent of 2 is easier to read but should later be changed to None
# to make the files smaller
indent = 2
input_file = "./words.csv"
vocab_output_file = "./assets/vocabulary.json"
categories_output_file = "./assets/categories.json"

id_to_meta = {}
cat_to_ids = {}

with open(input_file, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        id_ = row["ID"]

        if id_ in id_to_meta:
            sys.exit(f"Error: Duplicate ID found -> {id_}")

        meta = {
            "en": row["English"],
            "sv": row["Swedish"],
        }

        # Optional fields
        if row.get("Article"):
            meta["article"] = row["Article"]
        if row.get("Literal"):
            meta["literal"] = row["Literal"]
        if row.get("Image-path"):
            meta["img"] = row["Image-path"]
        if row.get("Audio-path"):
            meta["audio"] = row["Audio-path"]

        id_to_meta[id_] = meta

        if row.get("Category"):
            cat_to_ids.setdefault(row["Category"], []).append(id_)

with open(vocab_output_file, "w", encoding="utf-8") as f:
    json.dump(id_to_meta, f, ensure_ascii=False, indent=indent)

with open(categories_output_file, "w", encoding="utf-8") as f:
    json.dump(cat_to_ids, f, ensure_ascii=False, indent=indent)

