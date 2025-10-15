# Development Workflow

All changes to the source code must have a ticket created in Jira. For example:

> **User Story:**  
> As a developer, 
> I want to have documentation about the development practices we are going to follow as a team, 
> so that we can contribute effectively with fewer conflicts and a consistent quality baseline.
>
> **Acceptance Criteria:**
> - A file called README.md should be created in the team10 folder
> - The file should contain the Git workflow the team will follow

## Git Workflow

1. **Clone the repository:**
   
   ```bash
   git clone git@github.com:uu-semp/swedish-learning-app-2025.git
   ```
   This command clones the repository to your machine.

2. **Get the latest changes:**

   ```bash
   git pull
   ```
   Make sure you have the latest version of the code locally.

3. **Create a feature branch:**

 ![Jira Git Integration](dev-tools/readme/Jira-git.png)


   To get the branch name:
   - Go to Jira and open the ticket you are going to work on.
   - Click **Details** > **Development** > **Create branch**.
   - Jira will suggest a name based on the ticket title.
   - You can modify it, but add `team10/` at the beginning.
   - *Note: I will check with Allison to modify the prefix so that `team10` is added automatically instead of `SCRUM-`.*

   ```bash
   git checkout -b team10/SCRUM-43-add-readme-md-file
   ```
  
4. **Commit your changes:**

   ```bash
   # Add the file(s) you want to commit.
   git add file_name.js
   ```

   ```bash
   git commit -m "Add README.md with development workflow"
   ```

5. **Push to GitHub:**

   ```bash
   git push
   ```

6. **Create a Pull Request** on GitHub.

7. **Approval required:** Follow the current Git rule. At least one approval from any team member is required before merging changes to the main branch.


# Dev Tools

The aim of this folder is to provide practical tools and information to speed up the development process.

## GenAI

This project uses the following AI generative tools:

* GitHub Copilot


## Update Word List

TL;DR: The procedure was deleted on:

```bash
git log --diff-filter=D -- assets/gen-vocab.py
commit 26774254a7ace94d34306daf68a8c2cde0ba830d
Author: Fridtjof Stoldt <xFrednet@gmail.com>
Date:   Fri Oct 10 16:21:17 2025 +0200

    Data: Update docs for async access

$ git log --stat 26774254a7ace94d34306daf68a8c2cde0ba830d
commit 26774254a7ace94d34306daf68a8c2cde0ba830d
Author: Fridtjof Stoldt <xFrednet@gmail.com>
Date:   Fri Oct 10 16:21:17 2025 +0200

    Data: Update docs for async access

 .github/workflows/check-generated-files.yml | 27 ------------------------
 assets/README.md                            | 62 ++++++++++++++++++++++++++++++++----------------------
 assets/gen-vocab.py                         | 77 -------------------------------------------------------------------
 3 files changed, 37 insertions(+), 129 deletions(-)

commit d2613f69fba6b1a02764d1d7737cec0f26259c38
Author: Fridtjof Stoldt <xFrednet@gmail.com>
Date:   Fri Oct 10 15:59:41 2025 +0200

    Data: Add async data fetching and wrap it in the old API

 scripts/{alternative_backend => }/database_config.js  |   0
 scripts/{alternative_backend => }/database_type.js    |   3 +-
 scripts/vocabulary.js                                 | 175 ++++++--------------------------------------------------
 scripts/{alternative_backend => }/vocabulary_await.js | 121 ++++++++++++++++++++++++++-------------
 4 files changed, 98 insertions(+), 201 deletions(-)
```



Note: The following commands work in Linux but not on Mac or Windows.

```bash
# Disable external fetching in the vocabulary script
sed -i 's/const FETCH_EXTERNAL = true;/const FETCH_EXTERNAL = false;/' scripts/vocabulary.js

# Download the latest word list from the Google Sheets document as a CSV file
# Original Sheet shows this error: 
#    Error: Duplicate ID found -> #ERROR!
#curl -L "https://docs.google.com/spreadsheets/d/1de16iRzmgSqWvTTxiNvQYM79sWJBwFJN0Up3Y0allDg/export?format=csv&gid=0" -o words.csv

# Curate DB for food
curl -L "https://docs.google.com/spreadsheets/d/16rDLsfAVBxNiDR9hT17w0rKA5gWWDrF2Z93-XJTH2bc/export?format=csv&gid=0" -o words.csv


# Verify that the FETCH_EXTERNAL constant has been updated in the vocabulary script
grep "const FETCH_EXTERNAL" scripts/vocabulary.js

# List the details of the downloaded CSV file to confirm its presence
ls -ltra words.csv

# Generate the vocabulary JSON file using the Python script
python3 ./assets/gen-vocab.py

# Count the number of lines in the generated vocabulary JSON file to verify its content
wc -l assets/vocabulary.json
```


## Run Static Website Locally


```bash
python3 -m http.server 8000
```

### Unit tests

http://127.0.0.1:8000/team10/index.html
http://127.0.0.1:8000/team10/learning_mode/learning_mode.html


## Run Static Website in GitHub Pages

Fork the repo, enable GitHub pages.
