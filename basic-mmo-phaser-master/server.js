var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var firstPlayerJoined = 0;
var timerlength = 10;
var countdownTimer = timerlength;
var totalNumberOfPlayers = 0;
var whichSafeHouseIsSafe = 0;

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
        //if very first player, start countdown for very first time
        if (totalNumberOfPlayers > 0 && firstPlayerJoined == 0) {
            //console.log('very first player joined');
            countdownTimer = timerlength;
            firstPlayerJoined = 1;
        } else {
            //console.log('a new player joined');            
        }

        socket.player = {id: server.lastPlayderID++,x: -50,y: -50, playerNameIn:data.playerNameOut, playerNameTextHeightIn:data.playerNameTextHeightOut, playerNameTextColorIn:data.playerNameTextColorOut};

        socket.emit('getTimerFromServer', countdownTimer); //send newly connected player current time
        socket.emit('getWhichSafeHouseFromServer', whichSafeHouseIsSafe);
        socket.emit('allplayers',getAllPlayers()); //send newly connected player the list of already connected players
        socket.emit('setID', socket.player);
        socket.broadcast.emit('newplayer',socket.player); //send message to all connected sockets except socket that triggered new connection
        
        socket.on('sendPos',function(data){
			//console.log('accepted player' + socket.player.id);
            socket.player.x = data.x;
            socket.player.y = data.y;
            io.emit('move',socket.player);
        });

        socket.on('disconnect',function(){
            io.emit('remove',socket.player.id);
            totalNumberOfPlayers--;
            //console.log('player left game');
            if (totalNumberOfPlayers == 0 && firstPlayerJoined == 1) {
                //console.log('last player has left the game');
                countdownTimer = timerlength;
                firstPlayerJoined = 0;
            }
        });
    });

    //socket.on('test',function(){
    //    console.log('test received');
    //});
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
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
