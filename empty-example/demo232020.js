//Demo232020.js a file created on 2/3/2020, a bullet hell game
let state = 1;
let updateCount = 0;
var button;
var buttonX;
var buttonY;

//Button size for buttonInteract()
let sizeX = 150;
let sizeY = 35;

//Hold var
var w = 784;
var h = 436;
var goFlag = false;
var load = true;
let volume;
var curVol = 100;
var time = 0;
var deltaTime = 0;

//Display Menu Objects
let scoot = 0; // Frame control
let update = 0; //Frame control
let scoot2 = 0; //Frame control
let update2 = 0; //Frame control
let canvas1;
let canvas2;
let bg;
let frame; // .png holders replace for loops
let board;
let easy;
let hard;
let options;
let canvas;
let bitFont;
var title = "The Witch's Theater";

//Tracks
var track1;
var track2;
var track3;
var track4;
var mainTrack = false;
var menuTrack = false;
var easyTrack = false;
var hardTrack = false;

//Sprite Stuff
var player;
var pAnim;
var enemy;
var eAnim;

//bullet stuff
let bullets;
var bSpeed = 5;
var setB = 10;
var bDown = 0;
var bulletSize = 5;
var bLife = 80;
var offset = 50;
var didFire = false;

//Player stats
var pSpeed = 5;
var pLives = 5;
var pCharge = 0;
var pChargeMax = 3;

//Enemy stats
var eHealth;
var eMaxHealth;
var coolDown = 0;
var setDown = 20;
var pattern;
var eSpeed = 3;
var eLife = 200;
var maxLeft = false;
var rot = 0;
var ebullets;
var routineEnd = true;
let routineRay = [];
var roundNum = 0;
var rDown = 500;
var waitLeft = false;
var waitRight = false;
var eMove = 2;
var eSec;

//Other things
var powerUps;
var x = 0;
var u;
var go = false;
var fadeGo = false;
var scene;
var end = false;
var pipDown = 5;
var turnabout = 0;

// ------------------------------------------------------[preload]
function preload() {
  //background
  bg = loadImage("assets/bg.png");
  frame = loadImage("assets/frame.png");
  board = loadImage("assets/board.png");
  easy = loadImage("assets/easyframe.png");
  hard = loadImage("assets/hardframe.png")
  //Font
  bitFont = loadFont('assets/uni0563-webfont.ttf');
  //Soundtrack
  track1 = loadSound('assets/Main.mp3');
  //track2 = loadSound('assets/Menu.mp3');
  track3 = loadSound('assets/Easy.mp3');
  track4 = loadSound('assets/Hard.mp3');
}

// ------------------------------------------------------[setup]
function setup() {
  // Button label buffers
  rum = createGraphics(300,300);
  tally = createGraphics(300,300);
  apple = createGraphics(300,300);
  gin = createGraphics(300,300);
  gravy = createGraphics(300,300);
  taffy = createGraphics(300,300);
  jelly = createGraphics(300, 300);

  //Initalize canvas
  createCanvas(800, 500);
  options = createGraphics(800, 500);
  //Sprites----------------------------------------
  //Group Colliders ----------------------------
  bGroup = new Group();
  powerUps = new Group();
  ebullets = new Group();
  //Enemy things -------------------------------
  enemy = createSprite(400, 100, 20, 20);
  eAnim = enemy.addAnimation('edle','assets/p/Lunam-1.png.png','assets/p/pio3.png');
  eSec = enemy.addAnimation('lunam')
  eAnim.playing = false;
  enemy.setCollider('rectangle', 0, 0, 25, 25);
  routineRay[0] = 0;
  routineRay[1] = 1;
  routineRay[2] = 2;
  routineRay[3] = 3;
  //enemy.debug = true;
  // player ------------------------------------
  player = createSprite(400, 300, 25, 25);
  pAnim = player.addAnimation('idle','assets/p/f0.png','assets/p/f4.png');
  player.addAnimation('moving','assets/p/l0.png','assets/p/l3.png');

  bullets = [];

  volume = createSlider(0, 100, curVol);
  volume.style('position', 'relative');
  volume.hide();

  canvas1 = createGraphics(300, 470);
  canvas2 = createGraphics(300, 470);
  strokeCap(SQUARE);

  rectMode(CENTER);
  textAlign(CENTER);

}

