export const FETCH_EXTERNAL = true;

// Change this if you google sheets location has changed
export const SHEETID = "1de16iRzmgSqWvTTxiNvQYM79sWJBwFJN0Up3Y0allDg";
export const EXTERNAL_URL = `https://docs.google.com/spreadsheets/d/${SHEETID}/export?format=csv&gid=0`;

// Change this if you have changed csv file.
// Resolved relative to scripts/, not to the page that loads it.
export const INTERNAL_URL = "../words.csv";
