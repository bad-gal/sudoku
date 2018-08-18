let game;
const gameOptions = {
    tileSize: 288,
    tileSpacing: 20,
    boardSize: {rows: 9, cols: 9},
    tweenSpeed: 50,
    aspectRatio: 16 / 9
};
let map = new Array(gameOptions.boardSize.rows);
let visibleMap = new Array(gameOptions.boardSize.rows);
var tileArray = [];

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
      playGame.createSolution();
      playGame.initVisibleElements();

      for(var i = 0; i < gameOptions.boardSize.rows; i++){
          tileArray[i] = [];
          for(var j = 0; j < gameOptions.boardSize.cols; j++){
              var tilePosition = playGame.getTilePosition(i,j);
              this.add.image(tilePosition.x, tilePosition.y, "emptytile");
              var tile = this.add.image(tilePosition.x, tilePosition.y, map[i][j].toString());
              tile.visible = visibleMap[i][j];
              tileArray[i][j] = {
                  tileValue: map[i][j],
                  tileSprite: tile
              }
          }
      }
      this.showMoveableNumbers();
  }
  static createSolution(){
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
  static initVisibleElements(){
      visibleMap[0] = [false, false, true, false, false, true, false, true, true];
      visibleMap[1] = [true, false, true, false, true, true, false, true, false];
      visibleMap[2] = [false, false, true, false, true, true, false, true, false];
      visibleMap[3] = [false, true, true, false, false, true, true, true, false];
      visibleMap[4] = [true, false, false, true, true, false, true, false, true];
      visibleMap[5] = [true, false, true, false, false, true, false, false, true];
      visibleMap[6] = [false, false, true, false, false, true, false, true, false];
      visibleMap[7] = [true, true, false, false, true, false, false, true, true];
      visibleMap[8] = [false, true, false, false, false, true, false, true, false];
      return visibleMap;
  }
  static getPosition(x, y){
      for(var i = 0; i < gameOptions.boardSize.rows; i++){
          for(var j = 0; j < gameOptions.boardSize.cols; j++){
              var pos = playGame.getTilePosition(i, j);
              if(x >= pos.x - (gameOptions.tileSize / 2) &&
                    x <= pos.x + (gameOptions.tileSize / 2) &&
                    y >= pos.y - (gameOptions.tileSize / 2) &&
                    y <= pos.y + (gameOptions.tileSize / 2)){
                  return [i, j];
              }
          }
      }
      return [-1, -1];
  }
  static hasWon(){
      var count = 0;
      for(var i = 0; i < gameOptions.boardSize.rows; i++){
          for(var j = 0; j < gameOptions.boardSize.cols; j++){
            if(tileArray[i][j].tileSprite.visible === true){
                count++;
            } else {
                return false;
            }
          }
      }
      return true;
  }
  showMoveableNumbers(){
      var numberList = [];
      var pos = playGame.getTilePosition(gameOptions.boardSize.cols, gameOptions.boardSize.rows);
      var freeSpace = game.config.height - (pos.y + (gameOptions.tileSize / 2) + gameOptions.tileSpacing);
      var posY = pos.y + (freeSpace / 2);

      for(var i = 0; i < gameOptions.boardSize.cols; i++){
          pos = playGame.getTilePosition(0, i);
          this.add.image(pos.x, posY, "emptytile");
          numberList[i] = [pos.x, posY];
      }

      this.items = this.add.group([
          {
            key: "1",
            setXY: {
                x: numberList[0][0],
                y: numberList[0][1]
            }
          },
          {
            key: "2",
            setXY: {
                x: numberList[1][0],
                y: numberList[1][1]
            }
          },
          {
              key: "3",
              setXY: {
                  x: numberList[2][0],
                  y: numberList[2][1]
              }
          },
          {
              key: "4",
              setXY: {
                  x: numberList[3][0],
                  y: numberList[3][1]
              }
          },
          {
              key: "5",
              setXY: {
                  x: numberList[4][0],
                  y: numberList[4][1]
              }
          },
          {
              key: "6",
              setXY: {
                  x: numberList[5][0],
                  y: numberList[5][1]
              }
          },
          {
              key: "7",
              setXY: {
                  x: numberList[6][0],
                  y: numberList[6][1]
              }
          },
          {
              key: "8",
              setXY: {
                  x: numberList[7][0],
                  y: numberList[7][1]
              }
          },
          {
              key: "9",
              setXY: {
                  x: numberList[8][0],
                  y: numberList[8][1]
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
              var withinBounds = playGame.getPosition(item.x, item.y);
              if(withinBounds[0] !== -1 && withinBounds[1] !== -1){
                  if(tileArray[withinBounds[0]][withinBounds[1]].tileValue === parseInt(item.texture.key, 10)){
                      tileArray[withinBounds[0]][withinBounds[1]].tileSprite.visible = true;
                  }
              }
              item.x = numberList[parseInt(item.texture.key, 10) - 1][0];
              item.y = numberList[parseInt(item.texture.key, 10) - 1][1];
              if(playGame.hasWon()){
                  console.log("Player has won!")
              }
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
};
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
