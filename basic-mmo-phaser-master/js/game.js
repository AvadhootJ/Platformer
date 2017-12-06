

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
    game.load.image('bush1', 'assets/bush1.png');
    game.load.image('bush2', 'assets/bush2.png');
    game.load.image('bush3', 'assets/bush3.png');
    game.load.image('bush4', 'assets/bush4.png');
    game.load.image('crate', 'assets/Crate.png');
    game.load.audio('backgroundmusic', 'assets/FantasyGameBackground.mp3');
    game.load.image('cloud2', 'assets/cloud2.png');
    game.load.image('cloud1', 'assets/cloud2.png');
	game.load.image('niceforestbg', 'assets/niceforestbg.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('wall', 'assets/rotatedplatform.png');    
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.image('sprite','assets/sprites/sprite.png');
    game.load.image('safehouse1', 'assets/safehouse1.png');
    game.load.image('safehouse2', 'assets/safehouse2.png');
    game.load.image('water', 'assets/water.png');
    game.load.image('cutesun', 'assets/CuteSun.png');
    game.load.image('pinkmushroom', 'assets/pinkmushroom.png');
    game.load.image('orangemushroom', 'assets/orangemushroom.png');
    game.load.image('darktree', 'assets/darktree.png');
    game.load.image('Stone','assets/Stone.png');

    game.load.image('floatleftpiece','assets/floatleftpiece.png');
    game.load.image('floatcenterpiece', 'assets/floatcenterpiece.png');
    game.load.image('floatrightpiece', 'assets/floatrightpiece.png');


    game.load.image('leftpiece','assets/leftpiece.png');
    game.load.image('cntrpc', 'assets/freetileset/cntrpc.png');
        game.load.image('rightpiece', 'assets/rightpiece.png');

};

Game.create = function(){
    game.world.setBounds(0, 0, 1300, 600);

    //Background music
   var backgroundmusic  = game.add.audio('backgroundmusic');
   backgroundmusic.loop = true;
   backgroundmusic.play();

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'niceforestbg');
  //  game.scale.setTo(1.2, 1);
   safehouse1 = game.add.sprite(50, game.world.height - 50, 'safehouse1');
    safehouse1.scale.setTo(0.1, 0.1);

    safehouse2 = game.add.sprite(game.world.width - 55,  game.world.height - 50, 'safehouse2');
    safehouse2.scale.setTo(0.1, 0.1);


    platforms = game.add.group();
    platforms.enableBody = true;


    //Bottom tree
    var darktree = game.add.sprite(-0.5, game.world.height - 180, 'darktree');
    darktree.scale.setTo(0.5, 0.5);

    //Bottom Layer

    var ground = platforms.create(game.world.width/2 - 650, game.world.height - 32, 'cntrpc');
    ground.scale.setTo(11, 0.85);    
    ground.body.immovable = true;


    //Bottom Stone

    var stone = game.add.sprite(game.world.width - 110,  game.world.height - 70, 'Stone');
    stone.scale.setTo(0.8, 0.8);

    //Center platform

    var lft = platforms.create(game.world.width - 948, game.world.height/2, 'leftpiece');
    lft.scale.setTo(1.05, 0.25);    
    lft.body.immovable = true;

    var center = platforms.create(game.world.width - 815, game.world.height/2, 'cntrpc');
    center.scale.setTo(2.7, 0.25);    
    center.body.immovable = true;

    var rtt = platforms.create(game.world.width - 470, game.world.height/2, 'rightpiece');
    rtt.scale.setTo(1.05, 0.25);    
    rtt.body.immovable = true;


    //Cute Sun
    var cutesun = game.add.sprite(game.world.width - 110, 0, 'cutesun');
    cutesun.scale.setTo(0.3, 0.3);

    //Cloud

var cloud = game.add.sprite(0, 30, 'cloud2');
cloud.scale.setTo(0.1, 0.1);
game.physics.enable(cloud, Phaser.Physics.ARCADE);
cloud.body.velocity.x=50;

cloud = game.add.sprite(-40, 40, 'cloud2');
cloud.scale.setTo(0.1, 0.1);
game.physics.enable(cloud, Phaser.Physics.ARCADE);
cloud.body.velocity.x=45;

cloud = game.add.sprite(-4000, 40, 'cloud2');
cloud.scale.setTo(0.1, 0.1);
game.physics.enable(cloud, Phaser.Physics.ARCADE);
cloud.body.velocity.x=45;

cloud = game.add.sprite(-4000, 40, 'cloud2');
cloud.scale.setTo(0.2, 0.2);
game.physics.enable(cloud, Phaser.Physics.ARCADE);
cloud.body.velocity.x=40;

cloud = game.add.sprite(-3000, 38, 'cloud2');
cloud.scale.setTo(0.2, 0.2);
game.physics.enable(cloud, Phaser.Physics.ARCADE);
cloud.body.velocity.x=40;

cloud = game.add.sprite(-1000, 20, 'cloud2');
cloud.scale.setTo(0.1, 0.1);
game.physics.enable(cloud, Phaser.Physics.ARCADE);
cloud.body.velocity.x=55;

cloud = game.add.sprite(-4000, 20, 'cloud2');
cloud.scale.setTo(0.1, 0.1);
game.physics.enable(cloud, Phaser.Physics.ARCADE);
cloud.body.velocity.x=55;

cloud = game.add.sprite(-600, 0, 'cloud2');
cloud.scale.setTo(0.1, 0.1);
game.physics.enable(cloud, Phaser.Physics.ARCADE);
cloud.body.velocity.x=27;

cloud = game.add.sprite(-1600, 0, 'cloud2');
cloud.scale.setTo(0.1, 0.1);
game.physics.enable(cloud, Phaser.Physics.ARCADE);
cloud.body.velocity.x=27;

