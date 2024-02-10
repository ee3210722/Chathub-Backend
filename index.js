const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("ChathubDB on MongoDb Alas has been connected"))
  .catch(error => console.error("MongoDB connection error:", error));

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 9000;

const cors = require('cors');
const allowedOrigins = ['http://localhost:3000']; // Add your frontend URLs
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//  Route handlers
const userRoutes = require('./routes/userRoute');
app.use('/', userRoutes);


server.listen(port, () => console.log(`Server is listening at PORT:${port}`));






