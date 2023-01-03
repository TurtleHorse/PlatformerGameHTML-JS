//Character sprite Sheets
let spriteRunLeft = new Image();
spriteRunLeft = createImage("./Assets/spriteRunLeft.png");
let spriteRunRight = new Image();
spriteRunRight = createImage("./Assets/spriteRunRight.png");
let spriteStandLeft = new Image();
spriteStandLeft = createImage("./Assets/spriteStandleft.png");
let spriteStandRight = new Image();
spriteStandRight = createImage("./Assets/spriteStandRight.png");

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

class Player {
  constructor() {
    this.speed = 10;
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 66;
    this.height = 150;

    this.image = spriteStandRight;
    this.frames = 0;
    this.sprites = {
      stand: {
        right: spriteStandRight,
        left: spriteStandLeft,
        cropwidth: 177,
        width: 66,
      },
      run: {
        right: spriteRunRight,
        left: spriteRunLeft,
        cropwidth: 341,
        width: 127.875,
      },
    };
    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;
  }

  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frames++;
    if (
      this.frames > 59 &&
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.stand.left)
    )
      this.frames = 0;
    else if (
      this.frames > 29 &&
      (this.currentSprite === this.sprites.run.right ||
        this.currentSprite === this.sprites.run.left)
    )
      this.frames = 0;
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x, //same as x: x,
      y, //     y: y
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x, //same as x: x,
      y, //     y: y
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}
//Images
const image = new Image();
let platformImg = createImage("./Assets/platform.png");
const hills = new Image();
const background = new Image();
const smallTall = new Image();
let smallTallImg = createImage("./Assets/platformSmallTall.png");

let player = new Player();
let platforms = [];
let genericObjects = [];

let lastKey;
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let scrollOffset = 0;

function Init() {
  player = new Player();
  platforms = [
    new Platform({
      //prettier-ignore
      x: platformImg.width * 5 + 220 + platformImg.width - smallTallImg.width,
      y: 270,
      image: smallTallImg,
    }),
    new Platform({
      x: -1,
      y: 470,
      image: platformImg,
    }),
    new Platform({
      x: platformImg.width - 2,
      y: 470,
      image: platformImg,
    }),
    new Platform({
      x: platformImg.width * 2 + 100,
      y: 470,
      image: platformImg,
    }),
    new Platform({
      x: platformImg.width * 3 + 300,
      y: 470,
      image: platformImg,
    }),
    new Platform({
      x: platformImg.width * 4 + 800,
      y: 470,
      image: platformImg,
    }),
    new Platform({
      x: platformImg.width * 7 + 300 - 2,
      y: 470,
      image: platformImg,
    }),
  ];
  genericObjects = [
    new GenericObject({
      x: 0,
      y: 0,
      image: createImage("./Assets/background.png"),
    }),
    new GenericObject({
      x: 0,
      y: 0,
      image: createImage("./Assets/hills.png"),
    }),
  ];
} //Init end

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });
  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;

      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });
    }
  }
  console.log(scrollOffset);

  //Platform collision detection

  platforms.forEach((platform) => {
    platform.draw();
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  //Sprites switching
  if (
    keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropwidth;
    player.width = player.sprites.run.width;
  } else if (
    keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropwidth;
    player.width = player.sprites.run.width;
  }else if (
    !keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.stand.left
  ) {
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropwidth;
    player.width = player.sprites.stand.width;
  }
  else if (
    !keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.stand.right
  ) {
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.cropwidth;
    player.width = player.sprites.stand.width;
  }

  //Win condition
  if (scrollOffset > platformImg.width * 7 + 10 - 2) {
    console.log('you win');
  }

  //Lose condition
  if (player.position.y > canvas.height) {
    Init();
  }
}

Init();
animate();

window.addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      console.log("left");
      keys.left.pressed = true;
      lastKey = "left";
      break;
    case 83:
      console.log("down");
      break;
    case 68:
      console.log("right");
      keys.right.pressed = true;
      lastKey = "right";
      break;
    case 87:
      console.log("up");
      player.velocity.y -= 15;
      break;
  }
});

window.addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      console.log("left");
      keys.left.pressed = false;

      break;
    case 83:
      console.log("down");
      break;
    case 68:
      console.log("right");
      keys.right.pressed = false;

      break;
    case 87:
      console.log("up");
      break;
  }
});
