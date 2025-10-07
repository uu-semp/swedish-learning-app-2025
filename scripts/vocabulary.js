// ==============================================
// Owned by the Data Team
// ==============================================

// This creates the `data` object to import the vocabulary

"use strict";

// Indicates if the vocabulary data should be fetched from the repository
// or from an external source.
const FETCH_EXTERNAL = true;

window._vocabulary = {
    vocab: null,
    categories: null,
    pending: 0,
    team: null,
    populate_team_data: null,
}

// ===================================================================================================
// TODO: Fetching from Google Sheets is a temporary hack and should be replaced with files in the repo
// ===================================================================================================
if (FETCH_EXTERNAL) {
    window._vocabulary.pending += 1;
    (async () => {
        const papa_promise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });

        const sheetId = "1de16iRzmgSqWvTTxiNvQYM79sWJBwFJN0Up3Y0allDg";
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;

        const resp = await fetch(url);
        const text = await resp.text();
        await papa_promise;

        console.log("Data: All data received")
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        const rows = parsed.data;

        const idToMeta = {};
        const catToIds = {};

        for (const row of rows) {
            const id = row["ID"]?.trim();
            if (!id) continue;

            // Metadata
            const meta = { en: row["English"], sv: row["Swedish"] };
            if (row["Swedish_plural"]?.trim()) meta.sv_pl = row["Swedish_plural"];
            if (row["Article"]?.trim()) meta.article = row["Article"];
            if (row["Literal"]?.trim()) meta.literal = row["Literal"];
            if (row["Image_url"]?.trim()) meta.img = row["Image_url"];
            if (row["Image_copyright_info"]?.trim()) meta.img_copyright = row["Image_copyright_info"];
            if (row["Audio_url"]?.trim()) meta.audio = row["Audio_url"];
            idToMeta[id] = meta;

            // Category
            const cat = row["Category"]?.trim();
            if (cat) {
                if (!catToIds[cat]) catToIds[cat] = [];
                catToIds[cat].push(id);
            }
        }

        window._vocabulary["rows"] = rows;
        window._vocabulary["vocab"] = idToMeta;
        window._vocabulary["categories"] = catToIds;

        // Mark operation as done
        console.log("Data: Parsing complete");

        if (window._vocabulary.team) {
            window._vocabulary.populate_team_data(window._vocabulary.team);
        }

        // Check callbacks
        window._vocabulary.pending -= 1;
        checkCallbacks();
    })();

    window._vocabulary.populate_team_data = (team_id) => {
        if (!("rows" in window._vocabulary)) {
            window._vocabulary.team = team_id;
            // This function will be called again, once the raw data is available
            return;
        }

        // Stringify incase this get a number
        const team_id_str = String(team_id).padStart(2, "0");
        const column_name = `Team${team_id_str}`;

        const idToMeta = {};
        for (const row of window._vocabulary.rows) {
            if (!row[column_name] || !row["ID"]) continue;

            const id = row["ID"].trim();
            idToMeta[id] = row[column_name].trim();
        }

        window._vocabulary.team = idToMeta;
        console.log("Data: Loading team data complete");
    }
} else {
    window._vocabulary.pending += 1;
    (async () => {
        const papa_promise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });

        // The .. is relative from a team folder. This is needed to support localhost
        // and GH pages
        const url = `../words.csv`;

        const resp = await fetch(url);
        const text = await resp.text();
        await papa_promise;

        console.log("Data: All data received")
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        const rows = parsed.data;

        const idToMeta = {};
        const catToIds = {};

        for (const row of rows) {
            const id = row["id"]?.trim();
            if (!id) continue;

            // Metadata
            const meta = { en: row["en"], sv: row["sv"] };
            if (row["literal"]?.trim()) meta.literal = row["literal"];
            if (row["image_path"]?.trim()) meta.img = row["image_path"];
            idToMeta[id] = meta;

            // Category
            const cat = row["category"]?.trim();
            if (cat) {
                if (!catToIds[cat]) catToIds[cat] = [];
                catToIds[cat].push(id);
            }
        }

        window._vocabulary["rows"] = rows;
        window._vocabulary["vocab"] = idToMeta;
        window._vocabulary["categories"] = catToIds;

        // Mark operation as done
        console.log("Data: Parsing complete");

        if (window._vocabulary.team) {
            window._vocabulary.populate_team_data(window._vocabulary.team);
        }

        // Check callbacks
        window._vocabulary.pending -= 1;
        checkCallbacks();
    })();

    window._vocabulary.populate_team_data = (team_id) => {
        if (!("rows" in window._vocabulary)) {
            window._vocabulary.team = team_id;
            // This function will be called again, once the raw data is available
            return;
        }

        // Stringify incase this get a number
        const team_id_str = String(team_id);
        
        const idToMeta = {};
        for (const row of window._vocabulary.rows) {
            if (row["team"] === team_id_str && row["id"]) {
                const id = row["id"].trim();
                // For now, we just use a boolean flag to indicate the team has data for this word.
                // The prompt is a bit unclear on what should be stored.
                idToMeta[id] = true; 
            }
        }

        window._vocabulary.team = idToMeta;
        console.log("Data: Loading team data complete");
    }
}


// Provide functions to be used by other scripts
window.vocabulary = {
    callbacks: [],

    // This returns the vocabulary metadata belonging to the given ID.
    //
    // Words usually have the following metadata:
    // - `en`       The vocabulary in english
    // - `sv`       The vocabulary in swedish
    // - `article`  The article of the word (Optional)
    // - `literal`  The literal representation of the word (Optional)
    // - `img`      The URL of the image for this word (Optional)
    // - `audio`    The URL of the audio for this word (Optional)
    get_vocab(id) {
        if (id in window._vocabulary.vocab) {
            return window._vocabulary.vocab[id];
        }

        return null;
    },

    // Returns a list of vocabulary IDs belonging to the given category.
    get_category(category) {
        if (category in window._vocabulary.categories) {
            return window._vocabulary.categories[category];
        }

        return null;
    },

    // Returns a random vocabulary item. See `get_vocab()`
    get_random() {
        const ids = Object.keys(window._vocabulary.vocab);
        const rand_id = ids[Math.floor(Math.random() * ids.length)];
        return this.get_vocab(rand_id);
    },

    when_ready(callback) {
        if (window._vocabulary !== undefined && window._vocabulary.pending == 0) {
            callback();
        } else {
            this.callbacks.push(callback);
        }
    },

    load_team_data(team_id) {
        window._vocabulary.populate_team_data(team_id);
    },

    // This returns the team metadata belonging to the given ID.
    get_team_data(id) {
        const team_data = window._vocabulary?.team ?? {};

        if (id in team_data) {
            return team_data[id];
        }

        return null;
    },

    // Returns all keys available in the loaded team data. Note that
    // `load_team_data()` has to be called first and should be done before
    // `when_ready()`
    get_team_data_keys() {
        const team_data = window._vocabulary?.team ?? {};

        return Object.keys(team_data);
    }
};

function checkCallbacks() {
    // Check that `window.vocabulary` is already defined
    if (window.vocabulary === undefined) {
        return;
    }

    // Check if all pending requests are done
    if (window._vocabulary.pending > 0) {
        return;
    }

    // Snapshot the current callbacks
    const cbs = window.vocabulary.callbacks;

    // Clear the list again
    window.vocabulary.callbacks = []

    // Call all callbacks
    for (const cb of cbs) {
        if (typeof cb === "function") cb();
    }
}
