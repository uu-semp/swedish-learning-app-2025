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
   You have successfully cloned the repository to your machine.

2. **Get the latest changes:**
   
   ```bash
   git pull
   ```
   Ensure you have the latest version of the code locally.

3. **Create a feature branch:**

 ![Jira Git Integration](dev-tools/readme/Jira-git.png)


   To get the branch name:
   - Go to Jira and open the ticket you are going to work on
   - Click **Details** > **Development** > **Create branch**
   - Jira will suggest a name based on the title
   - You can modify it, but add `team10/` at the beginning
   - *Note: I will check with Allison to modify the prefix so `team10` is added automatically instead of `SCRUM-`*

   ```bash
   git checkout -b team10/SCRUM-43-add-readme-md-file
   ```
  
4. **Commit your changes:**

   ```bash
   # Add the file you want to commit.
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

7. **Approval required:** Follow the current git rule. At least one approval from any team member is required before merging changes to the main branch.

# Dev Tools

The aim of this folder is to have digestible practical tools and information to speed the development process

## GenAI

The project have use the next AI generative tools:

* Github copilot.

## Update word list

Note: Next commands works in Linux but not in MAC / Windows

```bash
# Disable external fetching in the vocabulary script
sed -i 's/const FETCH_EXTERNAL = true;/const FETCH_EXTERNAL = false;/' scripts/vocabulary.js

# Download the latest word list from the Google Sheets document as a CSV file
curl -L "https://docs.google.com/spreadsheets/d/1de16iRzmgSqWvTTxiNvQYM79sWJBwFJN0Up3Y0allDg/export?format=csv&gid=0" -o words.csv

# Verify that the FETCH_EXTERNAL constant has been updated in the vocabulary script
grep "const FETCH_EXTERNAL" scripts/vocabulary.js

# List the details of the downloaded CSV file to confirm its presence
ls -ltra words.csv

# Generate the vocabulary JSON file using the Python script
python3 ./assets/gen-vocab.py

# Count the number of lines in the generated vocabulary JSON file to verify its content
wc -l assets/vocabulary.json
```

## Run static webside locally


```bash
python3 -m http.server 8000
```
