const canvas = document.getElementById("sandbox");
canvas.width = 1000;
canvas.height = 700;
let frame = 0;
const frameEnd = 1440;

const blackHoleSpriteMap = [];
for (let i = 0; i < 36; i++) {
  const newFrame = new Image();
  newFrame.src =
    i < 10
      ? `./images/black_hole_frames/frame_0${i}_delay-0.02s.png`
      : `./images/black_hole_frames/frame_${i}_delay-0.02s.png`;
  blackHoleSpriteMap.push(newFrame);
}

const backgroundImage = new Image();
backgroundImage.src = "./images/800px_COLOURBOX1168602.jpg";

const rocketShipImage = new Image();
rocketShipImage.src = "./images/rocket_ship.png";

const rightAstronautImage = new Image();
rightAstronautImage.src = "./images/right_astronaut.png";

const leftAstronautImage = new Image();
leftAstronautImage.src = "./images/left_astronaut.png";

const ctx = canvas.getContext("2d");

function Background(backgroundImage) {
  this.x = 0;
  this.y = 0;
  this.image = backgroundImage;
  this.keyFrame = 1;
  this.angle = 0;
  this.width = Math.round(Math.sqrt(canvas.width ** 2 + canvas.height ** 2));
  this.height = Math.round(Math.sqrt(canvas.width ** 2 + canvas.height ** 2));
  this.hypotenuse = Math.sqrt(2 * (canvas.width ** 2 + canvas.height ** 2));
  this.drawingTop = true;
  this.incrementAngle = 0;

  this.dx = 2;

  this.draw = function () {
    // console.log("Coords", this.x, this.y);
    // console.log("Angle", this.angle);
    if (!this.run && this.runOnFrame !== frame) this.run = true;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.image, 0, 0, this.width, this.height);
    ctx.rotate(-this.angle);
    ctx.translate(-this.x, -this.y);
  };

  this.animate = function () {
    this.x += this.dx;
    if (this.drawingTop) {
      this.y =
        canvas.height / 2 -
        Math.sqrt(745000 - (this.x - canvas.width / 2) ** 2);
    } else if (!this.drawingTop) {
      this.y =
        canvas.height / 2 +
        Math.sqrt(745000 - (this.x - canvas.width / 2) ** 2);
    }
    let c2 =
      (canvas.width - this.x - (this.x + this.width)) ** 2 +
      (canvas.height - this.y - (this.y + this.height)) ** 2;
    this.angle = Math.acos(
      (c2 - 2 * this.hypotenuse ** 2) / (-2 * this.hypotenuse ** 2)
    );
    if (this.x >= 1090 && this.x <= 1110 && this.y > 350) {
      this.angle = ((175 + this.incrementAngle) * Math.PI) / 180;
      this.incrementAngle += 0.2;
    }
    if (this.x < 1090 && this.y > 350) this.incrementAngle = 0;
    if (this.x < 1090 && this.y > 350) this.angle = -this.angle;

    if (
      this.x > (canvas.width + this.width) / 2 ||
      this.x < (canvas.width - this.width) / 2
    ) {
      this.dx = -this.dx;
      this.drawingTop === true
        ? (this.drawingTop = false)
        : (this.drawingTop = true);
    }

    this.draw();
  };
}

function Sprite(spriteMap, x, y, dx, dy, repeatable = false) {
  this.map = spriteMap;
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.counter = 0;
  this.active = this.map[this.counter];
  this.repeat = repeatable;
  this.forward = true;
  this.run = false;
  this.runOnFrame = 0;
  this.keyFrame = 1;

  this.draw = () => {
    if (!this.run && this.runOnFrame !== frame) {
      this.run = true;
      // console.log("Run changed to false", this.runOnFrame, frame);
    }
    if (this.active) ctx.drawImage(this.active, this.x, this.y);
    // else console.log(this.counter, this.map[this.counter - 1]);
  };

  this.animate = () => {
    this.x += this.dx;
    this.y += this.dy;
    if (this.repeat && this.counter >= this.map.length - 1) this.counter = 0;
    if (this.counter === 0) this.forward = true;
    if (this.counter >= this.map.length - 1 && this.map.length !== 0)
      this.forward = false;
    this.active = this.map[this.counter];
    // console.log(
    //   "Active sprite => ",
    //   this.active,
    //   "Map is",
    //   this.map,
    //   "Counter is",
    //   this.counter
    // );

    this.forward == true ? this.counter++ : this.counter--;
    this.draw();
  };
}

