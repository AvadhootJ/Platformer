
var Game = {};
var hearts = {};
var platforms;
var cursors;
var spacekey;
var player;
var playerStartX = 100;
var playerStartY = 500;
var recordedID = 0;
var playerLives = 5;
var hitTimer = 0;
var stunnedTimer = 0;
var playerHitFrom = 0;
var hurlPlayerOnce = 0;

var playerNameText = 0;
var playerNameTextHeight = randomInt(20, 60);
var playerNameTextColor = randomInt(0, 999999);
var playerFacingDir = 0;

var debugVar = 0;

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
	game.load.image('niceforestbg', 'assets/niceforestbg.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('wall', 'assets/rotatedplatform.png');    
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.image('sprite','assets/sprites/sprite.png');
    game.load.image('safehouse1', 'assets/safehouse1.png');
    game.load.image('cntrpc', 'assets/freetileset/cntrpc.png');
    game.load.image('safehouse2', 'assets/safehouse2.png');
    game.load.image('water', 'assets/water.png');
    game.load.image('cutesun', 'assets/CuteSun.png');
    game.load.image('pinkmushroom', 'assets/pinkmushroom.png');
    game.load.image('darktree', 'assets/darktree.png');
    game.load.image('Stone','assets/Stone.png');
    game.load.image('sprite','assets/sprites/sprite.png');
    game.load.image('heart', 'assets/heart.png');
};

Game.create = function(){
    
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 100;
    game.physics.p2.restitution = 0.8;
    game.world.setBounds(0, 0, 1300, 600);

    hitTimer = game.time.create(false);
    hitTimer.start();
    stunnedTimer = game.time.create(false);

    //add space key 
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'niceforestbg');

    //create hearts in upper left of screen
    hearts[0] = game.add.sprite(10, 10, 'heart');    
    hearts[0].fixedToCamera = true;
    hearts[1] = game.add.sprite(70, 10, 'heart');
    hearts[1].fixedToCamera = true; 
    hearts[2] = game.add.sprite(130, 10, 'heart'); 
    hearts[2].fixedToCamera = true;
    hearts[3] = game.add.sprite(190, 10, 'heart'); 
    hearts[3].fixedToCamera = true;
    hearts[4] = game.add.sprite(250, 10, 'heart'); 
    hearts[4].fixedToCamera = true;

    safehouse1 = game.add.sprite(50, game.world.height - 50, 'safehouse1');
    safehouse1.scale.setTo(0.1, 0.1);

    safehouse2 = game.add.sprite(game.world.width - 55,  game.world.height - 50, 'safehouse2');
    safehouse2.scale.setTo(0.1, 0.1);
    
    //cnterpc = game.add.sprite(0, 0, 'cnterpc');
    //cnterpc.scale.setTo(0.2, 0.2);

    platforms = game.add.group();
    platforms.enableBody = true;

    //Water
    water = platforms.create(game.world.width/2  - 252, 565, 'water');
    water.scale.setTo(4.1, 0.4);    
    water.body.immovable = true;


    //Bottom Layer

    var ground = platforms.create(0, game.world.height - 32, 'cntrpc');
    ground.scale.setTo(3.1, 0.85);    
    ground.body.immovable = true;


    //Bottom tree
    var darktree = game.add.sprite(-1.5, game.world.height - 165, 'darktree');
    darktree.scale.setTo(0.45, 0.45);

    ground = platforms.create(game.world.width - 375, game.world.height - 32, 'cntrpc');
    ground.scale.setTo(3, 0.85);    
    ground.body.immovable = true;

    //Bottom Stone

    var stone = game.add.sprite(game.world.width - 110,  game.world.height - 70, 'Stone');
    stone.scale.setTo(0.8, 0.8);

    //Center platform
    var aire = platforms.create(game.world.width - 970, game.world.height/2, 'cntrpc');
    aire.scale.setTo(5, 0.25);    
    aire.body.immovable = true;

    //Cute Sun
    var cutesun = game.add.sprite(game.world.width - 110, 0, 'cutesun');
    cutesun.scale.setTo(0.3, 0.3);
    //  cutesun.body.immovable = true;

    // Upper Ledge for falling players
    ledge = platforms.create(100, 170, 'cntrpc');
    ledge.scale.setTo(1.2, 0.25);
    ledge.body.immovable = true;

    // Upper Mirrored ledge

    ledge = platforms.create(game.world.width - 260, 170, 'cntrpc');
    ledge.scale.setTo(1.2, 0.25);
    ledge.body.immovable = true;



    // Lower Ledge
    ledge = platforms.create(100, 420, 'cntrpc');
    ledge.scale.setTo(1.2, 0.25);
    ledge.body.immovable = true;

    // Lower Mirrored ledge

    ledge = platforms.create(game.world.width - 260, 420, 'cntrpc');
    ledge.scale.setTo(1.2, 0.25);
    ledge.body.immovable = true;



    //Decorations:

    //Mushrooms
    var pinkmushroom = game.add.sprite(game.world.width - 900, game.world.height/2 - 15, 'pinkmushroom');
    pinkmushroom.scale.setTo(0.4, 0.4);

    pinkmushroom = game.add.sprite(game.world.width - 875, game.world.height/2 - 15, 'pinkmushroom');
    pinkmushroom.scale.setTo(0.4, 0.4);

    player = game.add.sprite(playerStartX, game.world.height - playerStartY, 'dude');
    game.camera.follow(player);
    
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.1;
    player.body.gravity.y = 200;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    player.animations.add('stunnedLeft', [0, 1], 10, true);
    player.animations.add('stunnedRight', [5, 6], 10, true);

	Game.playerMap = {};	
    Client.askNewPlayer(playerStartX, game.world.height - playerStartY, playerName, playerNameTextHeight, playerNameTextColor);

    cursors = game.input.keyboard.createCursorKeys();

    /*
    //create game timer and start it
    timertext = game.add.text(game.world.centerX, 50, 'Timer till safehouses closes:  ', { font: "32px Arial", fill: "#ffffff", align: "center" });
    timertext.anchor.setTo(0.5, 0.5);
    game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this); 
    //create safehouse text directions (SAFE/NOT SAFE)
    safeText = game.add.text(game.world.centerX, 100, '', { font: "32px Arial", fill: "#000000", align: "center" });
    safeText.anchor.setTo(0.5, 0.5);    
    */
    playerNameText = game.add.text(player.body.x + 16, player.body.y + 24 - playerNameTextHeight, playerName, { font: "12px Arial", fill: "#" + playerNameTextColor, align: "center" });
    playerNameText.anchor.setTo(0.5, 0.5);  
    //showSafe();
      
    setInterval(sendPosition, 10);
};

