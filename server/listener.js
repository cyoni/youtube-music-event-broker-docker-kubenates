const nats = require("node-nats-streaming");
const { randomBytes } = require("crypto");
const GeneratorListener = require("./events/generator-listener");

const clientId = randomBytes(4).toString("hex");

const stan = nats.connect("youtube-music", clientId, {
  url: `http://yt-music-broker-srv:${process.env.NATS_PORT}`,
});

stan.on("connect", () => {
  console.log("Listener connected to Nats. Client Id:", clientId);

  stan.on("close", () => {
    console.log("nats connection has been closed");
    process.exit();
  });
  new GeneratorListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
