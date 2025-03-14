const config =  require('../config');
const express = require('express');
const mongoose = require('mongoose');
const noteRoutes = require('./routes/note.routes');
const healthRoutes = require('./routes/health.routes');
const bodyParser = require("body-parser");
const cors = require("cors");

const {MONGO_URI} = config;
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    status: true,
  });
});



app.use('/', noteRoutes);

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.Promise = global.Promise;

mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB Connection Error")
);


module.exports =  app ;