cloud = game.add.sprite(-700, 15, 'cloud2');
cloud.scale.setTo(0.1, 0.1);
game.physics.enable(cloud, Phaser.Physics.ARCADE);
cloud.body.velocity.x=35;

cloud = game.add.sprite(0, -10, 'cloud1');
cloud.scale.setTo(0.3, 0.3);
game.physics.enable(cloud, Phaser.Physics.ARCADE);
cloud.body.velocity.x=30;

cloud = game.add.sprite(-500, -80, 'cloud1');
cloud.scale.setTo(0.4, 0.4);
game.physics.enable(cloud, Phaser.Physics.ARCADE);
cloud.body.velocity.x=20;

cloud = game.add.sprite(-1500, -75, 'cloud1');
cloud.scale.setTo(0.4, 0.4);
game.physics.enable(cloud, Phaser.Physics.ARCADE);
cloud.body.velocity.x=20;

// Upper Ledge for falling players

var floatleftpiece = platforms.create(100, 170, 'floatleftpiece');
    floatleftpiece.scale.setTo(0.4, 0.35);
    floatleftpiece.body.immovable = true;

var floatcenterpiece = platforms.create(150, 170, 'floatcenterpiece');
floatcenterpiece.scale.setTo(0.4, 0.35);
floatcenterpiece.body.immovable = true;

var floatrightpiece = platforms.create(200, 170, 'floatrightpiece');
floatrightpiece.scale.setTo(0.4, 0.35);
floatrightpiece.body.immovable = true;



// Upper Mirrored ledge

floatleftpiece = platforms.create(game.world.width - 260, 170, 'floatleftpiece');
floatleftpiece.scale.setTo(0.4, 0.35);
floatleftpiece.body.immovable = true;

floatcenterpiece = platforms.create(game.world.width -210, 170, 'floatcenterpiece');
floatcenterpiece.scale.setTo(0.4, 0.35);
floatcenterpiece.body.immovable = true;

 floatrightpiece = platforms.create(game.world.width - 160, 170, 'floatrightpiece');
floatrightpiece.scale.setTo(0.4, 0.35);
floatrightpiece.body.immovable = true;



// Lower Ledge


floatleftpiece = platforms.create(100, 420, 'floatleftpiece');
floatleftpiece.scale.setTo(0.4, 0.35);
floatleftpiece.body.immovable = true;

floatcenterpiece = platforms.create(150, 420, 'floatcenterpiece');
floatcenterpiece.scale.setTo(0.4, 0.35);
floatcenterpiece.body.immovable = true;

floatrightpiece = platforms.create(200, 420, 'floatrightpiece');
floatrightpiece.scale.setTo(0.4, 0.35);
floatrightpiece.body.immovable = true;

// Lower Mirrored ledge


floatleftpiece = platforms.create(game.world.width - 260, 420, 'floatleftpiece');
floatleftpiece.scale.setTo(0.4, 0.35);
floatleftpiece.body.immovable = true;

floatcenterpiece = platforms.create(game.world.width -210, 420, 'floatcenterpiece');
floatcenterpiece.scale.setTo(0.4, 0.35);
floatcenterpiece.body.immovable = true;

 floatrightpiece = platforms.create(game.world.width - 160, 420, 'floatrightpiece');
floatrightpiece.scale.setTo(0.4, 0.35);
floatrightpiece.body.immovable = true;

//Decorations:

//Mushrooms


var orangemushroom = game.add.sprite(game.world.width - 900, game.world.height/2 - 29   , 'orangemushroom');
orangemushroom.scale.setTo(0.7, 0.7);

var pinkmushroom = game.add.sprite(game.world.width - 900, game.world.height/2 - 15, 'pinkmushroom');
pinkmushroom.scale.setTo(0.4, 0.4);

pinkmushroom = game.add.sprite(game.world.width - 875, game.world.height/2 - 15, 'pinkmushroom');
pinkmushroom.scale.setTo(0.4, 0.4);



//Top Right Mushrooms

var pinkmushroom1 = game.add.sprite(1100, 141, 'pinkmushroom');
pinkmushroom1.scale.setTo(0.7, 0.7);

var orangemushroom1 = game.add.sprite(1100, 150, 'orangemushroom');
orangemushroom1.scale.setTo(0.5, 0.5);

pinkmushroom1 = game.add.sprite(1130, 155, 'pinkmushroom');
pinkmushroom1.scale.setTo(0.4, 0.4);

//Crate
/*
var crate =  platforms.create(925, 265, 'crate');
crate.scale.setTo(0.5, 0.5);    
crate.body.immovable = true;
*/
//Bushes

var bush = game.add.sprite(255, game.world.height - 70, 'bush1');
bush.scale.setTo(0.6, 0.6);

bush = game.add.sprite(240, game.world.height - 57, 'bush4');
bush.scale.setTo(0.6, 0.6);

bush = game.add.sprite(270, game.world.height - 57, 'bush4');
bush.scale.setTo(0.6, 0.6);

//Center Platform bush
bush = game.add.sprite(760, game.world.height/2 - 30, 'bush2');
bush.scale.setTo(0.5, 0.5);

bush = game.add.sprite(780, game.world.height/2 - 30, 'bush1');
bush.scale.setTo(0.5, 0.5);


    player = game.add.sprite(playerStartX, game.world.height - playerStartY, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.1;
    player.body.gravity.y = 390;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);


	Game.playerMap = {};	
    Client.askNewPlayer(playerStartX, game.world.height - playerStartY, playerName, playerNameTextHeight, playerNameTextColor);
    game.camera.follow(player);
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