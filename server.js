var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var firstPlayerJoined = 0;
var timerlength = 10;
var countdownTimer = timerlength;
var totalNumberOfPlayers = 0;
var whichSafeHouseIsSafe = 0;
var PlayerBase = [];

setInterval(updateTimer, 1000);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.lastPlayderID = 0;

server.listen(process.env.PORT || 8080,function(){
    console.log('Listening on '+server.address().port);
});

io.on('connection',function(socket){    
        
    socket.on('newplayer',function(data){
        totalNumberOfPlayers++;
        
        socket.player = {id: server.lastPlayderID++,x: -50,y: -50, playerNameIn:data.playerNameOut, playerNameTextColorIn:data.playerNameTextColorOut};
        PlayerBase[server.lastPlayderID - 1] = socket.player;
        PlayerBase[server.lastPlayderID - 1].lives = 0;

        socket.emit('allplayers',getAllPlayers()); //send newly connected player the list of already connected players
        console.log('new player with id: ' + socket.player.id);
        socket.emit('setID', socket.player); //send just to client
        socket.broadcast.emit('newplayer',socket.player); //send message to all connected sockets except socket that triggered new connection

        socket.on('hitPlayer', function(data) {
            //console.log('player ' + data.id + ' got hit!');
            PlayerBase[data.id].lives--;

            var firstAlivePlayer = -1;
            var secondAlivePlayer = -1;
    
            console.log('playerbase length ' + PlayerBase.length);
            for (var i = 0; i < PlayerBase.length; i++) {
                console.log('player id: ' + i + ' has lives: ' + PlayerBase[i].lives);
                if (PlayerBase[i].lives > 0) {
                    if (firstAlivePlayer == -1) {
                        firstAlivePlayer = i;
                        continue;
                    }
    
                    if (firstAlivePlayer > -1) {
                        secondAlivePlayer = i;
                    }
                }
            }

            if (firstAlivePlayer > -1 && secondAlivePlayer == -1) {
                console.log('reset round with winner: ' + PlayerBase[firstAlivePlayer].playerNameIn);
                for (var i = 0; i < PlayerBase.length; i++) {
                    PlayerBase[i].lives = 0;
                }
                
                socket.emit('resetRound', PlayerBase[firstAlivePlayer].playerNameIn); //send just to client
                socket.broadcast.emit('resetRound', PlayerBase[firstAlivePlayer].playerNameIn);
            } else {
                socket.broadcast.emit('playerGotHit',data.id, data.hitFrom); //send message to all connected sockets except socket that triggered new connection                            
            }
        });

        socket.on('sendPos',function(data){
            //console.log('playermoved: ' + data.id + ' lives sent: ' + data.thisPlayerLives);
            //console.log('accepted player' + socket.player.id);
            //console.log(', id: ' + data.id + ' face: ' + data.facingDir);
            PlayerBase[data.id].x = data.x;
            PlayerBase[data.id].y = data.y;
            PlayerBase[data.id].facingDir = data.facingDir;
            PlayerBase[data.id].lives = data.thisPlayerLives;

            socket.player.x = data.x;
            socket.player.y = data.y;
            socket.player.id = data.id;
            socket.player.facingDir = data.facingDir;
            socket.player.lives = data.thisPlayerLives;
            io.emit('move',socket.player);
        });

        socket.on('disconnect',function(){
            totalNumberOfPlayers--;
            io.emit('remove',socket.player.id);
            PlayerBase[socket.player.id].x = -50;
            PlayerBase[socket.player.id].y = -50;
            PlayerBase[socket.player.id].lives = 0;

            if (totalNumberOfPlayers == 0) {
                PlayerBase = [];
                server.lastPlayderID = 0;
            }
        });
    });

});

function updateTimer() {
    //console.log(countdownTimer);
    countdownTimer--;
    if (countdownTimer < 0) {
        countdownTimer = timerlength;
        if (whichSafeHouseIsSafe) {
            whichSafeHouseIsSafe = 0;
        } else if (whichSafeHouseIsSafe == 0) {
            whichSafeHouseIsSafe = 1;
        }
    }
}

function getAllPlayers(){
    //ar players = [];
    //Object.keys(io.sockets.connected).forEach(function(socketID){
    //    var player = io.sockets.connected[socketID].player;
    //    if(player) players.push(player);
    //});
    return PlayerBase;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