// ------------------------------------------------------[draw]
function draw() {

  rectMode(CENTER);
  //drawBgn(); // Begin frame draw
  image(bg, 0, 0);

  switch(state) {
    case 1: //Main menu
      if(!mainTrack)
      {
        soundPlay(1);
      }
      track1.setVolume(curVol/100);
      titleDraw();
      buttonInteract(width/2, height/2 + 25, "P   l   a   y", 2, 328, 240, 1, 0, 0);
      buttonInteract(width/2, height/2 + 75, "A   b   o   u   t", 6, 317, 290, 6, 15, 10);
      break;
    case 2: //Select Mode Screen / Settings etc.
      // if(!menuTrack)
      // {
      //   soundPlay(2);
      // }
      //track2.setVolume(curVol/100);
      if(!mainTrack)
      {
        soundPlay(1);
      }
      track1.setVolume(curVol/100);
      goFlag = false;
      load = true;
      volume.hide();
      canvasOne();
      canvasTwo();
      buttonInteract(width/4 - 33, 415, "S  e  l  e  c  t", 3, 90, 380, 2, 0, 0);
      buttonInteract(width/2 + 75, 415, "S  e  l  e  c  t", 4, 396, 380, 2, 0, 0);
      buttonInteract(711, 50, "S  e  t  t  i  n  g  s", 5, 618, 15, 3, 0, 0);
      //buttonInteract(711, 100, "C  r  e  d  i  t  s", 6, 624, 65);
      buttonInteract(711, 100, "B  a  c  k", 1, 643, 65, 4, 0, 0);
      if(fadeGo)
      {
        statusReset();
        fadeIn();
      }
      break;
    case 3: //Easy Mode
      if(!easyTrack)
      {
        soundPlay(3);
      }
      track3.setVolume(curVol/100);
      if(!goFlag)
      {
        easySetup();
      }
      if(load)
      {
        loadHealth(1);
      }
      if(go)
      {
        playerMovement();
        enemyPlayEasy();
        spawnPip();
        if(eHealth == 0 || pLives == 0)
        {
          go = false;
          end = true;
        }
      }
      else if((eHealth == 0 || pLives == 0) && end){
        track3.stop();
        player.velocity.x = 0;
        pAnim.playing = false;
        if(pLives == 0)
        {
          eAnim.changeFrame(2);
          player.velocity.y = 1;
        }
        else {
          eAnim.changeFrame(1);
          player.velocity.y = -3;
        }
      }
      drawSprites();
      drawBoard();
      if(player.position.y < 0 || player.position.y > 500)
      {
        fadeOut(2);
      }
      break;
    case 4: // Hard Mode ------------------------------------------------------------- EDIT HERE
      if(!hardTrack)
      {
        soundPlay(4);
      }
      track4.setVolume(curVol/100);
      if(!goFlag)
      {
        hardSetup();
      }
      if(load)
      {
        loadHealth(1);
      }
      if(go)
      {
        playerMovement();
        enemyPlayHard();
        spawnPip();
        if(eHealth == 0 || pLives == 0)
        {
          go = false;
          end = true;
        }
      }
      else if(eHealth == 0 || pLives == 0){
        track3.stop();
        player.velocity.x = 0;
        pAnim.playing = false;
        if(pLives == 0)
        {
          //eAnim.changeFrame(2);
          player.velocity.y = 1;
        }
        else {
          //eAnim.changeFrame(1);
          player.velocity.y = -3;
        }
      }
      drawSprites();
      drawBoard();
      if(player.position.y < 0 || player.position.y > 500)
      {
        fadeOut(2);
      }
      break;
    case 5: // Settings Screen ----------------------------------------------------- END EDIT
      doVolume();
      track1.setVolume(curVol/100);
      buttonInteract(701, 460, "B  a  c  k", 2, 633, 425, 5, 0, 0);
      break;
    case 6: // Credits page
      textSize(15);
      textFont('Georgia');
      text("Your name is Mia\n\nYou hail from a village that once worshiped a harvest spirit.\nAfter many generations of good harvests your village stopped \nworshipping the spirit that had granted them such bounties.\nEnraged by this, the spirit, Lunam, stole away the villagers,\nand locked them away within a tower spanning from the earth\nto the moon.\n\nYour childhood friend, a boy named Pio, attempted to scale\nthis tower, and defeat Lunam to free the village people...\n\nHe failed.\n\nNow, it is your turn.\nYou must free Pio, who has been made a secondary vessel to \nthe harvest spirit for his failure, and defeat Lunam, freeing\nthe villagers once and for all.", 575, 75);
        text("WASD or ARROW KEYS to move\n\nPress Space to shoot\n\nCollect green pips to power up\n\nLeft Shift to concentrate fire", 175, 75);
      buttonInteract(701, 460, "B  a  c  k", 1, 633, 425, 5, 0, 0);
      break;
    default:
      text("An error has occurred...");
      break;
  }

  //drawBorder(); // End frame draw
  image(frame, 0, 0);

}
// ------------------------------------------------------[statusReset]
function statusReset()
{
  player.position.x = 400;
  player.position.y = 300;
  player.velocity.y = 0;
  player.velocity.x = 0;
  enemy.velocity.x = 0;
  enemy.position.x = 400;
  eAnim.changeFrame(0);
  pLives = 5;
  eHealth = 0;
  pCharge = 0;
  go = false;
  end = false;
  routineEnd = true;
}
// ------------------------------------------------------[spawnPip]
function spawnPip() {
  if(pipDown == 0)
  {
    pipDown = 5;
    u = random(0, 100);
    if (u >= 99) {
      var pip = createSprite(random(16, w), 0, bulletSize + 5, bulletSize + 5);
      pip.shapeColor = color(100, 255, 100);
      pip.life = 300;
      pip.velocity.y = 2;
      powerUps.add(pip);
    }
  }
  else {
    pipDown--;
  }
}
// ------------------------------------------------------[fadeOut]
function fadeOut(cscene) {
  scene = cscene;
  fill(0, x);
  rectMode(CENTER);
  rect(400, 250, 800, 500);
  x += 5;
  if(x == 255) {
    fadeGo = true;
    state = scene;
  }
}