Game.render = function() {
    //game.debug.text('id that got hit ' + debugVar, 100, 380 )
    //game.debug.text('id of this player ' + recordedID, 100, 390 )
    //game.debug.text('time until you can hit ' + hitTimer.ms , 100, 400 )
}

Game.update = function() {

    game.physics.arcade.collide(player, platforms);

    if (playerLives > 0) {
        if (stunnedTimer.ms == 0) {
            player.body.velocity.x = 0;
            if (cursors.left.isDown)
            {
                playerFacingDir = -1;
                player.body.velocity.x = -150;
                player.animations.play('left');
            }
            else if (cursors.right.isDown)
            {
                playerFacingDir = 1;
                player.body.velocity.x = 150;
                player.animations.play('right');
            }
            else
            {
                playerFacingDir = 0;
                player.animations.stop();
                player.frame = 4;
            }
            
            if (this.spaceKey.isDown) {
                
                if (hitTimer.ms > 200) {
                    hitTimer.stop();
                    hitTimer.start();

                    //check if other players are in range of hitting
                    for(var i = 0; i < Object.keys(Game.playerMap).length; i++){
                        if (playerFacingDir == 1) {
                            if (Game.playerMap[i].x < (player.body.x + 64) && Game.playerMap[i].x > (player.body.x + 16) && Game.playerMap[i].y < (player.body.y + 24) && Game.playerMap[i].y > (player.body.y - 24)) {
                                //send player hit
                                Client.hitPlayer(i, 3);
                            }
                        } else if (playerFacingDir == -1) {
                            if (Game.playerMap[i].x > (player.body.x - 64) && Game.playerMap[i].x < (player.body.x - 16) && Game.playerMap[i].y < (player.body.y + 24) && Game.playerMap[i].y > (player.body.y - 24)) {
                                //send player hit
                                Client.hitPlayer(i, 2);
                            }
                        }
                    }
                }
            }

            if (cursors.up.isDown && player.body.touching.down)
            {
                player.body.velocity.y = -350;
            }
        }//end of stun
        else { //play stun animation

            if (playerHitFrom == 2) {
                if (hurlPlayerOnce == 0) {
                    player.body.velocity.x = -200;
                    player.body.velocity.y = -200;
                    hurlPlayerOnce = 1;
                }

                playerFacingDir = 2;
                player.animations.play('stunnedLeft');
            } else if (playerHitFrom == 3) {
                if (hurlPlayerOnce == 0) {
                    player.body.velocity.x = 200;
                    player.body.velocity.y = -200;
                    hurlPlayerOnce = 1;
                }

                playerFacingDir = 3;
                player.animations.play('stunnedRight');
            }

            if (stunnedTimer.ms > 2000) {
                hurlPlayerOnce = 0;
                stunnedTimer.stop();
                playerHitFrom = 0;
            }
        }
    }
    //Client.sendPos(player.body.x,player.body.y, recordedID, playerFacingDir);
    
    //center text on sprite
    playerNameText.x = player.body.x + (player.width / 2);
    playerNameText.y = player.body.y + (player.height / 2) - playerNameTextHeight;
}

