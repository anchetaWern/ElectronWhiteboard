var express = require("express");
var bodyParser = require("body-parser");
var Pusher = require("pusher");
const cors = require("cors");
const Chatkit = require("@pusher/chatkit-server");

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

const chatkit = new Chatkit.default({
  instanceLocator: `v1:us1:${process.env.CHATKIT_INSTANCE_ID}`,
  key: process.env.CHATKIT_SECRET_KEY
});

var channels = [];

const createUser = async (user_id, username) => {
  try {
    await chatkit.createUser({
      id: user_id,
      name: username
    });
  } catch (err) {
    if (err.error === "services/chatkit/user_already_exists") {
      console.log("user already exists: ", err);
    } else {
      console.log("error occurred: ", err);
    }
  }
};

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

app.post("/login", async (req, res) => {
  const { channel, user_id, username } = req.body;

  var channel_index = channels.findIndex(c => c.name === channel);
  if (channel_index === -1) {
    console.log("channel not yet created, so creating one now...");

    await createUser(user_id, username);

    try {
      const room = await chatkit.createRoom({
        creatorId: user_id,
        name: channel
      });

      channels.push({
        id: room.id.toString(),
        name: channel,
        users: [
          {
            id: user_id,
            name: username
          }
        ]
      });

      return res.json({
        room_id: room.id.toString()
      });
    } catch (err) {
      console.log("error creating room: ", err);
    }
  } else {
    const user_index = channels[channel_index].users.findIndex(
      usr => usr.name === username
    );
    if (user_index === -1) {
      console.log("channel created, so pushing user...");

      await createUser(user_id, username);

      channels[channel_index].users.push({
        id: user_id,
        name: username
      });

      return res.json({
        room_id: channels[channel_index]["id"].toString()
      });
    }

    return res.json({
      room_id: channels[channel_index].id
    });
  }

  return res.status(500).send("invalid user");
});

var port = process.env.PORT || 5000;
app.listen(port);