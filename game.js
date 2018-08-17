var game;
var gameOptions = {
    tileSize: 288,
    tileSpacing: 20,
    boardSize: { rows: 9, cols: 9 },
    tweenSpeed: 50,
    aspectRatio: 16/9
};

class bootGame extends Phaser.Scene{
  constructor(){
    super("BootGame");
  }
  preload(){
    this.load.image("emptytile", "assets/sprites/emptytile.png");
    this.load.image("1", "assets/sprites/1.png");
    this.load.image("2", "assets/sprites/2.png");
    this.load.image("3", "assets/sprites/3.png");
    this.load.image("4", "assets/sprites/4.png");
    this.load.image("5", "assets/sprites/5.png");
    this.load.image("6", "assets/sprites/6.png");
    this.load.image("7", "assets/sprites/7.png");
    this.load.image("8", "assets/sprites/8.png");
    this.load.image("9", "assets/sprites/9.png");
  }
  create(){
    this.scene.start("PlayGame");
  }
}
class playGame extends Phaser.Scene{
  constructor(){
    super("PlayGame");
  }
  create(){
    this.addTilesToScreen();
    var pos = this.getTilePosition(1,0);
    var num = this.add.image(pos.x, pos.y, "1").setInteractive();
    this.input.setDraggable(num);
    this.input.on('dragstart', function (pointer, gameObject) {
        gameObject.setTint(0xff0000);
    });
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });
    this.input.on('dragend', function (pointer, gameObject) {
        gameObject.clearTint();
    });
  }
  /*
    Get the tile position dependant on the row and column specified
  */
  getTilePosition(row, col){
    var posX = gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize * (col + 0.5);
    var posY = gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize * (row + 0.5);
    var boardHeight = gameOptions.boardSize.rows * gameOptions.tileSize;
    boardHeight += (gameOptions.boardSize.rows + 1) * gameOptions.tileSpacing;
    var offsetY = (game.config.height - boardHeight) / 2;
    posY += offsetY;
    return new Phaser.Geom.Point(posX, posY);
  }
  addTilesToScreen(){
    this.tileArray = [];
    for(var i = 0; i < gameOptions.boardSize.rows; i++){
      this.tileArray[i] = [];
      for(var j = 0; j < gameOptions.boardSize.cols; j++){
        var tilePosition = this.getTilePosition(i,j);
        this.add.image(tilePosition.x, tilePosition.y, "emptytile");
      }
    }
  }
}

window.onload = function() {
  var tileAndSpacing = gameOptions.tileSize + gameOptions.tileSpacing;
  var width = gameOptions.boardSize.cols * tileAndSpacing;
  width += gameOptions.tileSpacing;
  var gameConfig = {
    width: width,
    height: width * gameOptions.aspectRatio,
    backgroundColor: 0xecf0f1,
    scene: [bootGame, playGame]
  };
  game = new Phaser.Game(gameConfig);
  window.focus();
  resizeGame();
  window.addEventListener("resize", resizeGame);
}


/*
  Resize screen on game load and on user action
*/
function resizeGame() {
  var canvas = document.querySelector("canvas");
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = game.config.width / game.config.height;
  if(windowRatio < gameRatio){
    canvas.style.width = windowWidth + "px";
    canvas.style.height = (windowWidth / gameRatio) + "px";
  }
  else {
    canvas.style.width = (windowHeight * gameRatio) + "px";
    canvas.style.height = windowHeight + "px";
  }
}


// var gameOptions = {
//     tileSize: 200,
//     tileSpacing: 20,
//     boardSize: {
//       rows: 2,
//       cols: 2
//     },
//     tweenSpeed: 50, /* the speed of the tweening animation */
//     aspectRatio: 16/9 /* the ratio of the width to the height of the game screen */
// }
// var game;
// var tileAndSpacing = gameOptions.tileSize + gameOptions.tileSpacing;
// var width = gameOptions.boardSize.cols * tileAndSpacing;
// width += gameOptions.tileSpacing;
//
// window.onload = function() {
//   game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });
//   console.log(width);
//   console.log(game.height);
//
//   window.focus();
//   resizeGame();
//   //window.addEventListener("resize", resizeGame);
// }
//
// function preload() {
//
//   this.load.image("emptytile", "assets/sprites/emptytile.png");
//   this.load.image("1", "assets/sprites/1.png");
//   this.load.image("2", "assets/sprites/2.png");
//   this.load.image("3", "assets/sprites/3.png");
//   this.load.image("4", "assets/sprites/4.png");
//   this.load.image("5", "assets/sprites/5.png");
//   this.load.image("6", "assets/sprites/6.png");
//   this.load.image("7", "assets/sprites/7.png");
//   this.load.image("8", "assets/sprites/8.png");
//   this.load.image("9", "assets/sprites/9.png");
//   console.log("preload");
// }
//
// function create() {
//
//   game.add.sprite(500,100,"1");
//   console.log("create");
// }
//
// function update() {
// }
//
// function resizeGame() {
//   var canvas = document.querySelector("canvas");
//   var windowWidth = window.innerWidth;
//   var windowHeight = window.innerHeight;
//   var windowRatio = windowWidth / windowHeight;
//   var gameRatio = game.config.width / game.config.height;
//   if(windowRatio < gameRatio){
//     canvas.style.width = windowWidth + "px";
//     canvas.style.height = (windowWidth / gameRatio) + "px";
//   }
//   else {
//     canvas.style.width = (windowHeight * gameRatio) + "px";
//     canvas.style.height = windowHeight + "px";
//   }
// }
