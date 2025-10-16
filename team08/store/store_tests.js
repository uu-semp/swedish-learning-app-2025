import {
  db_get_audio_of_ids,
  db_get_categories,
  db_get_images_of_ids,
  db_get_vocabs,
  get_n_random_words,
  init_db,
  local_get_categories,
  local_get_volume,
} from "./read.js";
import { CATEGORIES } from "./store_config.js";
import { local_set_categories, local_set_volume } from "./write.js";
await init_db();

function test_get_categories() {
  const categories = [CATEGORIES.CLOTHING, CATEGORIES.FOOD];
  const RESULT = db_get_categories(categories);
  console.log(`Get categories: ${RESULT}`);
}

test_get_categories();

function test_get_categories_words() {
  const categories = [CATEGORIES.CLOTHING, CATEGORIES.FOOD];
  const RESULT = db_get_vocabs(db_get_categories(categories));

  console.log(`Get words from categories: ${RESULT.map((item) => item.sv)}`);
  if (RESULT.length == db_get_categories(categories).length) {
    console.log("length is right");
  }
}

test_get_categories_words();

function test_get_categories_images() {
  const categories = [CATEGORIES.CLOTHING, CATEGORIES.FOOD];
  const RESULT = db_get_images_of_ids(db_get_categories(categories));
  console.log(`Get images from categories: ${RESULT}`);
}

test_get_categories_images();

function test_locals() {
  local_set_categories([CATEGORIES.CLOTHING, CATEGORIES.FOOD]);
  local_set_volume(50);
  console.log("volume test: ", local_get_volume() == 50);
  console.log(
    "local category test: ",
    JSON.stringify(local_get_categories()) ==
      JSON.stringify([CATEGORIES.CLOTHING, CATEGORIES.FOOD])
  );
}
test_locals();

function uniform_probability() {
  /** @type {Map<Number, Number>} */
  const result = new Map();
  for (let i = 1; i <= 4; i++) {
    result.set(i, 0);
  }
  for (let i = 0; i < 100000; i++) {
    get_n_random_words([1, 2, 3, 4], 3).forEach((item) => {
      result.set(item, result.get(item) + 1);
    });
  }
  let sum = 0;
  result.forEach((value, key) => (sum += value));
  let avg = sum / 4;
  let truth = true;

  result.forEach(
    (value, key) => (truth = Math.abs(value - avg) <= 0.01 * avg && truth)
  );
  result.forEach((value, key) => console.log(value));
  console.log("uniform probability test: ", truth);
}
uniform_probability();

function test_safe_get() {
  localStorage.clear();
  console.log(local_get_volume());
  console.log("Safe get works: ", local_get_volume() == 50);
}
test_safe_get();

function test_nulls() {
  let result = true;
  db_get_audio_of_ids([1, 2, 3, 4]).forEach(
    (item) => (result = result && item == null)
  );
  console.log("null test: ", result);
}
test_nulls();
