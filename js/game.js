
var Game = {};
var hearts = {};
var sHearts = {};
var platforms;
var cursors;
var spacekey;
var player;
var playerStartX = 600;
var playerStartY = 385;
var recordedID = 0;
var playerLives = 5;
var hitTimer = 0;
var stunnedTimer = 0;
var resetTimer = 0;
var playerHitFrom = 0;
var hurlPlayerOnce = 0;

var playerNameText = 0;
var playerNameTextColor = randomInt(0, 999999);
var playerFacingDir = 0;
var playerCurrentFacing = 1;
var playerIsAttacking = 0;
var playerIsOnGround = 0;
var playerJumped = 0;
var jumpLeftAnim = 0;
var playJumpLeftIdleAnim = 0;
var playJumpLeftAnimOnce = 0;
var jumpRightAnim = 0;
var playJumpRightIdleAnim = 0;
var playJumpRightAnimOnce = 0;
var timerSlideRight = 0;
var slideRight = 0;
var timerSlideLeft = 0;
var slideLeft = 0;
var playDeadOnce = 0;
var lastPlayerFacingDir = 0;
var debugVar = 0;
var playerMoved = 0;
var playerMovedLivesSent = 0;
var jumpVelocity = -400;
var moveVelocity = 250;
var slideVelocity = 3;
var gravity = 500;
var attackSpeed = 400;
var attackFrameRate = 15;
var attackJumpFrameRate = 19;
var stunnedTime = 1000;
var winnerText = 0;

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.spritesheet('dude', 'assets/ninjaboy.png', 536, 522);
    game.load.image('heart', 'assets/heart.png');
    game.load.image('bush1', 'assets/bush1.png');
    game.load.image('bush2', 'assets/bush2.png');
    game.load.image('bush3', 'assets/bush3.png');
    game.load.image('bush4', 'assets/bush4.png');
    game.load.image('crate', 'assets/Crate.png');
    game.load.audio('backgroundmusic', 'assets/FantasyGameBackground.mp3');
    game.load.image('cloud2', 'assets/cloud2.png');
    game.load.image('cloud1', 'assets/cloud1.png');
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

function createLevel() {
    //Background music
    var backgroundmusic  = game.add.audio('backgroundmusic');
    backgroundmusic.loop = true;
    backgroundmusic.play();

    platforms = game.add.group();
    platforms.enableBody = true;

    game.time.events.repeat(Phaser.Timer.SECOND * 10, 1, createSmallCloud, this);    
    game.time.events.repeat(Phaser.Timer.SECOND * 20, 3, createMediumCloud, this);      
    game.time.events.repeat(Phaser.Timer.SECOND * 40, 40, createSmallCloud, this);
    game.time.events.repeat(Phaser.Timer.SECOND * 40, 40, createMediumCloud, this);

    //Bottom tree
    var darktree = game.add.sprite(500, game.world.height - 180, 'darktree');
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

    var cloud = game.add.sprite(0, 10, 'cloud2');
    game.physics.enable(cloud, Phaser.Physics.ARCADE);
    cloud.scale.setTo(0.2, 0.2);
    cloud.body.velocity.x=30;
 
    var cloud = game.add.sprite(0, 10, 'cloud1');
    game.physics.enable(cloud, Phaser.Physics.ARCADE);
    cloud.scale.setTo(0.3, 0.3);
    cloud.body.velocity.x=50;
 
    var cloud = game.add.sprite(-3000, -12, 'cloud1');
    game.physics.enable(cloud, Phaser.Physics.ARCADE);
    cloud.scale.setTo(0.3, 0.3);
    cloud.body.velocity.x=50;
 
    var cloud = game.add.sprite(-6000, 0, 'cloud1');
    game.physics.enable(cloud, Phaser.Physics.ARCADE);
    cloud.scale.setTo(0.3, 0.3);
    cloud.body.velocity.x=60;
}

