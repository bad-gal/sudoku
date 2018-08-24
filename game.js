let game;
let tileArray = [];
let timeText;
let gameTimer;
let myTime;
let startTimer;
let level;
let randomOrder = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
let levelList = [];
let sudokuMap;
let goToMenu;

const gameOptions = {
    tileSize: 288,
    tileSpacing: 20,
    boardSize: {rows: 9, cols: 9},
    tweenSpeed: 50,
    aspectRatio: 16 / 9
};
let map = new Array(gameOptions.boardSize.rows);
let visibleMap = new Array(gameOptions.boardSize.rows);

/*
    Before game is displayed load the graphics
*/
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
    this.load.image("easy", "assets/sprites/easy.png");
    this.load.image("medium", "assets/sprites/medium.png");
    this.load.image("hard", "assets/sprites/hard.png");
    this.load.image("superhard", "assets/sprites/superhard.png");
    this.load.image("retry", "assets/sprites/retry.png");
    this.load.image("menu", "assets/sprites/menu.png");
  }

  create(){
    this.scene.start("MenuGame");
  }
}

class menuGame extends Phaser.Scene{
    constructor(){
        super("MenuGame");
    }

    create(){
        this.add.text(300, 300, "Choose level of difficulty", { fontSize: '100px', fill: '#000' });

        //add level buttons and make them clickable
        this.items = this.add.group([
            { key: "easy", setXY: { x: 700, y: 600 } },
            { key: "medium", setXY: { x: 700, y: 1200 } },
            { key: "hard", setXY: { x: 700, y: 1800 } },
            { key: "superhard", setXY: { x: 700, y: 2400 } }
        ]);

        Phaser.Actions.Call(this.items.getChildren(), function(item){
            item.setInteractive();

            item.on('pointerdown', function (pointer) {
                item.setTint(0xff0000);
            });

            item.on('pointerout', function (pointer) {
                item.clearTint();
            });

            item.on('pointerup', function (pointer) {
                item.clearTint();
                level = item.texture.key;
                console.log(level);
                shuffle(randomOrder);
                levelList = appendText(item.texture.key, randomOrder);
                console.log(levelList);
            });
        }, this );
    }

    update(){
        if(level !== undefined) {
            this.scene.start("PlayGame");
        }
    }
}

/*
    Manage gameplay here
*/
class playGame extends Phaser.Scene{
  constructor(){
    super("PlayGame");
  }

