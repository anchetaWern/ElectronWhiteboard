var express = require("express");
var bodyParser = require("body-parser");
var Pusher = require("pusher");
const cors = require("cors");

require("dotenv").config();

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

var pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.APP_KEY,
  secret: process.env.APP_SECRET,
  cluster: process.env.APP_CLUSTER
});

app.get("/", (req, res) => {
  res.send("all is well...");
});

app.post("/pusher/auth", (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  console.log("authing...");
  var auth = pusher.authenticate(socketId, channel);
  return res.send(auth);
});

var port = process.env.PORT || 5000;
app.listen(port);