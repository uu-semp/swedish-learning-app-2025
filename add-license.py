import os

# --- Configuration ---
directory = "./assets"   # change to your target directory
license_text = """\
This image has been taken from papunet.net and is licensed under: CC BY-NC-SA 3.0

See https://creativecommons.org/licenses/by-nc-sa/3.0/deed or https://creativecommons.org/licenses/by-nc-sa/3.0/deed.sv

Source: Papunets bildbank, papunet.net, Elina Vanninen, Sergio Palao / ARASAAC och Sclera.
"""  # change the license text
# ----------------------

for root, _, files in os.walk(directory):
    for file in files:
        if file.lower().endswith(".png"):
            base = os.path.splitext(file)[0]
            license_path = os.path.join(root, base + ".license")

            # Only create if it doesn't already exist
            if not os.path.exists(license_path):
                with open(license_path, "w", encoding="utf-8") as f:
                    f.write(license_text)
                print(f"Created {license_path}")
            else:
                print(f"Skipped (already exists): {license_path}")