  create(){
      //initialise timer values
      myTime = 0;
      startTimer = 0;
      timeText = this.add.text(32, 32, "_", { fontSize: '100px', fill: '#000' });
      gameTimer = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });
      goToMenu = false;
      this.addTilesToScreen();
      this.addLinesToScreen();

      let retry = this.add.sprite(400, 600, 'retry').setInteractive();
      retry.on("pointerdown", function(){
          retry.setTint(0xff0000);
      });

      retry.on('pointerout', function () {
          retry.clearTint();
      });

      retry.on('pointerup', function () {
          item.clearTint();
          console.log("replay this level");
      });

      let menu = this.add.sprite(1000, 600, 'menu').setInteractive();
      menu.on("pointerdown", function(){
          menu.setTint(0xff0000);
      });

      menu.on('pointerout', function () {
          menu.clearTint();
      });

      menu.on('pointerup', function () {
          menu.clearTint();
          goToMenu = true;
      });
  }

  /*
    Get the tile position dependant on the row and column specified
  */
  static getTilePosition(row, col){
      let posX = gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize * (col + 0.5);
      let posY = gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize * (row + 0.5);
      let boardHeight = gameOptions.boardSize.rows * gameOptions.tileSize;
      boardHeight += (gameOptions.boardSize.rows + 1) * gameOptions.tileSpacing;
      posY += (game.config.height - boardHeight) / 2;
      return new Phaser.Geom.Point(posX, posY);
  }

  addLinesToScreen(){
      //vertical lines
      let pos = playGame.getTilePosition(4,0);
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
      map = playGame.createMap(sudokuMap[levelList[0]].map);
      visibleMap = playGame.createVisibleTiles(sudokuMap[levelList[0]].visible);

      for(let i = 0; i < gameOptions.boardSize.rows; i++){
          tileArray[i] = [];
          for(let j = 0; j < gameOptions.boardSize.cols; j++){
              let tilePosition = playGame.getTilePosition(i,j);
              this.add.image(tilePosition.x, tilePosition.y, "emptytile");
              let tile = this.add.image(tilePosition.x, tilePosition.y, map[i][j].toString());
              tile.visible = visibleMap[i][j];
              tileArray[i][j] = {
                  tileValue: map[i][j],
                  tileSprite: tile
              }
          }
      }
      this.showMovableNumbers();
  }

  static createMap(values){
      var arr = [];
      var index = -1;
      for(var i = 0; i < values.length; i++){
          if(i % gameOptions.boardSize.cols === 0){
              index++;
              arr[index] = [];
          }
          arr[index].push(values[i]);
      }
      return arr;
  }

  static createVisibleTiles(values){
      let arr = [];
      let index = -1;
      for(let i = 0; i < values.length; i++){
          if(i % gameOptions.boardSize.cols === 0){
              index++;
              arr[index] = [];
          }
          if(values[i] === 1){
              arr[index].push(true);
          } else {
              arr[index].push(false);
          }
      }
      return arr;
  }

  static getPosition(x, y){
      for(let i = 0; i < gameOptions.boardSize.rows; i++){
          for(let j = 0; j < gameOptions.boardSize.cols; j++){
              let pos = playGame.getTilePosition(i, j);
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
      let count = 0;
      for(let i = 0; i < gameOptions.boardSize.rows; i++){
          for(let j = 0; j < gameOptions.boardSize.cols; j++){
            if(tileArray[i][j].tileSprite.visible === true){
                count++;
            } else {
                return false;
            }
          }
      }
      return true;
  }

  showMovableNumbers(){
      let numberList = [];

      //dynamically decide where the movable tiles will be placed
      let pos = playGame.getTilePosition(gameOptions.boardSize.cols, gameOptions.boardSize.rows);
      let freeSpace = game.config.height - (pos.y + (gameOptions.tileSize / 2) + gameOptions.tileSpacing);
      let posY = pos.y + (freeSpace / 2);

      //add empty tile images
      for(let i = 0; i < gameOptions.boardSize.cols; i++){
          pos = playGame.getTilePosition(0, i);
          this.add.image(pos.x, posY, "emptytile");
          numberList[i] = [pos.x, posY];
      }

      //create a group consisting of tiles from 1 to 9 which are draggable. Place them in a row on top of
      //the empty tiles
      this.items = this.add.group([
          {
            key: "1",
            setXY: {
                x: numberList[0][0], y: numberList[0][1]
            }
          },
          {
            key: "2",
            setXY: {
                x: numberList[1][0], y: numberList[1][1]
            }
          },
          {
              key: "3",
              setXY: {
                  x: numberList[2][0], y: numberList[2][1]
              }
          },
          {
              key: "4",
              setXY: {
                  x: numberList[3][0], y: numberList[3][1]
              }
          },
          {
              key: "5",
              setXY: {
                  x: numberList[4][0], y: numberList[4][1]
              }
          },
          {
              key: "6",
              setXY: {
                  x: numberList[5][0], y: numberList[5][1]
              }
          },
          {
              key: "7",
              setXY: {
                  x: numberList[6][0], y: numberList[6][1]
              }
          },
          {
              key: "8",
              setXY: {
                  x: numberList[7][0], y: numberList[7][1]
              }
          },
          {
              key: "9",
              setXY: {
                  x: numberList[8][0], y: numberList[8][1]
              }
          }
      ]);

      this.items.setDepth(1); //set the group to be drawn over the other images in the game

      //make the group interactive and able to be dragged by the player.
      Phaser.Actions.Call(this.items.getChildren(), function(item){
          item.setInteractive();
          this.input.setDraggable(item);

          item.on('dragstart', function (pointer) {
              item.setTint(0xff0000);

              //start incrementing timer once player has moved the first tile
              if(startTimer === 0) {
                  startTimer = 1;
              }
          });

          //set the dragged tile to be the same position as the mouse pointer
          item.on('drag', function (pointer, dragX, dragY) {
              item.x = dragX;
              item.y = dragY;
          });

          //If the tile is placed in the correct position then the hidden tile is revealed
          //This dragged tile goes back to original position.
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

  update(){
      //Format the time to show mm:ss
      let minutes = Math.floor(myTime / 60);
      let seconds;

      if(myTime > 59) {
          seconds = myTime % 60;
      } else {
          seconds = myTime;
      }

      if(seconds < 10){
          timeText.setText("Timer " + minutes.toFixed(0) + ":" + "0" + seconds);
      } else {
          timeText.setText("Timer " + minutes.toFixed(0) + ":" + seconds);
      }

      if(goToMenu === true){
          this.scene.start("MenuGame");
          level = undefined;
      }
  }
}

function onEvent(){
    if(startTimer === 1) {
        myTime++;
    }
}

/**********************************************
 Initialise variables when window loads
 **********************************************/
window.onload = function() {
  let tileAndSpacing = gameOptions.tileSize + gameOptions.tileSpacing;
  let width = gameOptions.boardSize.cols * tileAndSpacing;
  width += gameOptions.tileSpacing;

  let gameConfig = {
    width: width,
    height: width * gameOptions.aspectRatio,
    backgroundColor: 0xecf0f1,
    scene: [bootGame, menuGame, playGame]
  };

  game = new Phaser.Game(gameConfig);

  loadJSON(function (response){
      sudokuMap = JSON.parse(response);
  });

  window.focus();
  resizeGame();
  window.addEventListener("resize", resizeGame);
};

/**********************************************
  Resize screen on game load and on user action
***********************************************/
function resizeGame() {
  let canvas = document.querySelector("canvas");
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  let windowRatio = windowWidth / windowHeight;
  let gameRatio = game.config.width / game.config.height;

  if(windowRatio < gameRatio){
    canvas.style.width = windowWidth + "px";
    canvas.style.height = (windowWidth / gameRatio) + "px";
  }
  else {
    canvas.style.width = (windowHeight * gameRatio) + "px";
    canvas.style.height = windowHeight + "px";
  }
}

/**********************************************
 Load map.json
 taken from: https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
 ***********************************************/
function loadJSON(callback) {
    let object = new XMLHttpRequest();
    object.overrideMimeType("application/json");
    object.open('GET', 'map.json', true);
    object.onreadystatechange = function () {
        if (object.readyState == 4 && object.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(object.responseText);
        }
    };
    object.send(null);
}

function shuffle(array){
    let i = 0, j = 0, temp = null;

    for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function appendText(text, array){
    let arr = [];
    for(let i = 0; i < array.length; i++){
        arr[i] = text + array[i];
    }
    return arr;
}
