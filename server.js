const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
users = [];
connections =[];

server.listen(process.env.port || 3000);
console.log('Server running on port 3000')
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log("Connected :%s sockets connected", connections.length)

        //Disconnect
    socket.on('disconnect', function(data){
        if(!socket.username)
        return
        users.splice(users.indexOf(socket.username), 1);
        updateUsername();
        connections.splice(connections.indexOf(socket), 1)
        console.log(socket.username,' Has been disconnected: %s sockets connected', connections.length)    
    });

    //send Message
    socket.on('send message', function(data){
        io.sockets.emit('new message', {msg : data, user : socket.username})
    })

    //new user
    socket.on('new user', function(data, callback){
        if(!data) { callback(false)}
        else{
            callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsername();
        }
        
    })

    function updateUsername(){
        io.sockets.emit('get users', users);
    }
});

