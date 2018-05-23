const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
const {generateMessage} = require('./utils/message');
const {generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

var app = express();
//When we call app.listen we are literally calling this method
var server = http.createServer(app);
//io is our websockets server
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

//on registers an event listener
//socket is the individual user's socket, as opposed to all the users connected to the server
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }
    //join method allows us to join specific rooms
    socket.join(params.room);
    //we remove the user from any other potential rooms he was in
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
      //When we call callback, we are aknowledging everything was correct, telling the front end.
      callback();
    }
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
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