// ------------------------------------------------------[fadeOut]
function fadeIn() {
  fill(0, x);
  rectMode(CENTER);
  rect(400, 250, 800, 500);
  x -= 5;
}

// ------------------------------------------------------[soundPlay]
function soundPlay(track)
{
  switch(track)
  {
    case 1:
      track1.loop();
      // track2.stop();
      track3.stop();
      track4.stop();
      mainTrack = true;
      menuTrack = false;
      easyTrack = false;
      hardTrack = false;
      break;
    case 2:
      track1.stop();
      //track2.play();
      track3.stop();
      track4.stop();
      mainTrack = false;
      menuTrack = true;
      easyTrack = false;
      hardTrack = false;
      break;
    case 3:
      track1.stop();
      //track2.stop();
      track3.loop();
      track4.stop();
      mainTrack = false;
      menuTrack = false;
      easyTrack = true;
      hardTrack = false;
      break;
    case 4:
      track1.stop();
      //track2.stop();
      track3.stop();
      track4.loop();
      mainTrack = false;
      menuTrack = false;
      easyTrack = false;
      hardTrack = true;
      break;
    default:
      track1.stop();
      //track2.stop();
      track3.stop();
      track4.stop();
      mainTrack = false;
      menuTrack = false;
      easyTrack = false;
      hardTrack = false;
      break;

  }
}

// ------------------------------------------------------[drawBoard]
function drawBoard()
{
  fill(0);
  stroke(255);
  // rect(400, 480, 800, 40);
  // rect(400, 20, 800, 40);
  image(board, 0, 0);
  rect(400, 22, 700, 10);
  rect(400, 22, 350, 10);

  fill(255);
  rectMode(CORNER);
  rect(50, 17, 700 * (eHealth/eMaxHealth), 10);

  textFont(bitFont);
  textSize(25);
  text("HP:", 55, 485);
  for(let i = 0; i < pLives; i++) {
    text("I", 95 + (i * 10), 485);
  }
  text(":CHARGE", 705, 485);
  for(let i = 0; i < pChargeMax; i++) {
    if(i < pChargeMax - pCharge)
    {
      text(" ", 605 + (i * 10), 485);
    }
    else {
      text("I", 605 + (i * 10), 485);
    }
  }
}