function createMediumCloud() {
    
        var cloud = game.add.sprite(-50, 0, 'cloud2');
        game.physics.enable(cloud, Phaser.Physics.ARCADE);
        cloud.scale.setTo(0.2, 0.2);
        cloud.body.velocity.x=30;
}
    
function createSmallCloud() {
    

        var cloud = game.add.sprite(-100, 0, 'cloud2');
        game.physics.enable(cloud, Phaser.Physics.ARCADE);
        cloud.scale.setTo(0.1, 0.1);
        cloud.body.velocity.x=10;
    
}

Game.create = function(){
    
    //game.physics.startSystem(Phaser.Physics.P2JS);
    //game.physics.p2.gravity.y = gravity;
    //game.physics.p2.restitution = 0.8;
    game.world.setBounds(0, 0, 1300, 600);

    hitTimer = game.time.create(false);
    hitTimer.start();
    stunnedTimer = game.time.create(false);
    timerSlideRight = game.time.create(false);
    timerSlideRight.start();
    timerSlideLeft = game.time.create(false);
    timerSlideLeft.start();
    resetTimer = game.time.create(false);
    resetTimer.stop();

    //add space key 
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'niceforestbg');

    createLevel();

    player = game.add.sprite(playerStartX, game.world.height - playerStartY, 'dude');
    player.scale.setTo(0.15, 0.15);
    game.camera.follow(player);
    
    game.physics.arcade.enable(player);
    player.body.setSize(260, 430, 130, 40);
    //player.body.bounce.y = 0.1;
    player.body.gravity.y = gravity;
    player.body.collideWorldBounds = true;

    sHearts[0] = game.add.sprite(player.body.x-5, player.body.y - 10, 'heart'); 
    sHearts[0].scale.setTo(0.15, 0.15);
    sHearts[1] = game.add.sprite(player.body.x+5, player.body.y - 10, 'heart'); 
    sHearts[1].scale.setTo(0.15, 0.15);
    sHearts[2] = game.add.sprite(player.body.x+15, player.body.y - 10, 'heart'); 
    sHearts[2].scale.setTo(0.15, 0.15);
    sHearts[3] = game.add.sprite(player.body.x+25, player.body.y - 10, 'heart'); 
    sHearts[3].scale.setTo(0.15, 0.15);
    sHearts[4] = game.add.sprite(player.body.x+35, player.body.y - 10, 'heart'); 
    sHearts[4].scale.setTo(0.15, 0.15);
    
    player.animations.add('slideLeft', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
    player.animations.add('runLeft', [19, 18, 17, 16, 15, 14, 13, 12, 11, 10], 10, true);
    jumpAttackLeft = player.animations.add('jumpAttackLeft', [29, 28, 27, 26, 25, 24, 23, 22, 21, 20], 10, true);
    jumpLeftAnim = player.animations.add('jumpLeft', [39, 38, 37, 36, 35, 34, 33, 32, 31, 30], 10, false);
    player.animations.add('jumpLeftIdle', [30], 10, true);
    player.animations.add('idleLeft', [49, 48, 47, 46, 45, 44, 43, 42, 41, 40], 10, true);
    deadLeftAnim = player.animations.add('deadLeft', [59, 58, 57, 56, 55, 54, 53, 52, 51, 50], 10, false);
    attackLeft = player.animations.add('attackLeft', [66, 65, 64, 63, 62, 61, 60], 7, true);
    player.animations.add('stunnedLeft', [59], 10, true);
    player.animations.add('slideRight', [130, 131, 132, 133, 134, 135, 136, 137, 138, 139], 10, true);
    player.animations.add('runRight', [120, 121, 122, 123, 124, 125, 126, 127, 128, 129], 10, true);
    jumpAttackRight = player.animations.add('jumpAttackRight', [110, 111, 112, 113, 114, 115, 116, 117, 118, 119], 10, true);
    jumpRightAnim = player.animations.add('jumpRight', [100, 101, 102, 103, 104, 105, 106, 107, 108, 109], 10, false);
    player.animations.add('jumpRightIdle', [109], 10, true);
    player.animations.add('idleRight', [90, 91, 92, 93, 94, 95, 96, 97, 98, 99], 10, true);
    deadRightAnim = player.animations.add('deadRight', [80, 81, 82, 83, 84, 85, 86, 87, 88, 89], 10, false);
    attackRight = player.animations.add('attackRight', [73, 74, 75, 76, 77, 78, 79], 7, true);
    player.animations.add('stunnedRight', [80], 10, true);
    player.animations.add('angelWings', [140], 10, true);
    
    jumpAttackLeft.speed = attackJumpFrameRate;
    attackLeft.speed = attackFrameRate;
    jumpAttackRight.speed = attackJumpFrameRate;
    attackRight.speed = attackFrameRate;

	Game.playerMap = {};	
    Client.askNewPlayer(playerStartX, game.world.height - playerStartY, playerName, playerNameTextColor);

    cursors = game.input.keyboard.createCursorKeys();

    playerNameText = game.add.text(player.body.x + 16, player.body.y - 20, playerName, { font: "12px Arial", fill: "#" + playerNameTextColor, align: "center" });
    playerNameText.anchor.setTo(0.5, 0.5);  
    //showSafe();
      
    //create hearts in upper left of screen
    hearts[0] = game.add.sprite(10, 550, 'heart');    
    hearts[0].fixedToCamera = true;
    hearts[1] = game.add.sprite(70, 550, 'heart');
    hearts[1].fixedToCamera = true; 
    hearts[2] = game.add.sprite(130, 550, 'heart'); 
    hearts[2].fixedToCamera = true;
    hearts[3] = game.add.sprite(190, 550, 'heart'); 
    hearts[3].fixedToCamera = true;
    hearts[4] = game.add.sprite(250, 550, 'heart'); 
    hearts[4].fixedToCamera = true;

    //setInterval(sendPosition, 1);
};

