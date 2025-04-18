const GAME_SPEED = 200; // ms (화면 갱신 주기)
const BLOCK_SIZE = 20; // 블록 크기

let snake = {
  x: BLOCK_SIZE,
  y: BLOCK_SIZE,
  directionX: 1,
  directionY: 0,
}; // 뱀의 시작 위치

let direction = "right";
let canvas;

let apple = {
  x: 0,
  y: 0,
};

// DOM과 각종 필요한 여러 컴포넌트 로딩이 끝난 이후 이거 실행하라
window.onload = initialize;

function initialize() {
  canvas = document.getElementById("snakeCanvas");
  context = canvas.getContext("2d");

  // 키 이벤트 리스너
  document.addEventListener("keydown", setupEventListeners);

  makeApple();

  // 게임 시작 루프 호출
  setInterval(gameLoop, GAME_SPEED);
}

// 여기는 키보드 인터럽트(이벤트) 핸들러
// function setupEventListeners(e) {
//   // document.addEventListener("keydown", ...);

//   if (e.key === 'ArrowUp') {
//     console.log("위 누름");
//     snake.directionX = 0;
//     snake.directionY = -1;
//   } else if (e.key === 'ArrowDown') {
//     console.log("아래 누름");
//     snake.directionX = 0;
//     snake.directionY = 1;
//   } else if (e.key === 'ArrowLeft') {
//     console.log("왼쪽 누름");
//     snake.directionX = -1;
//     snake.directionY = 0;

//   } else if (e.key === 'ArrowRight') {
//     console.log("오른쪽 누름");
//     snake.directionX = 1;
//     snake.directionY = 0;

//   }

// }

function setupEventListeners() {
  document.addEventListener("keydown", (ev) => {
    switch (ev.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  });
}

function gameLoop() {
  // 뱀 이동
  moveSnake();

  checkAppleCollision();

  // 화면 렌더링
  draw();
}

// 뱀의 위치를 이동한다
function moveSnake() {
  switch (direction) {
    case "up":
      snake.y -= BLOCK_SIZE;
      break;
    case "down":
      snake.y += BLOCK_SIZE;
      break;
    case "left":
      snake.x -= BLOCK_SIZE;
      break;
    case "right":
      snake.x += BLOCK_SIZE;
      break;
  }


  // snake.x += BLOCK_SIZE * snake.directionX;
  // snake.y += BLOCK_SIZE * snake.directionY;

  // 화면을 벗어나지 않게... 오른쪽 끝 -> 왼쪽 끝에서 나오기 (vice versa)
  //                    위로 -> 아래로 나오기 (vice versa)
  if (snake.x > canvas.width - BLOCK_SIZE) {
    snake.x = canvas.width - BLOCK_SIZE;
  }
  if (snake.x < 0) {
    snake.x = 0;
  }
  if (snake.y > canvas.height - BLOCK_SIZE) {
    snake.y = canvas.height - BLOCK_SIZE;
  }
  if (snake.y < 0) {
    snake.y = 0;
  }
}

// 화면에 뱀을 그린다
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "blue";
  context.fillRect(snake.x, snake.y, BLOCK_SIZE, BLOCK_SIZE);

  // 사과 그리기
  context.fillStyle = "red";
  context.fillRect(apple.x, apple.y, BLOCK_SIZE, BLOCK_SIZE);
}

function makeApple() {
  // 화면을 벗어나지 않는 랜덤 위치에 빨간 사과(먹이)를 만든다
  context.fillStyle = "red";
  let randomNumber = Math.floor(Math.random() * 15);
  apple.x = BLOCK_SIZE * randomNumber;
  randomNumber = Math.floor(Math.random() * 15);
  apple.y = randomNumber * BLOCK_SIZE;

  context.fillRect(apple.x, apple.y, BLOCK_SIZE, BLOCK_SIZE);
}

function checkAppleCollision() {
  if (snake.x === apple.x && snake.y === apple.y) {
    makeApple();
  }
}