// ------------------------------------------------------[doVolume]
function doVolume() {
  textFont(bitFont);
  textSize(25);
  text("Volume", 100, 100);
  volume.position(options.position.x, options.position.y);
  curVol = volume.value();
  textSize(10);
  text("" + curVol, 500, 252);
  image(options, 100, 100);
  volume.show();
}

// ------------------------------------------------------[hitEn]
function hitEn(enemy, bullet) {
  if(eHealth > 0)
    eHealth--;
    bullet.remove();
}

// ------------------------------------------------------[hitP]
function hitP(player, bullet) {
  if(pLives > 0)
    pLives--;
    bullet.remove();
}
// ------------------------------------------------------[chargeUp]
function chargeUp(pip, player)
{
  pCharge++;
  player.remove();
}

// ------------------------------------------------------[playerMovement]
function playerMovement() {
  player.immovable = true;
  player.overlap(powerUps, chargeUp);
  player.collide(ebullets, hitP);
  var offset = 40;
  //Reset movement when no keydown
  player.velocity.x = 0;
  player.velocity.y = 0;
  player.changeAnimation('idle');
  player.mirrorX(1);

  if ((keyIsDown(LEFT_ARROW) || keyIsDown(65)) && player.position.x > 16) {
    player.velocity.x = -pSpeed;
    player.changeAnimation('moving');
    player.mirrorX(1);
  }
  if ((keyIsDown(RIGHT_ARROW) || keyIsDown(68)) && player.position.x < w ) {
    player.velocity.x = pSpeed;
    player.changeAnimation('moving');
    player.mirrorX(-1);
  }
  if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && player.position.y > 64)
    player.velocity.y = -pSpeed;
  if ((keyIsDown(DOWN_ARROW) || keyIsDown(83)) && player.position.y < h)
    player.velocity.y = pSpeed;

    if(keyIsDown(16)) {
      offset = 5;
    }
    else {
      offset = 40;
    }

    if(bDown > 0) {
      bDown--;
    }
    if(bDown == 0 && didFire)
    {
      switch(pCharge)
      {
        case 0:
          bDown = setB + 10;
          break;
        case 1:
          bDown = setB + 5;
          break;
        case 2:
          bDown = setB + 2;
          break;
        case 3:
          bDown = setB;
        default:
          bDown = setB;
          break;
      }
      didFire = false;
    }

  if(keyIsDown(32))
  {
      if(bDown == 0) {
        didFire = true;
        doBullet();
      }
  }
}
// ------------------------------------------------------[doBullet]
function doBullet() {
    if(keyIsDown(16)) {
      offset = 10;
    }
    else {
      offset = 40;
    }

    switch(pCharge) {
      case 0:
          var bullet = createSprite(player.position.x, player.position.y - 10, bulletSize, bulletSize);
          bullet.setSpeed(bSpeed - 2, 270);
          bullet.life = bLife * 2;
          bullet.shapeColor = color(255, 0, 0);
          bullet.setCollider('rectangle', 0, 0, 20, 20);
          bGroup.add(bullet);
        break;
      case 1:
          var bullet = createSprite(player.position.x, player.position.y - 10, bulletSize, bulletSize);
          bullet.setSpeed(bSpeed, 270);
          bullet.life = bLife;
          bullet.shapeColor = color(255, 0, 0);
          bullet.setCollider('rectangle', 0, 0, 20, 20);
          bGroup.add(bullet);
        break;
      case 2:
        var bullet = createSprite(player.position.x - offset/2, player.position.y - 10, bulletSize, bulletSize);
        bullet.setSpeed(bSpeed, 270);
        bullet.life = bLife;
        bullet.shapeColor = color(255, 0, 0);
        bullet.setCollider('rectangle', 0, 0, 20, 20);
        bGroup.add(bullet);
        var bullet1 = createSprite(player.position.x + offset/2, player.position.y, bulletSize, bulletSize);
        bullet1.setSpeed(bSpeed, 270);
        bullet1.life = bLife;
        bullet1.shapeColor = color(255, 100, 0);
        bullet1.setCollider('rectangle', 0, 0, 20, 20);
        bGroup.add(bullet1);
        break;
      default:
        var bullet = createSprite(player.position.x, player.position.y - 10, bulletSize, bulletSize);
        bullet.setSpeed(bSpeed, 270);
        bullet.life = bLife;
        bullet.shapeColor = color(255, 0, 0);
        bullet.setCollider('rectangle', 0, 0, 20, 20);
        bGroup.add(bullet);
        var bullet1 = createSprite(player.position.x + offset, player.position.y, bulletSize, bulletSize);
        bullet1.setSpeed(bSpeed, 270);
        bullet1.life = bLife;
        bullet1.shapeColor = color(255, 100, 0);
        bullet1.setCollider('rectangle', 0, 0, 20, 20);
        bGroup.add(bullet1);
        var bullet2 = createSprite(player.position.x - offset, player.position.y, bulletSize, bulletSize);
        bullet2.setSpeed(bSpeed, 270);
        bullet2.life = bLife;
        bullet2.shapeColor = color(0, 0, 255);
        bullet2.setCollider('rectangle', 0, 0, 20, 20);
        bGroup.add(bullet2);
        break;
    }

    // bullet.debug = true;
    // bullet2.debug = true;
    // bullet1.debug = true;
}
// ------------------------------------------------------[loadHealth]
function loadHealth(add) {
  if(eHealth != eMaxHealth) {
    eHealth += add;
  }
  else {
    load = false;
    go = true;
  }
}

