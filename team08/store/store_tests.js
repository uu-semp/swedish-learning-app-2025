import {
  db_get_categories,
  db_get_images_of_ids,
  db_get_vocabs,
  init_db,
} from "./read.js";
import { CATEGORIES } from "./store_config.js";
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
