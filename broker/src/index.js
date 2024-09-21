const express = require("express");
const nats = require("node-nats-streaming");
const GeneratorPublisher = require("./events/generator-publisher");
const { randomBytes } = require("crypto");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

const PORT = process.env.SERVER_PORT;

const stan = nats.connect("youtube-music", "abc", {
  url: `http://yt-nats-srv:${process.env.NATS_PORT}`,
});

const publisher = new GeneratorPublisher(stan);

app.get("/", (req, res) => {
  res.send("Keep Alive!@");
});

app.get("/health", (req, res) => {
  res.send("OK!");
});

app.post("/api/publish", async (req, res) => {
  const data = req.body;

  console.log(data);
  const event = {
    id: randomBytes(4).toString("hex"),
    ...data,
  };

  await publisher.publish(event);

  res.json({ message: "Data received", data });
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  stan.on("connect", async () => {
    console.log("Publisher connected to Nats");
  });
});