// ------------------------------------------------------[easySetup]
function easySetup() {
  eAnim.changeFrame(1);
  eMaxHealth = 100;
  eHealth = 0;
  goFlag = true;
  player.shapeColor = color(0, 255, 50);
  enemy.shapeColor = color(0, 100, 40);
  //coolDown = 500;
}

// ------------------------------------------------------[hardSetup]
function hardSetup() {
  eAnim.changeFrame(0);
  eMaxHealth = 500;
  eHealth = 0;
  goFlag = true;
  player.shapeColor = color(255, 0, 50);
  enemy.shapeColor = color(100, 0, 40);
}

// ------------------------------------------------------[enemyPlayEasy]
function enemyPlayEasy() {
  enemy.collide(bGroup, hitEn);
  enemy.immovable = true;

  if(routineEnd) {
    pattern = random(0, 4);
    //get Whole Numbers
    if(pattern < 1) {
      pattern = 0;
    }
    else if(pattern < 2) {
      pattern = 1;
    }
    else if(pattern < 3) {
      pattern = 2;
    }
    else if(pattern < 4) {
      pattern = 3;
    }
    routineEnd = false;
    roundNum = 0;
    turnabout = 0;
  }

  if(rDown == 0) {
    rDown = 100;
    if(enemy.position.x >= 700)
    {
      eMove = -eMove;
      eAnim.changeFrame(5);
    }
    else if(enemy.position.x <= 100){
      eMove = -eMove;
      eAnim.changeFrame(4);
    }
    enemy.velocity.x = eMove;

  }
  else {
    rDown--;
  }

  if(coolDown == 0)
  {
    coolDown = setDown;
    switch(pattern)
    {
      case 0:
        if(roundNum < 10) {
            var shot = createSprite(enemy.position.x, enemy.position.y + 10, 5, 5);
            shot.velocity.x = eSpeed;
            shot.setSpeed(shot.velocity.x, 80);
            shot.shapeColor = color(255);
            ebullets.add(shot);
            var shot2 = createSprite(enemy.position.x, enemy.position.y + 10, 5, 5);
            shot2.velocity.x = eSpeed;
            shot2.setSpeed(shot2.velocity.x, 100);
            shot2.shapeColor = color(255);
            ebullets.add(shot2);
          roundNum++;
        }
        else {
          routineEnd = true;
        }
        break;
      case 1:
        if(roundNum < 4) {
          for(var i = 0; i < 6; i++) {
            var shot = createSprite(enemy.position.x, enemy.position.y + 10, 5, 5);
            shot.velocity.x = eSpeed;
            shot.setSpeed(shot.velocity.x, 0 + ((360/6) *i) + rot);
            shot.friction = 0;
            shot.life = eLife;
            shot.shapeColor = color(255);
            ebullets.add(shot);
          }
          rot+= 10;
          if(rot >= (360/6))
          {
            rot = 0;
          }
          roundNum++;
        }
        else {
          routineEnd = true;
        }
        break;
      case 2:
        if(roundNum < 2) {
          for(var i = 0; i < 6; i++) {
            var shot = createSprite(enemy.position.x, enemy.position.y + 10, 5, 5);
            shot.velocity.x = eSpeed;
            shot.setSpeed(shot.velocity.x, 0 + ((360/6) *i) + rot);
            shot.friction = 0;
            shot.life = eLife;
            shot.shapeColor = color(255);
            ebullets.add(shot);
          }
          rot+= 10;
          if(rot >= (360/6))
          {
            rot = 0;
          }
          roundNum++;
        }
        else {
          routineEnd = true;
        }
        break;
      case 3:
        if(roundNum < 5) {
          while(turnabout < 2) {
            for(var i = 0; i < 6; i++) {
              var shot = createSprite(enemy.position.x, enemy.position.y + 10, 5, 5);
              shot.velocity.x = eSpeed;
              shot.setSpeed(shot.velocity.x, 0 + ((360/6) *i) + rot);
              shot.friction = 0;
              shot.life = eLife;
              shot.shapeColor = color(255);
              ebullets.add(shot);
            }
            rot+= 10;
            if(rot >= (360/6))
            {
              rot = 0;
            }
            turnabout++;
          }
          turnabout = 0;
          roundNum++;
        }
        else {
          routineEnd = true;
        }
        break;
      default:
        if(roundNum < 6) {
          for(var i = 0; i < 6; i++) {
            var shot = createSprite(enemy.position.x, enemy.position.y + 10, 5, 5);
            shot.velocity.x = eSpeed;
            shot.setSpeed(shot.velocity.x, 0 + ((360/6) *i) + rot);
            shot.friction = 0;
            shot.life = eLife;
            shot.shapeColor = color(255);
            ebullets.add(shot);
          }
          rot+= 10;
          if(rot >= (360/6))
          {
            rot = 0;
          }
          roundNum++;
        }
        else {
          routineEnd = true;
        }
        break;
    }
  }
  else
  {
    coolDown--;
  }
}