Game.render = function() {
    /*
    game.debug.text('number of phantoms in game: ' + debugVar, 100, 380 );
    game.debug.text('id of this player ' + recordedID, 100, 390 );
    game.debug.text('time until you can hit ' + hitTimer.ms , 100, 400 );
    game.debug.text('player is on ground: ' + playerIsOnGround, 100, 410);
    game.debug.text('player jumpLeftComplete: ' + jumpLeftAnim.isFinished, 100, 420);
    game.debug.text('player jumped: ' + playerJumped, 100, 430);
    game.debug.text('player jumpLeftIdle: ' + playJumpLeftIdleAnim, 100, 440);
    game.debug.text('player timerslideright: ' + timerSlideRight.ms, 100, 450);
    game.debug.text('playermoved id: ' + playerMoved + ' lives sent: ' + playerMovedLivesSent, 100, 460);*/
}

Game.update = function() {

    game.physics.arcade.collide(player, platforms);

    if (resetTimer.ms > 5000) {
        winnerText.destroy();
        resetTimer.stop();
    }

    if (playerLives > 0 && resetTimer.ms == 0) {
        if (stunnedTimer.ms == 0) {
            if (hitTimer.ms > attackSpeed)
                playerIsAttacking = 0;
                
            if (slideRight == 1) {
                player.body.x += slideVelocity;
                playerFacingDir = 10;
                player.animations.play('slideRight');
                playerNameText.x = player.body.x + 16;
                playerNameText.y = player.body.y - 20;
                sHearts[0].x = player.body.x-5; sHearts[0].y = player.body.y - 10;
                sHearts[1].x = player.body.x+5; sHearts[1].y = player.body.y - 10;
                sHearts[2].x = player.body.x+15; sHearts[2].y = player.body.y - 10;
                sHearts[3].x = player.body.x+25; sHearts[3].y = player.body.y - 10;
                sHearts[4].x = player.body.x+35; sHearts[4].y = player.body.y - 10;
                sendPosition();
                if (timerSlideRight.ms > 500) {
                    slideRight = 0;
                }
                return;
            }

            if (slideLeft == 1) {
                player.body.x -= slideVelocity;
                playerFacingDir = 0;
                player.animations.play('slideLeft');
                playerNameText.x = player.body.x + 16;
                playerNameText.y = player.body.y - 20;
                sHearts[0].x = player.body.x-5; sHearts[0].y = player.body.y - 10;
                sHearts[1].x = player.body.x+5; sHearts[1].y = player.body.y - 10;
                sHearts[2].x = player.body.x+15; sHearts[2].y = player.body.y - 10;
                sHearts[3].x = player.body.x+25; sHearts[3].y = player.body.y - 10;
                sHearts[4].x = player.body.x+35; sHearts[4].y = player.body.y - 10;
                sendPosition();
                if (timerSlideLeft.ms > 500) {
                    slideLeft = 0;
                }
                return;
            }

            player.body.velocity.x = 0;
            if (cursors.left.isDown)
            {
                playerCurrentFacing = -1;
                if (timerSlideLeft.ms > 50 && timerSlideLeft.ms < 100 && lastPlayerFacingDir == playerCurrentFacing) {
                    slideLeft = 1;
                    timerSlideLeft.stop();
                    timerSlideLeft.start();
                }

                if (slideLeft == 0) {
                    timerSlideLeft.stop();
                    timerSlideLeft.start();
                }

                playJumpRightIdleAnim = 1;
                playerCurrentFacing = -1;
                if (playerIsAttacking == 1 && playerIsOnGround == 1)
                    player.body.velocity.x = 0;
                else
                    player.body.velocity.x = -moveVelocity;
                if (playerIsAttacking == 0 && playerIsOnGround == 1) {
                    playerFacingDir = 1;
                    player.animations.play('runLeft');
                }
                else if (playerIsAttacking == 0 && playerIsOnGround == 0) { //if player is not on ground
                    if (playJumpLeftIdleAnim == 0) {
                        if (playJumpLeftAnimOnce == 0) {
                            playerFacingDir = 3;
                            player.animations.play('jumpLeft');
                            playJumpLeftAnimOnce = 1;
                        }
                    }
                    if (playJumpLeftIdleAnim == 1) {
                        playerFacingDir = 4;
                        player.animations.play('jumpLeftIdle')
                    }
                    if (jumpLeftAnim.isFinished)
                        playJumpLeftIdleAnim = 1;
                }
            }
            else if (cursors.right.isDown)
            {
                playerCurrentFacing = 1;
                if (timerSlideRight.ms > 50 && timerSlideRight.ms < 100 && lastPlayerFacingDir == playerCurrentFacing) {
                    slideRight = 1;
                    timerSlideRight.stop();
                    timerSlideRight.start();
                }

                if (slideRight == 0) {
                    timerSlideRight.stop();
                    timerSlideRight.start();
                }

                playJumpLeftIdleAnim = 1;
                playerCurrentFacing = 1;
                if (playerIsAttacking == 1 && playerIsOnGround == 1)
                    player.body.velocity.x = 0;
                else
                    player.body.velocity.x = moveVelocity;
                if (playerIsAttacking == 0 && playerIsOnGround == 1) {
                    playerFacingDir = 11;
                    player.animations.play('runRight');
                }
                else if (playerIsAttacking == 0 && playerIsOnGround == 0) { //if player is not on ground
                    if (playJumpRightIdleAnim == 0) {
                        if (playJumpRightAnimOnce == 0) {
                            playerFacingDir = 13;
                            player.animations.play('jumpRight');
                            playJumpRightAnimOnce = 1;
                        }
                    }
                    if (playJumpRightIdleAnim == 1) {
                        playerFacingDir = 14;
                        player.animations.play('jumpRightIdle')
                    }
                    if (jumpRightAnim.isFinished)
                        playJumpRightIdleAnim = 1;
                }

                if (cursors.up.isDown && player.body.touching.down)
                    player.body.velocity.x = 0;
            }
            else
            {
                if (playerCurrentFacing == -1) {
                    if (playerIsAttacking == 0) {
                        playerFacingDir = 5;
                        player.animations.play('idleLeft');
                    }
                } else if (playerCurrentFacing == 1) {
                    if (playerIsAttacking == 0) {
                        playerFacingDir = 15;
                        player.animations.play('idleRight');
                    }
                }
            }
            
            if (this.spaceKey.isDown) {
                
                if (hitTimer.ms > attackSpeed) {
                    hitTimer.stop();
                    hitTimer.start();

                    playerIsAttacking = 1;
                    if (playerCurrentFacing == -1 && playerIsOnGround == 1) {
                        playerFacingDir = 6;
                        player.animations.play('attackLeft');
                    } else if (playerCurrentFacing == 1 && playerIsOnGround == 1) {
                        playerFacingDir = 16;
                        player.animations.play('attackRight'); 
                    } else if (playerCurrentFacing == -1 && playerIsOnGround == 0) {
                        playerFacingDir = 2;
                        player.animations.play('jumpAttackLeft');
                    } else if (playerCurrentFacing == 1 && playerIsOnGround == 0) {
                        playerFacingDir = 12;
                        player.animations.play('jumpAttackRight');
                    }

                    //check if other players are in range of hitting
                    for(var i = 0; i < Object.keys(Game.playerMap).length; i++){
                        if (playerCurrentFacing == 1) {
                            if (Game.playerMap[i].x < (player.body.x + 40) && Game.playerMap[i].x > (player.body.x + 10) && Game.playerMap[i].y < (player.body.y + 20) && Game.playerMap[i].y > (player.body.y - 20)) {
                                //send player hit
                                Client.hitPlayer(i, 3);
                            }
                        } else if (playerCurrentFacing == -1) {
                            if (Game.playerMap[i].x > (player.body.x - 90) && Game.playerMap[i].x < (player.body.x - 10) && Game.playerMap[i].y < (player.body.y + 20) && Game.playerMap[i].y > (player.body.y - 20)) {
                                //send player hit
                                Client.hitPlayer(i, 2);
                            }
                        }
                    }
                }
            }

            if (cursors.up.isDown && player.body.touching.down)
            {
                if (playerIsAttacking == 0) {
                    player.body.velocity.y = jumpVelocity;
                    playerIsOnGround = 0;
                    playerJumped = 1;
                    playJumpRightIdleAnim = 0;
                    playJumpLeftIdleAnim = 0;
                }
            } else if (player.body.touching.down) {
                playerIsOnGround = 1;
                playerJumped = 0;
                playJumpLeftIdleAnim = 0;
                playJumpLeftAnimOnce = 0;
                playJumpRightIdleAnim = 0;
                playJumpRightAnimOnce = 0;
            }
        }//end of stun
        else { //play stun animation

            if (playerHitFrom == 2) {
                if (hurlPlayerOnce == 0) {
                    player.body.velocity.x = -300;
                    player.body.velocity.y = -300;
                    hurlPlayerOnce = 1;
                }

                playerFacingDir = 7;
                player.animations.play('stunnedLeft');
            } else if (playerHitFrom == 3) {
                if (hurlPlayerOnce == 0) {
                    player.body.velocity.x = 300;
                    player.body.velocity.y = -300;
                    hurlPlayerOnce = 1;
                }

                playerFacingDir = 17;
                player.animations.play('stunnedRight');
            }

            if (stunnedTimer.ms > stunnedTime) {
                hurlPlayerOnce = 0;
                stunnedTimer.stop();
                playerHitFrom = 0;
            }
        }
    } else {
        player.body.velocity.x = 0;
        //play dead animation once
        if (playDeadOnce == 0) {
            if (playerCurrentFacing = -1) {
                playerFacingDir = 8;
                player.animations.play('deadLeft');
            }
            else {
                playerFacingDir = 18;
                player.animations.play('deadRight');
            }
            playDeadOnce = 1;
        }

        /*
        if (playerCurrentFacing == 1 && deadRightAnim.isFinished) {
            playerFacingDir = 99;
            player.animations.play('angelWings');
        } else if (playerCurrentFacing == -1 && deadLeftAnim.isFinished) {
            playerFacingDir = 99;
            player.animations.play('angelWings');
        }*/
        playerFacingDir = 99;
        player.animations.play('angelWings');
    
    }
    
    //center text on sprite
    playerNameText.x = player.body.x + 16;
    playerNameText.y = player.body.y - 20;
    sHearts[0].x = player.body.x-5; sHearts[0].y = player.body.y - 10;
    sHearts[1].x = player.body.x+5; sHearts[1].y = player.body.y - 10;
    sHearts[2].x = player.body.x+15; sHearts[2].y = player.body.y - 10;
    sHearts[3].x = player.body.x+25; sHearts[3].y = player.body.y - 10;
    sHearts[4].x = player.body.x+35; sHearts[4].y = player.body.y - 10;

    for (var i = playerLives; i < 5; i++)
        sHearts[i].alpha = 0;
    for (var n = playerLives; n < 5; n++)
        hearts[n].alpha = 0;

    debugVar = Object.keys(Game.playerMap).length;
    sendPosition();
}

