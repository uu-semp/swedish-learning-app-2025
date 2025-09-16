import csv
import json
import sys
import os

# FIXME: xFrednet: Indent of 2 is easier to read but should later be changed to None
# to make the files smaller
indent = 2
input_file = "./words.csv"
vocab_output_file = "./assets/vocabulary.json"
categories_output_file = "./assets/categories.json"
team_coloumn_name="Team{num}"
team_file_name="./assets/team{num}/vocab_data.json"

teams_ids = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "13", "14", "15", "16"]

id_to_meta = {}
cat_to_ids = {}
team_data = {}

for team in teams_ids:
    team_data[team] = {}

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

        for team in teams_ids:
            row_team_data = row.get(team_coloumn_name.format(num=team))
            if row_team_data:
                team_data[team][id_] = row_team_data

def safe_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=indent)

safe_json(vocab_output_file, id_to_meta)
safe_json(categories_output_file, cat_to_ids)

for team in teams_ids:
    data = team_data[team]
    
    # Only write team data, if it actually has some additional data
    if len(data) == 0:
        continue

    file = team_file_name.format(num=team)
    safe_json(file, data)