// ------------------------------------------------------[enemyPlayHard]
function enemyPlayHard() {
  enemy.collide(bGroup, hitEn);
  enemy.immovable = true;

  if(routineEnd) {
    pattern = random(0, 4);
    //get Whole Numbers
    if(pattern < 1) {
      pattern = 0;
    }
    else if(pattern < 2) {
      pattern = 1;
    }
    else if(pattern < 3) {
      pattern = 2;
    }
    else if(pattern < 4) {
      pattern = 3;
    }
    routineEnd = false;
    roundNum = 0;
    turnabout = 0;
  }

  if(coolDown == 0)
  {
    coolDown = setDown;
    switch(pattern)
    {
      case 0:
        if(roundNum < 20) {
            for(var i = 0; i < 2; i++)
            {
              var shot = createSprite(0, random(0, h), 5, 5);
              shot.velocity.x = eSpeed;
              shot.setSpeed(shot.velocity.x, 0);
              shot.friction = 0;
              shot.life = eLife + 4;
              shot.shapeColor = color(255);
              ebullets.add(shot);
              shot = createSprite(w, random(0, h), 5, 5);
              shot.velocity.x = eSpeed;
              shot.setSpeed(-shot.velocity.x, 0);
              shot.friction = 0;
              shot.life = eLife + 4;
              shot.shapeColor = color(255);
              ebullets.add(shot);
            }
          roundNum++;
        }
        else {
          routineEnd = true;
        }
        break;
      case 1:
        if(roundNum < 12) {
          for(var i = 0; i < 24; i++) {
            var shot = createSprite(enemy.position.x, enemy.position.y + 10, 5, 5);
            shot.velocity.x = eSpeed - 5;
            shot.setSpeed(shot.velocity.x, 0 + ((360/12) *i) + rot);
            shot.friction = 0;
            shot.life = eLife + 10;
            shot.shapeColor = color(255);
            ebullets.add(shot);
          }
          rot+= 12;
          if(rot >= (360/2))
          {
            rot = 0;
          }
          roundNum++;
        }
        else {
          routineEnd = true;
        }
        break;
      case 2:
      if(roundNum < 12) {
        for(var i = 0; i < 24; i++) {
          var shot = createSprite(enemy.position.x, enemy.position.y + 10, 5, 5);
          shot.velocity.x = eSpeed - 5;
          shot.setSpeed(-shot.velocity.x, 0 - ((360/12) *i) - rot);
          shot.friction = 0;
          shot.life = eLife + 10;
          shot.shapeColor = color(255);
          ebullets.add(shot);
        }
        rot+= 12;
        if(rot >= (360/2))
        {
          rot = 0;
        }
        roundNum++;
      }
        else {
          routineEnd = true;
        }
        break;
      case 3:
        if(roundNum < 5) {
          while(turnabout < 3) {
            for(var i = 0; i < 6; i++) {
              var shot = createSprite(enemy.position.x, enemy.position.y + 10, 5, 5);
              shot.velocity.x = eSpeed;
              shot.setSpeed(shot.velocity.x, 0 + ((360/6) *i) + rot);
              shot.friction = 0;
              shot.life = eLife;
              shot.shapeColor = color(255);
              ebullets.add(shot);
            }
            rot+= 10;
            if(rot >= (360/6))
            {
              rot = 0;
            }
            turnabout++;
          }
          turnabout = 0;
          roundNum++;
        }
        else {
          routineEnd = true;
        }
        break;
      default:
        if(roundNum < 6) {
          for(var i = 0; i < 6; i++) {
            var shot = createSprite(enemy.position.x, enemy.position.y + 10, 5, 5);
            shot.velocity.x = eSpeed;
            shot.setSpeed(shot.velocity.x, 0 + ((360/6) *i) + rot);
            shot.friction = 0;
            shot.life = eLife;
            shot.shapeColor = color(255);
            ebullets.add(shot);
          }
          rot+= 10;
          if(rot >= (360/6))
          {
            rot = 0;
          }
          roundNum++;
        }
        else {
          routineEnd = true;
        }
        break;
    }
  }
  else
  {
    coolDown--;
  }
}

