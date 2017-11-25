/**
 * Created by Jerome on 03-03-16.
 */
//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures
var game = new Phaser.Game(800, 600, Phaser.CANVAS, document.getElementById('game'));
game.state.add('Game',Game);
game.state.start('Game');