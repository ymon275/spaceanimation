const canvas = document.getElementById("sandbox");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Example Sprite
// 54x31 at 0, 94
// 55x31 at 62, 94
// 54x31 at 125, 94
const boarSpriteMapImage = new Image();
boarSpriteMapImage.src = "./images/boar.png";
const boarSpriteCycle = [];
const tileLocation = [0, 62, 125];
boarSpriteMapImage.onload = () => {
  console.log(boarSpriteMapImage);
  for (let i = 0; i < 3; i++) {
    let boar = document.createElement("canvas");
    boar.width = i == 1 ? 55 : 54;
    boar.height = 31;
    boarctx = boar.getContext("2d");
    // ? context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
    boarctx.drawImage(
      boarSpriteMapImage,
      tileLocation[i],
      94,
      i == 1 ? 55 : 54,
      31,
      0,
      0,
      i == 1 ? 55 : 54,
      31
    );
    boarSpriteCycle.push(boar);
  }
};

const carWidth = 60;
const carHeight = 70;
const carImage = new Image(carWidth, carHeight);
carImage.src =
  "./images/436-4365173_race-car-sprite-png-free-race-car-sprites.png";

const ctx = canvas.getContext("2d");

function Sprite(spriteMap, x, y) {
  this.map = spriteMap;
  this.x = x;
  this.y = y;
  this.counter = 0;

  this.draw = () => {
    ctx.drawImage(this.active, this.x, this.y);
  };

  this.animate = () => {
    if (this.counter === this.map.length) this.counter = 0;
    this.active = this.map[this.counter];
    this.counter++;
    if (this.active) this.draw();
  };
}

function Car(x, y) {
  this.x = x;
  this.y = y;
  this.angle = 0;

  this.dx = Math.floor(Math.random() * 4) + 1;
  this.dx *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
  this.dy = Math.floor(Math.random() * 4) + 1;
  this.dy *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

  this.draw = () => {
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    ctx.drawImage(carImage, 0, 0, carWidth, carHeight);
    ctx.rotate(this.angle);
    ctx.translate(-this.x, -this.y);
  };

  this.animate = () => {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x + carHeight > canvas.width || this.x - carHeight < 0) {
      this.dx = -this.dx;
    }

    if (this.y + carHeight > canvas.height || this.y - carHeight < 0) {
      this.dy = -this.dy;
    }

    this.angle = Math.round(
      (Math.asin(
        this.dy >= 0
          ? this.dy
          : -this.dy / Math.sqrt(this.dx * this.dx + this.dy * this.dy)
      ) *
        180) /
        Math.PI
    );

    this.draw();
  };
}

function TextBubble(x, y) {
  this.x = x;
  this.y = y;
  this.rx = 70;
  this.ry = 50;

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
    ctx.arc(this.x + 60, this.y + 40, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(this.x + 68, this.y + 48, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();
  };
}

function Circle(x, y, r, c) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.c = c;

  this.dx = Math.floor(Math.random() * 4) + 1;
  this.dx *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
  this.dy = Math.floor(Math.random() * 4) + 1;
  this.dy *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

  this.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  };

  this.animate = function () {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x + this.r > canvas.width || this.x - this.r < 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.r > canvas.height || this.y - this.r < 0) {
      this.dy = -this.dy;
    }

    this.draw();
  };
}

const balls = [];
for (let i = 0; i < 20; i++) {
  let r = Math.floor(Math.random() * 30) + 15;
  let x = Math.random() * (canvas.width - r * 2) + r;
  let y = Math.random() * (canvas.height - r * 2) + r;
  let c = "red";
  balls.push(new Circle(x, y, r, c));
}

const cars = [];
for (let i = 0; i < 2; i++) {
  let x = Math.random() * (canvas.width - carHeight) + carHeight;
  let y = Math.random() * (canvas.height - carHeight) + carHeight;
  cars.push(new Car(x, y));
}

const text = new TextBubble(200, 200);

const boar = new Sprite(boarSpriteCycle, 500, 500);

/* BONUS FEATURE */
canvas.addEventListener("click", function (e) {
  let r = Math.floor(Math.random() * 30) + 15;
  balls.push(new Circle(e.clientX, e.clientY, r, "blue"));
});

function Update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];
    ball.animate();
  }

  for (let i = 0; i < cars.length; i++) {
    let car = cars[i];
    car.animate();
  }

  text.draw();

  boar.animate();

  requestAnimationFrame(Update);
}
Update();
