const express = require("express");
const mongoose = require("mongoose");
const http = require("http");

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("ChathubDB on MongoDb Alas has been connected"))
  .catch(error => console.error("MongoDB connection error:", error));

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 9000;

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//  Route handlers
const userRoutes = require('./routes/userRoute');
app.use('/', userRoutes);


server.listen(port, () => console.log(`Server is listening at PORT:${port}`));


// require('dotenv').config();
// const session = require('express-session');
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: true,
//     saveUninitialized: true
// }));

// const path = require('path');
// app.set('view engine', 'ejs');
// app.set('views', path.resolve("./views"));
// app.use(express.static(path.resolve("./public")));
// app.use(express.static(path.join(__dirname, 'public')));

