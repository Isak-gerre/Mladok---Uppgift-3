"use strict";

// Add specific <head> stuff
// Here's where you add <link> and <title>, specific to this page
let css = document.createElement("link");
css.setAttribute("rel", "stylesheet");
css.setAttribute("href", "css/index.css");

// If you want to show something on Home page, feel free!

let widthOfBoxes = 10;
let boxes = [];
let antalBomber = 15;
let gameover = false;

let grid = document.createElement("div");
grid.classList.add("grid");
document.getElementsByTagName("main")[0].append(grid);

const gridElement = document.querySelector(".grid");

function createBoard() {
  let bombs = Array(antalBomber).fill("bomb");
  let empty = Array(widthOfBoxes * widthOfBoxes - antalBomber).fill("empty");
  let allBoxes = bombs.concat(empty);
  for (let i = 0; i < allBoxes.length; i++) {
    allBoxes.sort(() => Math.random() - Math.random());
  }

  for (let i = 0; i < 100; i++) {
    let div = document.createElement("div");
    div.classList.add("box", allBoxes[i]);
    div.setAttribute("id", i);
    //div.innerHTML = i;
    grid.append(div);

    boxes.push(div);

    div.addEventListener("click", function (e) {
      checkBox(this);
    });
  }

  addNumber();
}

function addNumber() {
  for (let i = 0; i < 100; i++) {
    let number = 0;
    let leftEdge = i % widthOfBoxes === 0 ? true : false;
    let rightEdge = i % widthOfBoxes === widthOfBoxes - 1 ? true : false;
    let topEdge = i > 0 && i < 9 ? true : false;
    let botEdge = i > 90 && i < 99 ? true : false;
    let middle = i % widthOfBoxes === 0 || i % widthOfBoxes === widthOfBoxes - 1 || topEdge || botEdge ? false : true;
    console.log(middle);

    if (boxes[i].classList.contains("empty")) {
      // Check left
      if (i > 0 && !leftEdge && boxes[i - 1].classList.contains("bomb")) number++;
      // Check right
      if (i < 99 && !rightEdge && boxes[i + 1].classList.contains("bomb")) number++;
      // Check right above
      if (i > 9 && !rightEdge && boxes[i + 1 - 10].classList.contains("bomb")) number++;
      // Check left above
      if (i > 9 && !leftEdge && boxes[i - 1 - 10].classList.contains("bomb")) number++;
      // Check right bellow
      if (i < 90 && !rightEdge && boxes[i + 1 + 10].classList.contains("bomb")) number++;
      // Check left bellow
      if (i < 90 && !leftEdge && boxes[i - 1 + 10].classList.contains("bomb")) number++;
      // Check above
      if (i > 9 && !topEdge && boxes[i - 10].classList.contains("bomb")) number++;
      // Check bellow
      if (i < 90 && !botEdge && boxes[i + 10].classList.contains("bomb")) number++;
      boxes[i].setAttribute("number", number);
    }
  }
}

function checkBox(box) {
  let number = box.getAttribute("number");

  if (gameover) return;
  if (
    box.classList.contains("checked") ||
    box.classList.contains("checked-no-number") ||
    box.classList.contains("flag")
  )
    return;
  if (box.classList.contains("bomb")) {
    return lose();
  } else {
    if (!box.classList.contains("bomb") && number != 0) {
      box.innerHTML = number;
      box.classList.add("checked");
      return;
    }
    checkAround(box);
  }

  box.classList.add("checked-no-number");
}

function lose() {
  gameover = true;
  let bombs = document.querySelectorAll(".bomb");
  bombs.forEach((obj) => obj.classList.add("show-bomb"));
  alert("You Lost!");
}

function checkAround(box) {
  let leftEdge = box.id % widthOfBoxes === 0 ? true : false;
  let rightEdge = box.id % widthOfBoxes === widthOfBoxes - 1 ? true : false;

  if (box.id > 0 && !leftEdge) {
    let id = boxes[parseInt(box.id) - 1].id;
    let newBox = document.getElementById(id);
    checkBox(newBox);
  }
  setTimeout(() => {
    if (box.id > 9 && !rightEdge) {
      let id = boxes[parseInt(box.id) + 1 - 10].id;
      let newBox = document.getElementById(id);
      checkBox(newBox);
    }
    if (box.id > 10) {
      let id = boxes[parseInt(box.id) - 10].id;
      let newBox = document.getElementById(id);
      checkBox(newBox);
    }
    if (box.id > 11 && !leftEdge) {
      let id = boxes[parseInt(box.id) - 1 - 10].id;
      let newBox = document.getElementById(id);
      checkBox(newBox);
    }
    if (box.id < 98 && !rightEdge) {
      let id = boxes[parseInt(box.id) + 1].id;
      let newBox = document.getElementById(id);
      checkBox(newBox);
    }
    if (box.id < 90 && !leftEdge) {
      let id = boxes[parseInt(box.id) - 1 + 10].id;
      let newBox = document.getElementById(id);
      checkBox(newBox);
    }
    if (box.id < 88 && !rightEdge) {
      let id = boxes[parseInt(box.id) + 1 + 10].id;
      let newBox = document.getElementById(id);
      checkBox(newBox);
    }
    if (box.id < 89) {
      let id = boxes[parseInt(box.id) + 10].id;
      let newBox = document.getElementById(id);
      checkBox(newBox);
    }
  }, 10);
}
createBoard();
