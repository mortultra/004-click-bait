// Click Bait – A Very Dumb Game

// MVP goals

// -	Ball appears at center of canvas and starts travelling in a random direction DONE
// -	Each time the mouse is clicked, the direction changes randomly DONE
// -	If the ball reaches the edge of the canvas, it resets from the middle DONE
// -	There are areas which award points, if the ball hits those point, they are added to an array DONE

// HOW

// create scoringObjects that have position and score values
// if the ball and the scoringObject have the same x/y position (+/- radius to account for overlap), push scoringObject value to users pointsArray
// if ball.position[0] || ball.position[1] == scoringObject.position[0] || scoringObject[1] the push scoringObject.points to pointsArray
// Each time the user scores, the ball speeds up and the scoring zones shift
// If the ball hits the edge and resets, user loses points


// TO DO

// On ball out-of-bounds, decrement userScore DONE
// if userScore < -1000 end game
// create gameOverBad function that clears game from canvas and appends "YOU LOST" text

// When user scores, decrement number of goal objects in the goal array that generate on screen
// if user scores ten times goals[i] > 10 then end game
// create gameOverGood function that clears games from canvas and appends "YOU GOT LUCKY" text

// Append round to canvas, so user can keep track of rounds in a game

// Append userScore to canvas, so user can keep track of score increase/decrease



// MAYBE LATER

// When there is one goal object remaining, it moves.

// Either Easy Mode where direction is no longer random, 
// but increments 10º in one direction with every click

// Power ups on scoring which allow you a bit of control over the direction


// create a canvas for the play area
const c = document.createElement("canvas");
// return a drawing context (2d) for the canvas
const ctx = c.getContext("2d");

// canvas size is equal to the browser window
c.width = window.innerWidth;
c.height = window.innerHeight;

// append canvas (c) to document body
document.body.appendChild(c);

