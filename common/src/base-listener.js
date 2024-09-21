class Listener {
  constructor(client) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setAckWait(5000)
      .setDurableName(`${this.queueGroupName}-durable-name`);
  }

  listen() {
    const stan = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    stan.on("message", (msg) => {
      console.log(`Received event: #${this.subject} / ${this.queueGroupName}`);

      const parsedMsg = this.parseMessage(msg);
      this.onMessage(parsedMsg, msg);
    });
  }

  parseMessage(msg) {
    const data = msg.getData();
    return typeof data === "string" ? data : JSON.parse(data.toString("utf-8"));
  }
}

module.exports = Listener;