// ------------------------------------------------------[buttonInteract]
function buttonInteract(x, y, label, set, imgx, imgy, sightScope, altx, alty) {
  //Button draw
  if((mouseX >= x - sizeX/2 && mouseX <= x + sizeX/2) && (mouseY >= y - sizeY/2 && mouseY <= y + sizeY/2))
  {
    fill(40);
    if(mouseIsPressed) {
      state = set;
    }
  }
  else {
    fill(0);
  }
  stroke(255);
  rect(x, y, sizeX - altx, sizeY - alty);
  if(altx == 0 && alty == 0)
  {
    line(x-sizeX/2 + 2, y-sizeY/2 + 2, x+sizeX/2 - 2, y-sizeY/2 + 2);
    line(x-sizeX/2 + 2, y+sizeY/2 - 2, x+sizeX/2 - 2, y+sizeY/2 - 2);
    line(x-sizeX/2 + 2, y-sizeY/2 + 2, x-sizeX/2 + 2, y+sizeY/2 - 2);
    line(x+sizeX/2 - 2, y-sizeY/2 + 2, x+sizeX/2 - 2, y+sizeY/2 - 2);
  }

  //Label creation
  fill(255);
  stroke(0, 0);


  switch(sightScope) {
    case 1:
    rum.fill(255);
    rum.textFont('Georgia');
    rum.textSize(15);
    rum.text(label, 40, 40);
    image(rum, imgx, imgy);
    break;
    case 2:
    tally.fill(255);
    tally.textFont('Georgia');
    tally.textSize(15);
    tally.text(label, 40, 40);
    image(tally, imgx, imgy);
    break;
    case 3:
    apple.fill(255);
    apple.textFont('Georgia');
    apple.textSize(15);
    apple.text(label, 40, 40);
    image(apple, imgx, imgy);
    break;
    case 4:
    gin.fill(255);
    gin.textFont('Georgia');
    gin.textSize(15);
    gin.text(label, 40, 40);
    image(gin, imgx, imgy);
    break;
    case 5:
    gravy.fill(255);
    gravy.textFont('Georgia');
    gravy.textSize(15);
    gravy.text(label, 40, 40);
    image(gravy, imgx, imgy);
    break;
    case 6:
    taffy.fill(255);
    taffy.textFont('Georgia');
    taffy.textSize(15);
    taffy.text(label, 40, 40);
    image(taffy, imgx, imgy);
    case 7:
    jelly.fill(255);
    jelly.textFont('Georgia');
    jelly.textSize(15);
    jelly.text(label, 40, 40);
    image(jelly, imgx, imgy);
    break;
  }

  //if(dist(mouseX, mouseY, x, y) <= 10);
}