function SingleSprite(
  spriteImage,
  keyFrame = 1,
  x,
  y,
  dx = (Math.floor(Math.random() * 4) + 1) * Math.floor(Math.random() * 2) == 1
    ? 1
    : -1,
  dy = (Math.floor(Math.random() * 4) + 1) * Math.floor(Math.random() * 2) == 1
    ? 1
    : -1,
  boundaryXTop = 0,
  boundaryXBottom = canvas.width,
  boundaryYTop = 0,
  boundaryYBottom = canvas.height,
  angle = null
) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.angle = angle;
  this.boundXTop = boundaryXTop;
  this.boundXBm = boundaryXBottom;
  this.boundYTop = boundaryYTop;
  this.boundYBm = boundaryYBottom;
  this.sprite = spriteImage;
  this.width = spriteImage.width;
  this.height = spriteImage.height;
  this.keyFrame = keyFrame;
  this.run = true;

  this.draw = () => {
    if (!this.run && this.runOnFrame !== frame) this.run = true;
    if (this.angle) {
      ctx.translate(this.x, this.y);
      ctx.rotate(-this.angle);
      ctx.drawImage(this.sprite, 0, 0, this.width, this.height);
      ctx.rotate(this.angle);
      ctx.translate(-this.x, -this.y);
    } else {
      ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
  };

  this.animate = () => {
    this.y += this.dy;
    this.x += this.dx;

    if (this.y + this.height > this.boundYBm || this.y < this.boundYTop)
      this.dy = -this.dy;

    if (this.x + this.width > this.boundXTop || this.x < this.boundXBm)
      this.dx = -this.dx;

    this.draw();
  };

  this.spaghettify = () => {
    this.y += this.dy;
    this.height -= 3;
    this.width -= 1;

    this.draw();
  };
}