// ball object has colour, starting position, static radius, random velocity on click
const ball = {
  color: "#C0FF33",
  position: [500, 500],
  radius: 20,
  velocity: [(Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4],
  vMulti: 4,
};

// const goal = {
//   color: '#FFF',
//   position: [100, 100],
//   radius: 50,
//   points: 100,
// }

// empty goals array, starts empty, fills up to 10 on the screen at the start of a game
const goals = [];
// variable for max goals array length
let maxGoals = 9;

let reqAnim;

// the scoring zone (goals) are randomly distributed – position, radius and points
const goalFactory = function () {
  const difficulty = Math.random();
  // creating the goal object to populate the goals array
  const goal = {
    color: "#FFF",
    position: [
      // using math.random here, and not the difficulty variable. Using difficulty 
      // distributes the goal objects along linear paths
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight,
    ],
    radius: Math.max(10, difficulty * 50),
    points: Math.max(0.1, 1 - difficulty) * 100,
  };
  // when goalFactory is called in setUpGoals it will push objects to the array until the loop is finished
  goals.push(goal);
};


// setupGoals functions populates the goals array when called
const setupGoals = function () {
  // initial length of the goals array on load is 0
  goals.length = 0;

  // loop over the goals array, if index is less than 10 elements, iterate over filling array
  for (let i = 0; i <= maxGoals; i++) {
    // call goalFactory to push goal objects into the goals array until the loop is done
    goalFactory();
  }
};

// initial call to populate the goals array with scoring objects
setupGoals();

let userScore = 100;

let round = 0;

ctx.fillStyle = "#222222";
ctx.fillRect(0, 0, c.width, c.height);

// initial playing state on load, not executing ball/goal functions
let playing = false;

// initial game state on load
let gameOver = false;

// position of ball
const positionBall = function () {
  // when the player scores, update the vMulti value in a different function
  ball.position[0] += ball.velocity[0] * ball.vMulti;
  ball.position[1] += ball.velocity[1] * ball.vMulti;

  // if ball position horizontal (x for [0]) or vertical (y for [1]) is greater or less than 
  // the width or height of the canvas, the ball resets at a random direction in the middle 
  // of the canvas
  if (
    ball.position[0] > c.width ||
    ball.position[0] < 0 ||
    ball.position[1] > c.height ||
    ball.position[1] < 0
  ) {
    ball.position = [c.width / 2, c.height / 2];
    changeBallDirection();
    userScore -= 100;
  }
};

// when the ball direction is updated by the user on click or reset on out-of-bounds, 
// the velocity is also updated
const changeBallDirection = function () {
  // any time the velocity is changed, it is re-rolled here
  ball.velocity[0] = (Math.random() - 0.5) * 4;
  ball.velocity[1] = (Math.random() - 0.5) * 4;
};

// detecting when the user ball radius overlaps with the goal area
const scoreDetection = function () {
  for (let i = 0; i < goals.length; i++) {
    // each index entry in the goals array is a goal object represented on screen
    const goal = goals[i];
    // distance between goal and ball is calculated with the 
    // distance formula (d = √(x1 - x2)2 + (y1 - y2)2)
    // note: the formula is broken up between the c and distance varibles
    const c = [
      // c[0] = horizontal position of goal object minus the horizontal position of ball object
      goal.position[0] - ball.position[0],
      // c[1] = vertical position of goal object minus the vertical position of ball object
      goal.position[1] - ball.position[1],
    ];
    const distance = Math.sqrt(c[0] * c[0] + c[1] * c[1]);
    // if the distance between the ball and goal is less than the sum of their radii, 
    // the user scores a goal
    if (distance < (goal.radius + ball.radius)) {
      scoreGoal(goal);
      console.log(maxGoals);      
    }
  }
};

// scoreGoal function adds to the userScore equal to the points in the goal object
// this function is called above in the scoreDetection function
const scoreGoal = function (goal) {
  userScore += Math.floor(goal.points);
  round++;

  // decrement maxGoals by 1 on scoreGoal, so that when setupGoals is called again
  // it iterates over one less time, and the array is one element shorter
  maxGoals = maxGoals - 1;

  // resets the goals array when scoreGoal is called in goalDetection
  // this reset redistributes the goal objects around the map again
  setupGoals();
};

// function to render the game, ball and goal objects
const render = function () {
  // ctx.clearRect(0, 0, c.width, c.height);

  // background
  ctx.fillStyle = "rgba(34,34,34,.4)";
  ctx.fillRect(0, 0, c.width, c.height);

  // ball
  ctx.beginPath();
  ctx.arc(ball.position[0], ball.position[1], ball.radius, 0, Math.PI * 2);
  ctx.closePath();

  // ball color
  ctx.fillStyle = ball.color;
  ctx.fill();

  // goal
  goals.forEach(function (goal) {
    ctx.beginPath();
    ctx.arc(goal.position[0], goal.position[1], goal.radius, 0, Math.PI * 2);
    ctx.closePath();
    // goal color
    ctx.fillStyle = goal.color;
    ctx.fill();
  });
};

// message for win state, called in endLoop function
const notifyWin = function () {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText(`You got lucky.`, 50, 50);
};

// message for lose state, called in endLoop function
const notifyLoss = function () {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText(`You died.`, 50, 50);
};

const cancelAnim = function () {
  // cancel rAF in runLoop
  cancelAnimationFrame(reqAnim);
}

const clearCanvas = function () {
  ctx.clearRect(0, 0, c.width, c.height);
}

// endLoop function 
const endLoop = function () {
  if (goals.length === 0) {
    playing = false;
    gameOver = true;
    cancelAnim();
    clearCanvas();
    notifyWin();
    console.log(`playing: ${playing}`);
    console.log(`game over: ${gameOver}`);
  } else if (userScore <= -1500) {
    playing = false;
    gameOver = true;
    cancelAnim();
    clearCanvas();
    notifyLoss();
    console.log(`playing: ${playing}`);
    console.log(`game over: ${gameOver}`);
  }
}

// runLoop function callstack for functions that need to be continually updated
const runLoop = function () {
  // save animation request in a varable
  reqAnim = requestAnimationFrame(runLoop);
  // if playing = true, then execute requestAnimationFrame method
  if (playing) {
    reqAnim;
  }
  // call position, render, scoreDetection functions
  positionBall();
  render();
  scoreDetection();
  console.log(`score: ${userScore}`);
  console.log(`goals remaining: ${goals.length}`);
  endLoop();
};




// event listener on the canvas for user input
c.addEventListener("click", function () {
  // if playing is false, on click playing = true & requestFrameAnimation is called
  if (!playing) {
    requestAnimationFrame(runLoop);
    playing = true;
  }
  // on every click after, call changeBallDirection function
  changeBallDirection();
});