function whichPlayerGotHit(id, hitFrom) {
    debugVar = id;
    if (id == recordedID && stunnedTimer.ms == 0) {
        playerHitFrom = hitFrom;
        playerLives--;
        if (playerLives < 0) {
            playerLives = 0;
        }
        hearts[playerLives].alpha = 0;

        if (playerLives == 0) {
            
            //play death animation
            //put tombstone at death site
        } else {
            //play stunned animation and prevent player from moving for a small amount of time
            stunnedTimer.start();
        }
    }
}

function sendPosition() {
    Client.sendPos(player.body.x,player.body.y, recordedID, playerFacingDir);
}

Game.addnewID = function(id){
		recordedID = id;
}

Game.addNewPlayer = function(id,x,y, playerNameIn, playerNameTextHeightIn, playerNameTextColorIn){

    Game.playerMap[id] = game.add.sprite(x, game.world.height - y, 'dude');
    Game.playerMap[id].animations.add('left', [0, 1, 2, 3], 10, true);
    Game.playerMap[id].animations.add('right', [5, 6, 7, 8], 10, true);
    Game.playerMap[id].animations.add('stunnedLeft', [0, 1], 10, true);
    Game.playerMap[id].animations.add('stunnedRight', [5, 6], 10, true);
    Game.playerMap[id].textHeight = playerNameTextHeightIn;
    Game.playerMap[id].lives = 5;
    Game.playerMap[id].alpha = 0.5;
    Game.playerMap[id].text = game.add.text(x + 16, game.world.height - y + 24 - playerNameTextHeightIn, playerNameIn, { font: "12px Arial", fill: "#" + playerNameTextColorIn, align: "center" });
    Game.playerMap[id].text.anchor.setTo(0.5, 0.5);  
};

Game.movePlayer = function(id,x,y, face){
	
	if (id == recordedID) {
        return; }

    if (face == -1) {
        Game.playerMap[id].animations.play('left');
    } else if (face == 1) {
        Game.playerMap[id].animations.play('right');
    } else if (face == 2) {
        Game.playerMap[id].animations.play('stunnedLeft');
    } else if (face == 3) {
        Game.playerMap[id].animations.play('stunnedRight');
    } else {
        Game.playerMap[id].animations.stop();
        Game.playerMap[id].frame = 4;
    }

    Game.playerMap[id].x = x;
    Game.playerMap[id].y = y;

    var playertext = Game.playerMap[id].text;
    var distance = Phaser.Math.distance(playertext.x,playertext.y,x,y);
    var tween = game.add.tween(playertext);
    var duration = distance/10;
    tween.to({x:x+16,y:y+24-Game.playerMap[id].textHeight}, duration);
    tween.start();

    var player = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x,player.y,x,y);
    var tween = game.add.tween(player);
    var duration = distance/10;
    tween.to({x:x,y:y}, duration);
    tween.start();
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    Game.playerMap[id].text.destroy();
    delete Game.playerMap[id];
};