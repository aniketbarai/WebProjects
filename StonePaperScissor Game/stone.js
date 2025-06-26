let userScore = 0;
let compScore = 0;

const choice = document.querySelectorAll(".choice");
let msg = document.querySelector("#msg");
let msgbox = document.querySelector(".msg-container");
let score = document.querySelector("#user-score");
let cScore = document.querySelector("#comp-score");

const genChoice = () => {
  //rock , paper , choice
  const options = ["rock", "paper", "scissors"];
  const randomIdx = Math.floor(Math.random() * 3);
  return options[randomIdx];
};

const draw = () => {
  msg.innerHTML = `Game is Draw. Play Again`;
  msgbox.style.backgroundColor = "grey";
};
const showWinner = (userWin, userChoice, compChoice) => {
  if (userWin) {
    msg.innerHTML = `You Win! Your ${userChoice} beats ${compChoice}`;
    msgbox.style.backgroundColor = "green";
    userScore++;
    score.innerHTML = userScore;
  } else {
    msg.innerHTML = `You Lost ! ${compChoice} beats ${userChoice}`;
    msgbox.style.backgroundColor = "red";
    compScore++;
    cScore.innerHTML = compScore;
  }
};
const playGame = (userChoice) => {
  //   console.log("userChoice is", userChoice);
  const compChoice = genChoice();
  console.log("CompChoice is", compChoice);
  if (userChoice === compChoice) {
    draw();
  } else {
    let userWin = true;
    if (userChoice === "rock") {
      //scissors,paper
      userWin = compChoice === "paper" ? false : true;
    } else if (userChoice === "paper") {
      //rock ,scissor
      userWin = compChoice === "scissors" ? false : true;
    } else {
      //rock,paper
      userWin = compChoice === "rock" ? false : true;
    }
    showWinner(userWin, userChoice, compChoice);
  }
};
let totalPlayed = 0;
let tp = document.querySelector("#played");
choice.forEach((e) => {
  e.addEventListener("click", () => {
    const userChoice = e.getAttribute("id");
    playGame(userChoice);
    totalPlayed++;
    // console.log(totalPlayed);
    tp.innerHTML = totalPlayed;
  });
});