function whichPlayerGotHit(id, hitFrom) {
    //debugVar = id;
    if (id == recordedID && stunnedTimer.ms == 0) {
        playerHitFrom = hitFrom;
        playerLives--;
        if (playerLives < 0) {
            playerLives = 0;
        }
        //hearts[playerLives].alpha = 0;
        stunnedTimer.start();
    }
}

function resetRound(winnerName) {
    //debugVar = winnerName;
    //player.body.x = 100;
    //player.body.y = 100;
    
    playerLives = 5;
    playerFacingDir = 99;
    playDeadOnce = 1;
    //Client.sendPos(player.body.x - 20,player.body.y - 5, recordedID, playerFacingDir, playerLives);

    for (var i = 0; i < 5; i++)
        sHearts[i].alpha = 100;
    for (var n = 0; n < 5; n++)
        hearts[n].alpha = 100;

    winnerText = this.game.add.text(game.camera.width / 2, game.camera.height / 2, "player " + winnerName + " survived the longest!", {font: "30px Arial", fill: "#ffffff", stroke: '#000000', strokeThickness: 3});
    winnerText.anchor.setTo(0.5, 0.5);
    winnerText.fixedToCamera = true;        

    resetTimer.stop();
    resetTimer.start();
}

function sendPosition() {
    lastPlayerFacingDir = playerCurrentFacing;
    Client.sendPos(player.body.x - 20,player.body.y - 5, recordedID, playerFacingDir, playerLives);
}

