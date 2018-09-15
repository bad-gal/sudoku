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
let reset;
let startGame = false;
let stopTimer = false;
let stopMinutes;
let stopSeconds;
let levelIndex = 0;
let displayDialog = false;
let nextGame = false;

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
    this.load.image("background", "assets/sprites/bamboo3.png");
    this.load.image("title", "assets/sprites/sudoku_title.png");
    this.load.image("play", "assets/sprites/play.png");
    this.load.image("holder", "assets/sprites/holder.png");
    this.load.image("time", "assets/sprites/time.png");
    this.load.image("counter", "assets/sprites/counter.png");
    this.load.image("dialog", "assets/sprites/dialog.png");
    this.load.image("playArrow", "assets/sprites/play_arrow.png");
    this.load.image("menuText", "assets/sprites/menu_text.png");
    this.load.image("congrats", "assets/sprites/congrats.png");
    this.load.image("playAgain", "assets/sprites/playAgain_text.png");
    this.load.image("completed", "assets/sprites/completed_text.png");
    this.load.image("completedTime", "assets/sprites/completed_time_text.png");
  }

  create(){
    this.scene.start("TitleGame");
  }
}

class titleGame extends Phaser.Scene{
    constructor(){
        super("TitleGame");
    }

    create(){
        let background = this.add.image(game.config.width / 2, game.config.height / 2, "background");
        background.setDisplaySize(game.config.width, game.config.height);

        this.add.image(game.config.width / 2, game.config.height / 3, "title");

        let play = this.add.sprite(game.config.width / 2, game.config.height / 2, "play").setInteractive();
        play.on("pointerdown", function(){
            play.setTint(0xff0000);
        });

        play.on('pointerout', function () {
            play.clearTint();
        });

        play.on('pointerup', function () {
            play.clearTint();
            startGame = true;
        });

    }

    update(){
        if(startGame === true){
            this.scene.start("MenuGame");
            startGame = false;
        }
    }
}

class menuGame extends Phaser.Scene{
    constructor(){
        super("MenuGame");
    }

    create(){
        let background = this.add.image(game.config.width / 2, game.config.height / 2, "background");
        background.setDisplaySize(game.config.width, game.config.height);
        let holder = this.add.image(game.config.width / 2, game.config.height / 2, "holder");
        this.add.image(game.config.width / 2, game.config.height / 3, "menuText");

        //add level buttons and make them clickable
        this.items = this.add.group([
            { key: "easy", setXY: { x: holder.x - (holder.x / 3), y: holder.y - (holder.y / 8)} },
            { key: "medium", setXY: { x: holder.x + (holder.x / 3), y: holder.y - (holder.y / 8) } },
            { key: "hard", setXY: { x: holder.x - (holder.x / 3), y: holder.y + (holder.y / 8) } },
            { key: "superhard", setXY: { x: holder.x + (holder.x / 3), y: holder.y + (holder.y / 8) } }
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
                shuffle(randomOrder);
                levelList = appendText(item.texture.key, randomOrder);
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
      //set up background, time box and game counter
      let background = this.add.image(game.config.width / 2, game.config.height / 2, "background");
      background.setDisplaySize(game.config.width, game.config.height);
      this.add.image(game.config.width / 5, game.config.height / 22, "time");
      this.add.image(game.config.width / 2 + (game.config.width / 2.8), game.config.height - (game.config.height / 26), "counter");
      this.add.text(game.config.width / 2 + (game.config.width /3.8), game.config.height - (game.config.height / 20), (levelIndex + 1) + "/" + levelList.length, { fontSize: '100px', fill: "#fff" });

      //initialise timer values
      myTime = 0;
      startTimer = 0;
      timeText = this.add.text(game.config.width / 9, game.config.height / 28, "_", { fontSize: '100px', fill: '#fff' });
      gameTimer = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });

      goToMenu = false;

      this.addTilesToScreen();
      this.addLinesToScreen();

      //set up the retry button
      let retry = this.add.sprite(game.config.width / 2 + (game.config.width / 2.5), 600, 'retry').setInteractive();
      retry.on("pointerdown", function(){
          retry.setTint(0xff0000);
      });

      retry.on('pointerout', function () {
          retry.clearTint();
      });

      retry.on('pointerup', function () {
          retry.clearTint();
          myTime = 0;
          startTimer = 0;
          reset = true;
      });

      //set up the menu button
      let menu = this.add.sprite(game.config.width / 2 + (game.config.width / 2.5), game.config.height / 2 - (game.config.height / 2.2), 'menu').setInteractive();
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
      map = playGame.createMap(sudokuMap[levelList[levelIndex]].map);
      visibleMap = playGame.createVisibleTiles(sudokuMap[levelList[levelIndex]].visible);

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
                  stopTimer = true;
                  let completedTime = myTime;
                  stopMinutes = Math.floor(completedTime / 60);

                  if (completedTime > 59) {
                      stopSeconds = completedTime % 60;
                  } else {
                      stopSeconds = completedTime;
                  }
                  displayDialog = true;
              }
          });
      }, this);
  }

  update(){
      //Format the time to show mm:ss
      let minutes = Math.floor(myTime / 60);
      let seconds;

      if (myTime > 59) {
          seconds = myTime % 60;
      } else {
          seconds = myTime;
      }

      if(stopTimer === false) {
          if (seconds < 10) {
              timeText.setText(minutes.toFixed(0) + ":" + "0" + seconds);
          } else {
              timeText.setText(minutes.toFixed(0) + ":" + seconds);
          }
      } else {
          if (stopSeconds < 10) {
              timeText.setText(stopMinutes.toFixed(0) + ":" + "0" + stopSeconds);
          } else {
              timeText.setText(stopMinutes.toFixed(0) + ":" + stopSeconds);
          }
      }

      if(goToMenu === true){
          this.scene.start("MenuGame");
          level = undefined;
      }

      else if(reset === true){
          this.addTilesToScreen();
          stopTimer = false;
          reset = false;
      }

      else if(displayDialog === true) {
          this.scene.start("SuccessGame");
      }
  }
}

