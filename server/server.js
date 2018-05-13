const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
const {generateMessage} = require('./utils/message');
const {generateLocationMessage} = require('./utils/message');
var app = express();
//When we call app.listen we are literally calling this method
var server = http.createServer(app);
//io is our websockets server
var io = socketIO(server);

app.use(express.static(publicPath));

//on registers an event listener
//socket is the individual user's socket, as opposed to all the users connected to the server
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    //When we call callback, we are aknowledging everything was correct, telling the front end.
    callback('This is from the server');
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

/*
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
}); */

//We have to configure express to work with http (a node module)
//Then, we will be able to add socketIO support
//We call server instead of app to configure socketio after. App and server are very close to each other
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
