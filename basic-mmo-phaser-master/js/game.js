/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

var Game = {};
var platforms;
var cursors;
var player;
var playerStartX = 500;
var playerStartY = 500;
var recordedID = 0;

var randomNameTag = randomInt(1, 9999999);

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

var playerName = "player" + String(randomNameTag);

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
	game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet(randomNameTag, 'assets/dude.png', 32, 48);
    game.load.image('sprite','assets/sprites/sprite.png');
};

Game.create = function(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');
    platforms = game.add.group();
    platforms.enableBody = true;
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;
    player = game.add.sprite(playerStartX, game.world.height - playerStartY, randomNameTag);
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
	
	Game.playerMap = {};	
    Client.askNewPlayer(playerStartX, game.world.height - playerStartY);

	cursors = game.input.keyboard.createCursorKeys();
};

Game.update = function() {
	
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
    Game.playerMap[id] = game.add.sprite(x, game.world.height - y, randomNameTag);
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