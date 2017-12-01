/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

var Game = {};
var platforms;
var cursors;
var player;
var playerStartX = 100;
var playerStartY = 500;
var recordedID = 0;
var safehouse1;
var safehouse2;
var whichSafeHouseToSeek = 0;

var countDownNumber = 10;
var timertext = 0;
var safeText = 0;
var playerNameText = 0;
var playerNameTextHeight = randomInt(20, 60);
var playerNameTextColor = randomInt(0, 999999);

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
	game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('wall', 'assets/rotatedplatform.png');    
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.image('sprite','assets/sprites/sprite.png');
    game.load.image('safehouse1', 'assets/safehouse1.png');
    game.load.image('cnterpc', 'assets/freetileset/sidepiece.png');
    game.load.image('safehouse2', 'assets/safehouse2.png');
};

Game.create = function(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');

    safehouse1 = game.add.sprite(5, game.world.height - 165, 'safehouse1');
    safehouse1.scale.setTo(0.85, 0.85);

    safehouse2 = game.add.sprite(game.world.width - 120, 0, 'safehouse2');
    safehouse2.scale.setTo(0.85, 0.85);
    
    //cnterpc = game.add.sprite(0, 0, 'cnterpc');
    //cnterpc.scale.setTo(0.2, 0.2);

    platforms = game.add.group();
    platforms.enableBody = true;

    //Bottom Layer

    var ground = platforms.create(0, game.world.height - 32, 'ground');
    ground.scale.setTo(4, 0.85);    
    ground.body.immovable = true;


  //  var ledge = platforms.create(400, 400, 'ground');
   //    ledge.body.immovable = true;

    //ledge = platforms.create(800, 400, 'ground');
    //ledge.body.immovable = true;

    //ledge = platforms.create(-150, 250, 'ground');
    //ledge.body.immovable = true;


    //Trump Wall
    var wall = platforms.create(1000, 0, 'wall');
    wall.scale.setTo(1, 0.5);
    wall.body.immovable = true;

    wall = platforms.create(1000, 300, 'wall');
    wall.scale.setTo(1, 0.5);
    wall.body.immovable = true;

    //Extra Wall Because I suck
    wall = platforms.create(1000, 400, 'wall');
    wall.scale.setTo(1, 0.5);
    wall.body.immovable = true;
    
//Legde below safehouse 2
    ledge = platforms.create(game.world.width - 150, 139, 'ground');
    ledge.scale.setTo(1.2, 0.85);
    ledge.body.immovable = true;

    player = game.add.sprite(playerStartX, game.world.height - playerStartY, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.1;
    player.body.gravity.y = 200;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

	Game.playerMap = {};	
    Client.askNewPlayer(playerStartX, game.world.height - playerStartY, playerName, playerNameTextHeight, playerNameTextColor);

    cursors = game.input.keyboard.createCursorKeys();

    //create game timer and start it
    timertext = game.add.text(game.world.centerX, 50, 'Timer till safehouses closes:  ', { font: "32px Arial", fill: "#ffffff", align: "center" });
    timertext.anchor.setTo(0.5, 0.5);
    game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this); 
    //create safehouse text directions (SAFE/NOT SAFE)
    safeText = game.add.text(game.world.centerX, 100, '', { font: "32px Arial", fill: "#000000", align: "center" });
    safeText.anchor.setTo(0.5, 0.5);    
    playerNameText = game.add.text(player.body.x + 16, player.body.y + 24 - playerNameTextHeight, playerName, { font: "12px Arial", fill: "#" + playerNameTextColor, align: "center" });
    playerNameText.anchor.setTo(0.5, 0.5);  
       
    //showSafe();    
};

function showNotSafe() {
    safeText.setText('You are NOT SAFE!\n Seek shelter in other safehouse!'); 
    safeText.addColor('#ff0000', 0);   
}

function showSafe() {
    safeText.setText('You are SAFE!\n Get ready to seek shelter in other safehouse!');    
    safeText.addColor('#00ff00', 0);       
}

function collisionsafehouse1() {

    var playerBox = player.getBounds();
    var safehouse1Box = safehouse1.getBounds();
    
    if (Phaser.Rectangle.intersects(playerBox, safehouse1Box)) {
        showSafe();
    } else {
        showNotSafe();
    }
}

function collisionsafehouse2() {
    
    var playerBox = player.getBounds();
    var safehouse2Box = safehouse2.getBounds();
    
    if (Phaser.Rectangle.intersects(playerBox, safehouse2Box)) {
        showSafe();
    } else {
        showNotSafe();
    }
 }

function updateCounter() {
    countDownNumber--;
    if (countDownNumber <= 0) {
        countDownNumber = 10;
        if (whichSafeHouseToSeek) {
            whichSafeHouseToSeek = 0;
        } else if (whichSafeHouseToSeek == 0) {
            whichSafeHouseToSeek = 1;
        }
    }
    timertext.setText('Timer till safehouses closes:' + countDownNumber);    
}

function updateCounterFromServerTime(time) {
    countDownNumber = time;  
}

function updateWhichSafeHouse(whichSafeHouse) {
    whichSafeHouseToSeek = whichSafeHouse;
}

Game.update = function() {

    if (whichSafeHouseToSeek) {
        collisionsafehouse1();
    } else {
        collisionsafehouse2();
    }

    game.physics.arcade.collide(player, platforms);

    player.body.velocity.x = 0;
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;
        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;
        player.animations.play('right');
    }
    else
    {
        player.animations.stop();
        player.frame = 4;
    }
    
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }
    Client.sendPos(player.body.x,player.body.y);
    
    //center text on sprite
    playerNameText.x = player.body.x + (player.width / 2);
    playerNameText.y = player.body.y + (player.height / 2) - playerNameTextHeight;
}

Game.addnewID = function(id){
		recordedID = id;
}

Game.addNewPlayer = function(id,x,y, playerNameIn, playerNameTextHeightIn, playerNameTextColorIn){

    Game.playerMap[id] = game.add.sprite(x, game.world.height - y, 'dude');
    Game.playerMap[id].alpha = 0.5;
    Game.playerMap[id].text = game.add.text(x + 16, game.world.height - y + 24 - playerNameTextHeightIn, playerNameIn, { font: "12px Arial", fill: "#" + playerNameTextColorIn, align: "center" });
    Game.playerMap[id].text.anchor.setTo(0.5, 0.5);  
};

Game.movePlayer = function(id,x,y){
	
	if (id == recordedID) {
        return; }

    var playertext = Game.playerMap[id].text;
    var distance = Phaser.Math.distance(playertext.x,playertext.y,x,y);
    var tween = game.add.tween(playertext);
    var duration = distance*1;
    tween.to({x:x+16,y:y}, duration);
    tween.start();

    var player = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x,player.y,x,y);
    var tween = game.add.tween(player);
    var duration = distance*1;
    tween.to({x:x,y:y}, duration);
    tween.start();
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    Game.playerMap[id].text.destroy();
    delete Game.playerMap[id];
};