// ------------------------------------------------------[Canvas One]
function canvasOne() {
  canvas1.background(0);
  canvas1.image(easy, 0, 0);

  canvas1.strokeWeight(0);
  canvas1.fill(255, 255, 255, 120);
  canvas1.textSize(35);
  canvas1.textFont(bitFont);
  for (let i = 0; i < 6; i++) {
      canvas1.text("EASY", ((i - 1) * 125) + scoot, 30);
      canvas1.text("EASY", (i * 125) - scoot, 460);
      if(update === 5) {
        update = 0;
        if(scoot != 125) {
          scoot++;
        }
        else {
          scoot = 0;
        }
      }
      else {
        update++;
      }
  }
  //Border
  canvas1.strokeWeight(2);
  canvas1.stroke(255);
  //canvas1.line(150, 0, 150, 470);
  canvas1.line(0, 0, 300, 0);
  canvas1.line(0, 0, 0, 470);
  canvas1.line(300, 0, 300, 470);
  canvas1.line(0, 470, 300, 470);
  image(canvas1, 18, 15);
}

// ------------------------------------------------------[Canvas Two]
function canvasTwo() {
  canvas2.background(0);
  canvas2.image(hard, 0, 0);

  canvas2.strokeWeight(0);
  canvas2.fill(255, 255, 255, 120);
  canvas2.textSize(35);
  canvas2.textFont(bitFont);
  for (let i = 0; i < 4; i++) {
    canvas2.text("HARD", ((i - 1) * 135) + scoot2, 30);
    canvas2.text("HARD", (i * 135) - scoot2, 460);
      if(update2 === 3) {
        update2 = 0;
        if(scoot2 != 135) {
          scoot2++;
        }
        else {
          scoot2 = 0;
        }
      }
      else {
        update2++;
      }
  }
  //Border
  canvas2.strokeWeight(2);
  canvas2.stroke(255);
  //canvas2.line(150, 0, 150, 470);
  canvas2.line(0, 0, 300, 0);
  canvas2.line(0, 0, 0, 470);
  canvas2.line(300, 0, 300, 470);
  canvas2.line(0, 470, 300, 470);
  image(canvas2, 328, 15);
}

// ------------------------------------------------------[titleDraw]
function titleDraw() {
  fill(255);
  stroke(0, 0);
  textFont("Fredericka the Great");
  for(let i = 0; i < 19; i++) {
    //let size = random(35,40);
    if(updateCount === 30) {
      textSize(random(25,28));
      updateCount = 0;
    }
    else {
      updateCount++;
    }
    text(title.charAt(i), 137 + (i * 30) + random(1), 230+(random(1)));
  }
}

// ------------------------------------------------------[drawBgn]
function drawBgn() {
  background(0, 0, 0);
  //draw grid
  stroke(100, 100, 100, 120);
  strokeWeight(1);
  for(let i = 0; i < 800; i = i + 15) {
    line(i, 0, i, 500);
    line(0, i, 800, i);
  }
}

// ------------------------------------------------------[drawBorder]
function drawBorder() {
  stroke(255);
  strokeWeight(3);
  //borders
  line(3, 3, 3, 497);
  line(3, 3, 797, 3);
  line(797, 3, 797, 497);
  line(3, 497, 797, 497);
  //accents
  line(3, 13, 13, 3);
  line(13, 497, 3, 487);
  line(787, 3, 797, 13);
  line(787, 497, 797, 487);
  //accent dots
  point(11, 11);
  point(789, 489);
  point(11, 489);
  point(789, 11);
  //outer border draw
  stroke(0);
  strokeWeight(2);
  line(1, 1, 1, 499);
  line(1, 1, 799, 1);
  line(799, 1, 799, 499);
  line(799, 1, 799, 499);
  line(1, 499, 799, 499);
  //Extra accent black separator draw
  stroke(80);
  strokeWeight(1);
  line(0, 0, 0, 500);
  line(0, 0, 800, 0);
  line(800, 0, 800, 500);
  line(0, 500, 800, 500);
}