Game.addnewID = function(id){
		recordedID = id;
}

Game.addNewPlayer = function(id,x,y, playerNameIn, playerNameTextColorIn){

    Game.playerMap[id] = game.add.sprite(x, game.world.height - y, 'dude');
    Game.playerMap[id].scale.setTo(0.15, 0.15);
    Game.playerMap[id].hearts = {};
    Game.playerMap[id].hearts[0] = game.add.sprite(x+15, game.world.height - y - 5, 'heart'); 
    Game.playerMap[id].hearts[0].scale.setTo(0.15, 0.15);
    Game.playerMap[id].hearts[1] = game.add.sprite(x+25, game.world.height - y - 5, 'heart'); 
    Game.playerMap[id].hearts[1].scale.setTo(0.15, 0.15);
    Game.playerMap[id].hearts[2] = game.add.sprite(x+35, game.world.height - y - 5, 'heart'); 
    Game.playerMap[id].hearts[2].scale.setTo(0.15, 0.15);
    Game.playerMap[id].hearts[3] = game.add.sprite(x+45, game.world.height - y - 5, 'heart'); 
    Game.playerMap[id].hearts[3].scale.setTo(0.15, 0.15);
    Game.playerMap[id].hearts[4] = game.add.sprite(x+55, game.world.height - y - 5, 'heart'); 
    Game.playerMap[id].hearts[4].scale.setTo(0.15, 0.15);
    Game.playerMap[id].animations.add('slideLeft', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
    Game.playerMap[id].animations.add('runLeft', [19, 18, 17, 16, 15, 14, 13, 12, 11, 10], 10, true);
    jumpAttackLeft = Game.playerMap[id].animations.add('jumpAttackLeft', [29, 28, 27, 26, 25, 24, 23, 22, 21, 20], 10, true);
    jumpLeftAnim = Game.playerMap[id].animations.add('jumpLeft', [39, 38, 37, 36, 35, 34, 33, 32, 31, 30], 10, false);
    Game.playerMap[id].animations.add('jumpLeftIdle', [30], 10, true);
    Game.playerMap[id].animations.add('idleLeft', [49, 48, 47, 46, 45, 44, 43, 42, 41, 40], 10, true);
    deadLeftAnim = Game.playerMap[id].animations.add('deadLeft', [59, 58, 57, 56, 55, 54, 53, 52, 51, 50], 10, false);
    attackLeft = Game.playerMap[id].animations.add('attackLeft', [66, 65, 64, 63, 62, 61, 60], 7, true);
    Game.playerMap[id].animations.add('stunnedLeft', [59], 10, true);
    Game.playerMap[id].animations.add('slideRight', [130, 131, 132, 133, 134, 135, 136, 137, 138, 139], 10, true);
    Game.playerMap[id].animations.add('runRight', [120, 121, 122, 123, 124, 125, 126, 127, 128, 129], 10, true);
    jumpAttackRight = Game.playerMap[id].animations.add('jumpAttackRight', [110, 111, 112, 113, 114, 115, 116, 117, 118, 119], 10, true);
    jumpRightAnim = Game.playerMap[id].animations.add('jumpRight', [100, 101, 102, 103, 104, 105, 106, 107, 108, 109], 10, false);
    Game.playerMap[id].animations.add('jumpRightIdle', [109], 10, true);
    Game.playerMap[id].animations.add('idleRight', [90, 91, 92, 93, 94, 95, 96, 97, 98, 99], 10, true);
    deadRightAnim = Game.playerMap[id].animations.add('deadRight', [80, 81, 82, 83, 84, 85, 86, 87, 88, 89], 10, false);
    attackRight = Game.playerMap[id].animations.add('attackRight', [73, 74, 75, 76, 77, 78, 79], 7, true);
    Game.playerMap[id].animations.add('stunnedRight', [80], 10, true);
    Game.playerMap[id].animations.add('angelWings', [140], 10, true);
    
    jumpAttackLeft.speed = attackJumpFrameRate;
    attackLeft.speed = attackFrameRate;
    jumpAttackRight.speed = attackJumpFrameRate;
    attackRight.speed = attackFrameRate;
    
    
    //Game.playerMap[id].textHeight = playerNameTextHeightIn;
    //Game.playerMap[id].lives = 5;
    //Game.playerMap[id].alpha = 0.5;
    Game.playerMap[id].text = game.add.text(x + 16, game.world.height - y + 24, playerNameIn, { font: "12px Arial", fill: "#" + playerNameTextColorIn, align: "center" });
    Game.playerMap[id].text.anchor.setTo(0.5, 0.5);  
};

Game.movePlayer = function(id,x,y,face,lives){
    
    //playerMoved = id;
    //playerMovedLivesSent = lives;

	if (id == recordedID) {
        return; }

    if (face == 0) {
        Game.playerMap[id].animations.play('slideLeft');
    } else if (face == 1) {
        Game.playerMap[id].animations.play('runLeft');
    }else if (face == 2) {
        Game.playerMap[id].animations.play('jumpAttackLeft');
    }else if (face == 3) {
        Game.playerMap[id].animations.play('jumpLeft');
    }else if (face == 4) {
        Game.playerMap[id].animations.play('jumpLeftIdle');
    }else if (face == 5) {
        Game.playerMap[id].animations.play('idleLeft');
    }else if (face == 6) {
        Game.playerMap[id].animations.play('attackLeft');
    }else if (face == 7) {
        Game.playerMap[id].animations.play('stunnedLeft');
    }else if (face == 8) {
        Game.playerMap[id].animations.play('deadLeft');
    }else if (face == 10) {
        Game.playerMap[id].animations.play('slideRight');
    }else if (face == 11) {
        Game.playerMap[id].animations.play('runRight');
    }else if (face == 12) {
        Game.playerMap[id].animations.play('jumpAttackRight');
    }else if (face == 13) {
        Game.playerMap[id].animations.play('jumpRight');
    }else if (face == 14) {
        Game.playerMap[id].animations.play('jumpRightIdle');
    }else if (face == 15) {
        Game.playerMap[id].animations.play('idleRight');
    }else if (face == 16) {
        Game.playerMap[id].animations.play('attackRight');
    }else if (face == 17) {
        Game.playerMap[id].animations.play('stunnedRight');
    }else if (face == 18) {
        Game.playerMap[id].animations.play('deadRight');
    }else if (face == 99) {
        Game.playerMap[id].animations.play('angelWings');
    }

    for (var i = 0; i < 5; i++)
        Game.playerMap[id].hearts[i].alpha = 100;
    for (var i = lives; i < 5; i++)
        Game.playerMap[id].hearts[i].alpha = 0;


    Game.playerMap[id].x = x;
    Game.playerMap[id].y = y;

    var playertext = Game.playerMap[id].text;
    var distance = Phaser.Math.distance(playertext.x,playertext.y,x,y);
    var tween = game.add.tween(playertext);
    var duration = distance/10;
    tween.to({x:x+25,y:y-15}, duration);
    tween.start();

    var tween = game.add.tween(Game.playerMap[id].hearts[0]);
    var duration = distance/10;
    tween.to({x:x+15,y:y-5}, duration);
    tween.start();
    var tween = game.add.tween(Game.playerMap[id].hearts[1]);
    var duration = distance/10;
    tween.to({x:x+25,y:y-5}, duration);
    tween.start();
    var tween = game.add.tween(Game.playerMap[id].hearts[2]);
    var duration = distance/10;
    tween.to({x:x+35,y:y-5}, duration);
    tween.start();
    var tween = game.add.tween(Game.playerMap[id].hearts[3]);
    var duration = distance/10;
    tween.to({x:x+45,y:y-5}, duration);
    tween.start();
    var tween = game.add.tween(Game.playerMap[id].hearts[4]);
    var duration = distance/10;
    tween.to({x:x+55,y:y-5}, duration);
    tween.start();

    var player = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x,player.y,x,y);
    var tween = game.add.tween(player);
    var duration = distance/10;
    tween.to({x:x,y:y}, duration);
    tween.start();
};

Game.removePlayer = function(id){
    Game.playerMap[id].alpha = 0;
    Game.playerMap[id].text.alpha = 0;
    Game.playerMap[id].hearts[0].alpha = 0;
    Game.playerMap[id].hearts[1].alpha = 0;
    Game.playerMap[id].hearts[2].alpha = 0;
    Game.playerMap[id].hearts[3].alpha = 0;
    Game.playerMap[id].hearts[4].alpha = 0;
    //Game.playerMap[id].destroy(hearts[0]);
    //Game.playerMap[id].destroy(hearts[1]);
    //Game.playerMap[id].destroy(hearts[2]);
    //Game.playerMap[id].destroy(hearts[3]);
    //Game.playerMap[id].destroy(hearts[4]);
    
    //Game.playerMap[id].destroy();
    //Game.playerMap[id].text.destroy();
    //delete Game.playerMap[id];
};