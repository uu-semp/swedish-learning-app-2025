/**
 * Stores rendered garment pictures in the browser's IndexedDB, one per
 * garment, colour and pattern. The game renders the pictures for the
 * next round in advance and keeps them here, so they survive the page
 * reload between rounds; pictures no round needs any more are deleted.
 *
 * The pictures are too large for localStorage, which is why IndexedDB is
 * used here. Every function fails quietly (resolving to null / doing
 * nothing) when IndexedDB is unavailable, e.g. in some private windows;
 * the game then simply renders the pictures it needs.
 */

const DB_NAME = "game13";
const DB_VERSION = 2;
const STORE = "pictures";

let dbPromise = null;

function openDb() {
    dbPromise ??= new Promise((resolve) => {
        try {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = () => {
                const db = request.result;
                // Version 1 stored whole wardrobes per level; no longer used.
                if (db.objectStoreNames.contains("wardrobes")) db.deleteObjectStore("wardrobes");
                if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(null);
            request.onblocked = () => resolve(null);
        } catch {
            resolve(null);
        }
    });
    return dbPromise;
}

function run(mode, action) {
    return openDb().then((db) => new Promise((resolve) => {
        if (!db) return resolve(null);
        try {
            const tx = db.transaction(STORE, mode);
            const request = action(tx.objectStore(STORE));
            tx.oncomplete = () => resolve(request?.result ?? null);
            tx.onerror = () => resolve(null);
            tx.onabort = () => resolve(null);
        } catch {
            resolve(null);
        }
    }));
}

/** A stored picture ({ thumb: Blob, box }), or null. */
export function getStoredPicture(key) {
    return run("readonly", (store) => store.get(key));
}

/** Stores a picture under its key. */
export function storePicture(key, picture) {
    return run("readwrite", (store) => store.put(picture, key));
}

/** The keys of all stored pictures, as a Set. */
export async function storedPictureKeys() {
    return new Set(await run("readonly", (store) => store.getAllKeys()) ?? []);
}

/** Deletes every stored picture whose key is not in the keep Set. */
export function deletePicturesExcept(keep) {
    return run("readwrite", (store) => {
        const request = store.openKeyCursor();
        request.onsuccess = () => {
            const cursor = request.result;
            if (!cursor) return;
            if (!keep.has(cursor.key)) store.delete(cursor.key);
            cursor.continue();
        };
        return null;
    });
}
