/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

var Game = {};
var platforms;
var cursors;
var player;
var playerStartX = 100;
var playerStartY = 600;
var recordedID = 0;
var safehouse1;
var safehouse2;
var whichSafeHouseToSeek = 0;

var countDownNumber = 10;
var timertext = 0;
var safeText = 0;

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

var playerName = 'player';// + String(randomNameTag);

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
	game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('player', 'assets/dude.png', 32, 48);
    game.load.image('sprite','assets/sprites/sprite.png');
    game.load.image('safehouse1', 'assets/safehouse1.png');
    game.load.image('safehouse2', 'assets/safehouse2.png');
};

Game.create = function(){

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');
    safehouse1 = game.add.sprite(50, 400, 'safehouse1');
    safehouse2 = game.add.sprite(300, 400, 'safehouse2');
    platforms = game.add.group();
    platforms.enableBody = true;
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.body.immovable = true;
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;
    player = game.add.sprite(playerStartX, game.world.height - playerStartY, 'player');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.1;
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

	Game.playerMap = {};	
    Client.askNewPlayer(playerStartX, game.world.height - playerStartY);

    cursors = game.input.keyboard.createCursorKeys();

    //create game timer
    timertext = game.add.text(game.world.centerX, 50, 'Timer till safehouses closes:  ', { font: "32px Arial", fill: "#ffffff", align: "center" });
    timertext.anchor.setTo(0.5, 0.5);
    safeText = game.add.text(game.world.centerX, 100, '', { font: "32px Arial", fill: "#000000", align: "center" });
    safeText.anchor.setTo(0.5, 0.5);    
    game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);    
    showSafe();
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
}

Game.addnewID = function(id){
		recordedID = id;
}

Game.addNewPlayer = function(id,x,y){
    Game.playerMap[id] = game.add.sprite(x, game.world.height - y, 'player');
    Game.playerMap[id].alpha = 0.3;
};

Game.movePlayer = function(id,x,y){
	
	if (id == recordedID) {
		return; }
	
    var player = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x,player.y,x,y);
    var tween = game.add.tween(player);
    var duration = distance*1;
    tween.to({x:x,y:y}, duration);
    tween.start();
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};