const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", async (req, res) => {
  const event = req.body;
  console.log("Event Recieved", event);

  events.push(event);

  await axios
    .post("http://posts-clusterip-srv:4000/events", event)
    .catch((err) => {
      console.log("error occured", err.message);
    }); // post
  await axios.post("http://comments-srv:4001/events", event).catch((err) => {
    console.log("error occured", err.message);
  }); // comment
  await axios.post("http://query-srv:4002/events", event).catch((err) => {
    console.log("error occured", err.message);
  }); //query
  await axios.post("http://moderation-srv:4003/events", event).catch((err) => {
    console.log("error occured", err.message);
  }); //moderartion
  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Listerning on 4005");
});