class successGame extends Phaser.Scene{

    constructor(){
        super("SuccessGame");
    }

    create(){
        //set up background, time box and game counter
        let background = this.add.image(game.config.width / 2, game.config.height / 2, "background");
        background.setDisplaySize(game.config.width, game.config.height);

        let dialog = this.add.image(game.config.width / 2, game.config.height / 2, "dialog");
        dialog.setDepth(1);

        let dialogCongrats = this.add.image(game.config.width / 2, game.config.height / 2 - (game.config.height / 14), "congrats");
        dialogCongrats.setDepth(2);

        let completedTimeText = this.add.image(game.config.width / 2, game.config.height / 2 - (game.config.height / 26), "completedTime");
        completedTimeText.setDepth(2);

        let dialogText = this.add.text(game.config.width / 2 + (game.config.width / 5), game.config.height / 2 - (game.config.height / 20),  timeText.text, { fontSize: '100px', fill: '#fff'});
        dialogText.setDepth(2);

        let playArrow = this.add.sprite(game.config.width / 2, game.config.height / 2 + (game.config.height / 15), "playArrow");
        playArrow.setDepth(2);
        playArrow.setInteractive();

        playArrow.on("pointerdown", function(){
            playArrow.setTint(0xff0000);
        });

        playArrow.on('pointerout', function () {
            playArrow.clearTint();
        });

        playArrow.on('pointerup', function () {
            playArrow.clearTint();
            nextGame = true;
            myTime = 0;
            startTimer = 0;
            stopTimer = false;
            displayDialog = false;
        });

        //disable play button and "play another game" if the player has played 20 games already
        let dialogPlayText;
        if(levelIndex === levelList.length - 1){
            playArrow.setVisible(false);
            playArrow.input.enable = false;
            dialogPlayText = this.add.image(game.config.width / 2, game.config.height / 2, "completed");
        } else {
            dialogPlayText = this.add.image(game.config.width / 2, game.config.height / 2, "playAgain");
        }
        dialogPlayText.setDepth(2);

        //set up the retry button
        let retry = this.add.sprite(game.config.width / 2 + (game.config.width / 2.5), 600, 'retry').setInteractive();
        retry.on("pointerdown", function(){
            retry.setTint(0xff0000);
        });

        retry.on('pointerout', function () {
            retry.clearTint();
        });

        retry.on('pointerup', function () {
            retry.clearTint();
            myTime = 0;
            startTimer = 0;
            stopTimer = false;
            displayDialog = false;
            reset = true;
        });

        //set up the menu button
        let menu = this.add.sprite(game.config.width / 2 + (game.config.width / 2.5), game.config.height / 2 - (game.config.height / 2.2), 'menu').setInteractive();
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

    update(){
        if(nextGame === true){
            if(levelIndex < randomOrder.length){
                levelIndex++;
                nextGame = false;
                this.scene.start("PlayGame");
            } else {

            }
        }

        else if(goToMenu === true){
            this.scene.start("MenuGame");
            level = undefined;
        }

        else if(reset === true){
            this.scene.start("PlayGame");
            reset = false;
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
    scene: [bootGame, titleGame, menuGame, playGame, successGame]
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
