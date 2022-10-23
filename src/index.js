const body = document.querySelector("body");
const menuContainer = document.createElement("div");
const puzzleContainer = document.createElement("div");
const startButton = document.createElement("button");
const audioButton = document.createElement("button");
const saveButton = document.createElement("button");
const resultsButton = document.createElement("button");
const textContainer = document.createElement("div");
const moveText = document.createElement("p");
const timeText = document.createElement("p");
const moveNumber = document.createElement("p");
const timeNumber = document.createElement("p");
const frames = document.createElement("div");

const burgerMenu = document.createElement("div");

// adding class to elements
menuContainer.className = "menu__container";
puzzleContainer.className = "puzzle__container";
startButton.className = "start__button button";
audioButton.className = "stop__button button";
saveButton.className = "save__button button";
resultsButton.className = "results__button button";
textContainer.className = "text__container";
moveText.className = "move__text";
timeText.className = "time__text";
moveNumber.className = "move__number";
timeNumber.className = "time__number";
frames.className = "frames__container";

// adding text to elements

startButton.innerHTML = "start and shuffle";
audioButton.innerHTML = "ON";
saveButton.innerHTML = "save";
resultsButton.innerHTML = "results";
moveText.innerHTML = "Moves";
timeText.innerHTML = "Time";
moveNumber.innerHTML = 0;
timeNumber.innerHTML = "00:00";

// append elements

menuContainer.append(startButton);
menuContainer.append(audioButton);
menuContainer.append(saveButton);
menuContainer.append(resultsButton);
body.append(menuContainer);
textContainer.append(moveText);
textContainer.append(moveNumber);
textContainer.append(timeText);
textContainer.append(timeNumber);
body.append(textContainer);
body.append(puzzleContainer);
body.append(frames);

/////////////////////////////////////////////////////////
let frameNumber = 4;
let cellSize = 100;
let moveCounter = 0;
let timer;
let milliseconds = 0;
let time;
let audioOn = true;

const audio = document.createElement("audio");
audio.src = "../assets/audio/click.mp3";

let resultsList;

function Puzzle() {
  let empty = {
    left: 0,
    top: 0,
  };

  let cellPositions = [];

  function timers() {
    clearInterval(timer);
    timer = setInterval(() => {
      milliseconds += 10;
      let dateTimer = new Date(milliseconds);

      time =
        ("0" + dateTimer.getUTCMinutes()).slice(-2) +
        ":" +
        ("0" + dateTimer.getUTCSeconds()).slice(-2);

      timeNumber.innerHTML =
        ("0" + dateTimer.getUTCMinutes()).slice(-2) +
        ":" +
        ("0" + dateTimer.getUTCSeconds()).slice(-2);
    }, 10);
  }

  audioButton.addEventListener("click", () => {
    if (audioOn) {
      audioOn = false;
      audioButton.innerHTML = "OFF";
    } else {
      audioOn = true;
      audioButton.innerHTML = "ON";
    }
  });

  function moveCell(index) {
    moveCounter++;
    const isFinished = cellPositions.every((cell) => {
      console.log(cell.value, cell.top * frameNumber + cell.left);
      return cell.value == cell.top * frameNumber + cell.left;
    });
    const cell = cellPositions[index];
    const emptyLeft = empty.left;
    const emptyTop = empty.top;
    const leftDifference = Math.abs(empty.left - cell.left);
    const topDifference = Math.abs(empty.top - cell.top);

    moveNumber.innerHTML = moveCounter;

    if (isFinished) {
      alert(
        `Hooray! You solved the puzzle in ${time} and ${moveCounter - 1} moves!`
      );
      clearInterval(timer);
    }

    if (leftDifference + topDifference > 1) return;

    cell.cell.style.left = `${empty.left * cellSize}px`;
    cell.cell.style.top = `${empty.top * cellSize}px`;

    if (audioOn) audio.play();

    empty.left = cell.left;
    empty.top = cell.top;

    cell.left = emptyLeft;
    cell.top = emptyTop;
  }

  function puzzle(randomNumbers) {
    cellPositions = [];
    for (let i = 0; i < frameNumber * frameNumber - 1; i++) {
      const cell = document.createElement("div");

      const left = (i + 1) % frameNumber;
      const top = (i + 1 - left) / frameNumber;

      cell.className = "cell";
      cell.style.left = `${left * cellSize}px`;
      cell.style.top = `${top * cellSize}px`;
      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;

      cell.innerHTML = i + 1; //randomNumbers[i];
      cell.setAttribute("value", i + 1); //`${randomNumbers[i]}`);
      //   cell.setAttribute("value", `${i + 1}`);

      const value = cell.getAttribute("value");

      puzzleContainer.append(cell);

      cellPositions.push({
        value: value,
        left: left,
        top: top,
        cell: cell,
      });

      function listener() {
        moveCell(i);
      }
      function moveCellListener() {
        cell.addEventListener("click", listener);
      }
      moveCellListener();
    }
  }

  function puzzleFrames() {
    for (let i = 0; i < 6; i++) {
      const frame = document.createElement("span");
      frame.innerHTML = `${i + 3}x${i + 3}`;
      frames.append(frame);

      frame.addEventListener("click", () => {
        frameNumber = i + 3;
        moveCounter = 0;
        moveNumber.innerHTML = 0;
        start();
        milliseconds = 0;
        timers();
      });
    }
  }

  function randomNumber() {
    const randomNumbers = [];
    randomNumbers.push(
      [...Array(frameNumber * frameNumber - 1).keys()].sort(
        () => Math.random() - 0.5
      )
    );
    const indexOfZero = randomNumbers[0].indexOf(0);
    if (frameNumber == 3) {
      randomNumbers[0][indexOfZero] = 8;
      cellSize = 133;
    } else if (frameNumber == 4) {
      randomNumbers[0][indexOfZero] = 15;
      cellSize = 99;
    } else if (frameNumber == 5) {
      randomNumbers[0][indexOfZero] = 24;
      cellSize = 79.4;
    } else if (frameNumber == 6) {
      randomNumbers[0][indexOfZero] = 35;
      cellSize = 66;
    } else if (frameNumber == 7) {
      randomNumbers[0][indexOfZero] = 48;
      cellSize = 56.7;
    } else {
      randomNumbers[0][indexOfZero] = 63;
      cellSize = 49.7;
    }

    return randomNumbers[0];
  }

  function start() {
    puzzleContainer.innerHTML = "";
    empty.left = 0;
    empty.top = 0;
    moveCounter = 0;
    moveNumber.innerHTML = 0;
    const randomNumbers = randomNumber();
    puzzle(randomNumbers);

    milliseconds = 0;
    timers();
  }

  startButton.addEventListener("click", start);

  puzzleFrames();
}

Puzzle();
