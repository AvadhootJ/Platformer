

var Client = {};
Client.socket = io.connect();

Client.askNewPlayer = function(x, y, playerNameOut, playerNameTextHeightOut, playerNameTextColorOut){
    Client.socket.emit('newplayer', {x:x, y:y, playerNameOut:playerNameOut, playerNameTextHeightOut:playerNameTextHeightOut, playerNameTextColorOut:playerNameTextColorOut});
};

Client.hitPlayer = function(id, hitFrom) {
    Client.socket.emit('hitPlayer', {id:id, hitFrom:hitFrom});
};

Client.sendPos = function(x,y, id, facingDir){
  Client.socket.emit('sendPos',{x:x,y:y, id:id, facingDir:facingDir});
};

Client.socket.on('setID',function(data){
    Game.addnewID(data.id);
});

Client.socket.on('playerGotHit', function(id, hitFrom){
    whichPlayerGotHit(id, hitFrom);
});

Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id,data.x,data.y, data.playerNameIn, data.playerNameTextHeightIn, data.playerNameTextColorIn);
});

Client.socket.on('allplayers',function(data){

    for(var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y, data[i].playerNameIn, data[i].playerNameTextHeightIn, data[i].playerNameTextColorIn);
    }

    Client.socket.on('move',function(data){
        Game.movePlayer(data.id,data.x,data.y, data.facingDir);
    });

    Client.socket.on('remove',function(id){
        Game.removePlayer(id);
    });
});