function TextBubble(message, x, y) {
  this.x = x;
  this.y = y;
  this.rx = 80;
  this.ry = 60;
  this.message = message;

  this.draw = () => {
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.ellipse(this.x, this.y, this.rx, this.ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(this.x + 70, this.y + 50, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(this.x + 78, this.y + 58, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = "15px Arial";
    const sentence = message.split(" ");
    // console.log("Sentence => ", sentence);
    let space = 0;
    let line = [];
    let onIndex = 0;
    let lineNum = 0;
    sentence.forEach((word, index, arr) => {
      space += word.length + 1;
      if (space >= 15) {
        for (let i = onIndex; i < index; i++) {
          line.push(arr[i]);
        }
        onIndex = index;
        line = line.join(" ");
        // console.log("Line printed => ", line);
        ctx.fillText(line, this.x - 70, this.y - 15 + lineNum * 15);
        line = [];
        lineNum++;
        space = 0;
      }
      if (index === arr.length - 1) {
        for (let i = onIndex; i < arr.length; i++) {
          line.push(arr[i]);
        }
        onIndex = index;
        line = line.join(" ");
        // console.log("Line printed => ", line);
        if (lineNum >= 4)
          ctx.fillText(line, this.x - 50, this.y - 15 + lineNum * 15);
        else ctx.fillText(line, this.x - 70, this.y - 15 + lineNum * 15);
        line = [];
        lineNum++;
        space = 0;
      }
    });
  };
}

const background = new Background(backgroundImage);

const blackHole = new Sprite(blackHoleSpriteMap, 600, 50, -2, 1, true);

let spaceShip;
rocketShipImage.addEventListener("load", () => {
  spaceShip = new SingleSprite(
    rocketShipImage,
    1,
    -1000,
    100,
    2,
    0,
    Infinity,
    -Infinity,
    -Infinity,
    Infinity,
    1
  );
});

let left_astronaut;
leftAstronautImage.addEventListener("load", () => {
  left_astronaut = new SingleSprite(
    leftAstronautImage,
    1,
    0,
    300,
    0,
    (Math.floor(Math.random() * 4) + 1) * Math.floor(Math.random() * 2) == 1
      ? 1
      : -1,
    0,
    canvas.width,
    200,
    550
  );
});

let right_astronaut;
rightAstronautImage.addEventListener("load", () => {
  right_astronaut = new SingleSprite(
    rightAstronautImage,
    1,
    500,
    300,
    0,
    (Math.floor(Math.random() * 4) + 1) * Math.floor(Math.random() * 2) == 1
      ? 1
      : -1,
    0,
    canvas.width,
    200,
    550
  );
});

function Update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  if (frame % background.keyFrame === 0 && background.run) {
    background.animate();
    background.run = false;
    background.runOnFrame = frame;
  } else background.draw();

  if (spaceShip && frame % spaceShip.keyFrame === 0 && spaceShip.run) {
    spaceShip.animate();
    spaceShip.run = false;
    spaceShip.runOnFrame = frame;
  } else if (spaceShip) spaceShip.draw();

  if (
    frame % blackHole.keyFrame === 0 &&
    frame >= 1008 &&
    blackHole.run &&
    blackHoleSpriteMap[0].complete
  ) {
    // console.log("KeyFrame and run", blackHole.run);
    blackHole.animate();
    blackHole.run = false;
    // console.log("Ran animate => Run is => ", blackHole.run);
    blackHole.runOnFrame = frame;
  } else if (frame >= 1008) {
    blackHole.draw();
  }

  if (
    right_astronaut &&
    frame % right_astronaut.keyFrame === 0 &&
    frame <= 1049 &&
    right_astronaut.run
  ) {
    right_astronaut.animate();
    right_astronaut.run = false;
    right_astronaut.runOnFrame = frame;
  } else if (
    frame > 1049 &&
    frame % right_astronaut.keyFrame === 0 &&
    right_astronaut.run
  ) {
    right_astronaut.dy = -2;
    right_astronaut.spaghettify();
    right_astronaut.run = false;
    right_astronaut.runOnFrame = frame;
  } else if (right_astronaut && frame <= 1100) right_astronaut.draw();

  if (
    left_astronaut &&
    frame % left_astronaut.keyFrame === 0 &&
    frame < 1260 &&
    left_astronaut.run
  ) {
    left_astronaut.animate();
    left_astronaut.run = false;
    left_astronaut.runOnFrame = frame;
  } else if (
    frame >= 1260 &&
    frame % left_astronaut.keyFrame === 0 &&
    left_astronaut.run
  ) {
    left_astronaut.dy = 4;
    left_astronaut.spaghettify();
    left_astronaut.run = false;
    left_astronaut.runOnFrame = frame;
  } else if (left_astronaut && frame < 1380) left_astronaut.draw();

  if (frame >= 48 && frame < 169) {
    const text = new TextBubble(
      "Richard look! We are lost in space. Our cables snapped!",
      left_astronaut.x + 200,
      left_astronaut.y - 50
    );
    text.draw();
  }
  if (frame >= 240 && frame < 361) {
    const text = new TextBubble(
      "We're floating freely in space?!",
      right_astronaut.x + 10,
      right_astronaut.y - 40
    );
    text.draw();
  }
  if (frame > 500 && frame < 621) {
    const text = new TextBubble(
      "There's our ship! Is it coming to get us?",
      right_astronaut.x + 10,
      right_astronaut.y - 40
    );
    text.draw();
  }
  if (frame >= 625 && frame < 745) {
    const text = new TextBubble(
      "Considering we were the only people on it, I don't think so.",
      left_astronaut.x + 200,
      left_astronaut.y - 50
    );
    text.draw();
  }
  if (frame >= 757 && frame < 877) {
    const text = new TextBubble(
      "I really hope nothing bad happens to us while we're floating here...",
      left_astronaut.x + 200,
      left_astronaut.y - 50
    );
    text.draw();
  }
  if (frame >= 984 && frame < 1105) {
    const text = new TextBubble(
      "There's a black hole coming straight for us!",
      right_astronaut.x + 10,
      right_astronaut.y - 40
    );
    text.draw();
  }
  if (frame >= 1129 && frame < 1249) {
    const text = new TextBubble(
      "At least we're the first to experience black hole compression!",
      left_astronaut.x + 200,
      left_astronaut.y - 50
    );
    text.draw();
  }
  if (frame >= 1249 && frame < 1350) {
    const text = new TextBubble(
      "What a discovery!",
      left_astronaut.x + 200,
      left_astronaut.y - 50
    );
    text.draw();
  }

  if (frame >= frameEnd) {
    location.reload();
  }

  requestAnimationFrame(Update);
}
const interval = setInterval(() => {
  frame++;
}, 1000 / 24);
Update();

document.getElementById("stop").addEventListener("click", () => {
  clearInterval(interval);
  throw new Error("Stop the animation");
});
