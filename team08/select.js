import { CATEGORIES } from "./store/store_config.js";
import { local_set_categories } from "./store/write.js";

const CONTINUE_BTN = document.querySelector("#start-game");
const FOOD = document.querySelector("#Food");
const CLOTHING = document.querySelector("#Clothing");
const FURNITURE = document.querySelector("#Furniture");

/** @type {HTMLElement} */
const ERROR = document.querySelector(".error-message");

CATEGORIES;

CONTINUE_BTN.addEventListener("click", (e) => {
  e.preventDefault();
  const selected_categories = [];
  if (FOOD.checked) selected_categories.push(CATEGORIES.FOOD);
  if (CLOTHING.checked) selected_categories.push(CATEGORIES.CLOTHING);
  if (FURNITURE.checked) selected_categories.push(CATEGORIES.FURNITURE);
  if (selected_categories.length == 0) {
    console.error("No categories selected");
    ERROR.style.display = "block";
    CONTINUE_BTN.classList.add("animate");
    return;
  }
  local_set_categories(selected_categories);
  window.location.href = CONTINUE_BTN.href;
});

CONTINUE_BTN.addEventListener("animationend", () => {
  CONTINUE_BTN.classList.remove("animate");
});
