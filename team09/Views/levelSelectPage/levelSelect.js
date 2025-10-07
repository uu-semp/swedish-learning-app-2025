$(function() {


  $("#back-btn").on("click", () => { window.location.href = "../GameMainPage/GameMainPage.html"; });
  
  for (let i = 1; i <= 6; i++) {
  $(`#level${i}-btn`).on("click", () => {
    window.location.href = `../LevelView${i}/Levelview.html`;
  });
}
});
