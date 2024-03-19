const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const cors = require('cors');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("ChathubDB on MongoDb Alas has been connected"))
  .catch(error => console.error("MongoDB connection error:", error));

const app = express();
const port = process.env.PORT || 9000;

app.use(fileUpload({useTempFiles: true}))
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route handlers
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);
const messageRoutes = require('./routes/messageRoutes');
app.use('/api/message', messageRoutes);


const server = app.listen(port, () => console.log(`Server is listening at PORT:${port}`));

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000"
  }
})


io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    console.log("userId: ", userData._id);
    socket.join(userData._id);
    socket.emit("connected");
  })

  socket.on("join chat", (chatId) => {
    console.log("user joined the chat: ", chatId);
    socket.join(chatId);
  })

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");

    console.log("new message event is triggered by the client ");
    console.log("chat.users: ", chat.users);

    chat.users.forEach((user)=> {
      if (user._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    })
  })

})






