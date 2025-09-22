import { loaddb } from "../team08/store/alternative_backend/vocabulary_await.js";

const db = await loaddb();

console.log(db.rows[0].Article != null);
console.log(db.rows[0].Audio_url != null);
console.log(db.rows[0].Category != null);
console.log(db.rows[0].English != null);
console.log(db.rows[0].Swedish != null);
console.log(db.rows[0].Swedish_plural != null);
console.log(db.rows[0].Team01 != null);
console.log(db.rows[0].Team02 != null);
console.log(db.rows[0].Team03 != null);
console.log(db.rows[0].Team04 != null);
console.log(db.rows[0].Team05 != null);
console.log(db.rows[0].Team06 != null);
console.log(db.rows[0].Team07 != null);
console.log(db.rows[0].Team08 != null);
console.log(db.rows[0].Team09 != null);
console.log(db.rows[0].Team10 != null);
console.log(db.rows[0].Team11 != null);
console.log(db.rows[0].Team13 != null);
console.log(db.rows[0].Team14 != null);
console.log(db.rows[0].Team15 != null);
console.log(db.rows[0].Team16 != null);

let result = true;

db.rows.forEach((el) => {
  result =
    result &&
    !(
      el.Article == null ||
      el.Audio_url == null ||
      el.Category == null ||
      el.English == null ||
      el.Swedish == null ||
      el.Swedish_plural == null ||
      el.Team01 == null ||
      el.Team02 == null ||
      el.Team03 == null ||
      el.Team04 == null ||
      el.Team05 == null ||
      el.Team06 == null ||
      el.Team07 == null ||
      el.Team08 == null ||
      el.Team09 == null ||
      el.Team10 == null ||
      el.Team11 == null ||
      el.Team13 == null ||
      el.Team14 == null ||
      el.Team15 == null ||
      el.Team16 == null
    );
});

console.log(result);

result = true;
console.log(db.vocabLength == db.rows.length);

// This fails because vocab key is not always initiated, better to set as zero?
Object.keys(db.vocab).forEach((key) => {
  result =
    result &&
    db.vocab[key].en != null &&
    db.vocab[key].sv != null &&
    db.vocab[key].article != null;
});

console.log(result);

console.log(get_vocabulary_word());
console.log(get_random(db).sv);
console.log(get_category(db, "food"));
