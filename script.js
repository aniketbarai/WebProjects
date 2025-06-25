let timer = 60;
let score = 0;
let hitrn = 0;
function increaseScore() {
  score += 10;
  console.log(score);
  document.querySelector("#scoreval").textContent = score;
}
function getNewHit() {
  hitrn = Math.floor(Math.random() * 10);
  document.querySelector("#htval").textContent = hitrn;
}
getNewHit();
function makingBubble() {
  let clutter = "";
  for (let i = 0; i < 102; i++) {
    clutter += `<div class="bubble">${Math.floor(Math.random() * 10)}</div>`;
  }
  b = document.querySelector("#pbottom").innerHTML = clutter;
  document.querySelector(b).innerHTML = val;
}

function timeWatch() {
  setInterval(function () {
    if (timer > 0) {
      timer--;
      document.querySelector("#timerval").textContent = timer;
    } else {
      document.querySelector(
        "#pbottom"
      ).innerHTML = `<h1>The Game is End with Score of ${score} <h1/>`;
      document.querySelector("#pbottom").style.color = "rgb(107, 141, 250)";
    }
  }, 1000);
}
document.querySelector("#pbottom").addEventListener("click", (dets) => {
  let clickedNum = Number(dets.target.textContent);
  if (clickedNum === hitrn) {
    increaseScore();
    getNewHit();
    makingBubble();
  }
});
timeWatch();
makingBubble();
