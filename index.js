const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const fileUpload = require("express-fileupload");
const cors = require('cors');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("ChathubDB on MongoDb Alas has been connected"))
  .catch(error => console.error("MongoDB connection error:", error));

const app = express();
const server = http.createServer(app);
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


server.listen(port, () => console.log(`Server is listening at PORT:${port}`));






