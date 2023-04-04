const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  console.log("Event recieved", type);

  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";

    setTimeout(async () => {
      await axios
        .post("http://event-bus-srv:4005/events", {
          type: "CommentModerated",
          data: {
            id: data.id,
            postId: data.postId,
            status,
            content: data.content,
          },
        })
        .catch((err) => {
          console.log("error occured", err.message);
        });
    }, 5000);
  }
});

app.listen(4003, () => {
  console.log("Listening on port 4003");
});
