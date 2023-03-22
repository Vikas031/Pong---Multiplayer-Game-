const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var path = require('path');

//app.use(express.static(__dirname)); // Current directory is root
app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/', (req, res) => {
    res.sendFile( path.join( __dirname, 'public', '/html/index.html' ));
});

let room_id,creator_name,joinee_name;
io.on('connection', (socket) => {
   
  socket.on('create-room',(message,name)=>{
    room_id=message;
    creator_name=name;
  })

  socket.on("start-game",(message,creator_room_id,request_id,name)=>{
    if(creator_room_id!=room_id)
    {
        // yaad rakhna ye abhi karna he
    }else{
        joinee_name=name;
        io.emit("receive-ids",creator_room_id,request_id,creator_name,joinee_name);
    }
    })

    socket.on("set-ball-track",(x,y)=>{
        socket.broadcast.emit("get-ball-track",x,y);
    })

    socket.on("key-pressed",(key)=>{
        socket.broadcast.emit("opponent-action-listener",key);
  })
  socket.on('left-score',(val)=>{
    socket.broadcast.emit('set-left-score',val);
    })

    socket.on('right-score',(val)=>{
    socket.broadcast.emit('set-right-score',val);
    })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});