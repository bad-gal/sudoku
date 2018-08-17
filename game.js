let game;
const gameOptions = {
    tileSize: 288,
    tileSpacing: 20,
    boardSize: {rows: 9, cols: 9},
    tweenSpeed: 50,
    aspectRatio: 16 / 9
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
    this.load.image("line", "assets/sprites/line.png");
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
    this.addLinesToScreen();
  }
  /*
    Get the tile position dependant on the row and column specified
  */
  static getTilePosition(row, col){
    var posX = gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize * (col + 0.5);
    var posY = gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize * (row + 0.5);
    var boardHeight = gameOptions.boardSize.rows * gameOptions.tileSize;
    boardHeight += (gameOptions.boardSize.rows + 1) * gameOptions.tileSpacing;
    posY += (game.config.height - boardHeight) / 2;
    return new Phaser.Geom.Point(posX, posY);
  }
  addLinesToScreen(){
    //vertical lines
    var pos = playGame.getTilePosition(4,0);
    this.add.image(pos.x - gameOptions.tileSize + (gameOptions.tileSize / 2) , pos.y, "line").setScale(1, 9.6);
    pos = playGame.getTilePosition(4,2);
    this.add.image(pos.x + (gameOptions.tileSize / 2) + (gameOptions.tileSpacing / 2), pos.y, "line").setScale(1, 9.6);
    pos = playGame.getTilePosition(4,5);
    this.add.image(pos.x + (gameOptions.tileSize / 2) + (gameOptions.tileSpacing / 2), pos.y, "line").setScale(1, 9.6);
    pos = playGame.getTilePosition(4,8);
    this.add.image(pos.x + (gameOptions.tileSize / 2), pos.y, "line").setScale(1, 9.6);

    //horizontal lines
    pos = playGame.getTilePosition(0,4);
    this.add.image(pos.x, pos.y - gameOptions.tileSize - gameOptions.tileSpacing + (gameOptions.tileSize / 2) + (gameOptions.tileSpacing / 2), "line").setScale(1, 9.6).setAngle(90);
    pos = playGame.getTilePosition(2,4);
    this.add.image(pos.x, pos.y + (gameOptions.tileSize / 2) + (gameOptions.tileSpacing / 2), "line").setScale(1, 9.6).setAngle(90);
    pos = playGame.getTilePosition(5,4);
    this.add.image(pos.x, pos.y + (gameOptions.tileSize / 2) + (gameOptions.tileSpacing / 2), "line").setScale(1, 9.6).setAngle(90);
    pos = playGame.getTilePosition(8,4);
    this.add.image(pos.x, pos.y + (gameOptions.tileSize / 2) + (gameOptions.tileSpacing / 2), "line").setScale(1, 9.6).setAngle(90);
  }
  addTilesToScreen(){
    var sudokuMap = this.createSolution();
    var visibleMap = this.initVisibleElements();
    this.tileArray = [];
    for(var i = 0; i < gameOptions.boardSize.rows; i++){
      this.tileArray[i] = [];
      for(var j = 0; j < gameOptions.boardSize.cols; j++){
        var tilePosition = playGame.getTilePosition(i,j);
        this.add.image(tilePosition.x, tilePosition.y, "emptytile");
        if(visibleMap[i][j] === true) {
            this.add.image(tilePosition.x, tilePosition.y, sudokuMap[i][j].toString());
        }
      }
    }
    this.showMoveableNumbers();
  }
  createSolution(){
      var map = new Array(9);
      map[0] = [3, 5, 9, 6, 1, 8, 4, 2, 7];
      map[1] = [7, 4, 2, 5, 3, 9, 8, 6, 1];
      map[2] = [1, 6, 8, 4, 7, 2, 9, 5, 3];
      map[3] = [4, 2, 3, 8, 9, 5, 7, 1, 6];
      map[4] = [5, 8, 7, 1, 6, 4, 3, 9, 2];
      map[5] = [6, 9, 1, 7, 2, 3, 5, 8, 4];
      map[6] = [2, 7, 5, 9, 4, 6, 1, 3, 8];
      map[7] = [8, 3, 4, 2, 5, 1, 6, 7, 9];
      map[8] = [9, 1, 6, 3, 8, 7, 2, 4, 5];
      return map;
  }
  initVisibleElements(){
      var map = new Array(9);
      map[0] = [false, false, true, false, false, true, false, true, true];
      map[1] = [true, false, true, false, true, true, false, true, false];
      map[2] = [false, false, true, false, true, true, false, true, false];
      map[3] = [false, true, true, false, false, true, true, true, false];
      map[4] = [true, false, false, true, true, false, true, false, true];
      map[5] = [true, false, true, false, false, true, false, false, true];
      map[6] = [false, false, true, false, false, true, false, true, false];
      map[7] = [true, true, false, false, true, false, false, true, true];
      map[8] = [false, true, false, false, false, true, false, true, false];
      return map;
  }
  showMoveableNumbers(){
      var pos = playGame.getTilePosition(8,8);
      var freeSpace = game.config.height - (pos.y + (gameOptions.tileSize / 2) + gameOptions.tileSpacing);
      var posY = pos.y + (freeSpace / 2);
      for(var i = 0; i < gameOptions.boardSize.cols; i++){
          pos = playGame.getTilePosition(0, i);
          this.add.image(pos.x, posY, "emptytile");
      }

      this.items = this.add.group([
          {
            key: "1",
            setXY: {
                x: playGame.getTilePosition(0, 0).x,
                y: posY
            }
          },
          {
            key: "2",
            setXY: {
                x: playGame.getTilePosition(0, 1).x,
                y: posY
            }
          },
          {
              key: "3",
              setXY: {
                  x: playGame.getTilePosition(0, 2).x,
                  y: posY
              }
          },
          {
              key: "4",
              setXY: {
                  x: playGame.getTilePosition(0, 3).x,
                  y: posY
              }
          },
          {
              key: "5",
              setXY: {
                  x: playGame.getTilePosition(0, 4).x,
                  y: posY
              }
          },
          {
              key: "6",
              setXY: {
                  x: playGame.getTilePosition(0, 5).x,
                  y: posY
              }
          },
          {
              key: "7",
              setXY: {
                  x: playGame.getTilePosition(0, 6).x,
                  y: posY
              }
          },
          {
              key: "8",
              setXY: {
                  x: playGame.getTilePosition(0, 7).x,
                  y: posY
              }
          },
          {
              key: "9",
              setXY: {
                  x: playGame.getTilePosition(0, 8).x,
                  y: posY
              }
          }
      ]);

      this.items.setDepth(1);
      Phaser.Actions.Call(this.items.getChildren(), function(item){
          item.setInteractive();
          this.input.setDraggable(item);
          item.on('dragstart', function (pointer) {
              item.setTint(0xff0000);
          });
          item.on('drag', function (pointer, dragX, dragY) {
              item.x = dragX;
              item.y = dragY;
          });
          item.on('dragend', function (pointer) {
              item.clearTint();
              console.log("You dragged " + item.texture.key);
          });

      }, this);
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
