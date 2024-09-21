const Listener = require("@cyoni10/yt-common/src/base-listener");
const { Subjects } = require("@cyoni10/yt-common/src/subjects");
const { downloadSong, uploadToCloud } = require("../manager");

class GeneratorListener extends Listener {
  subject = Subjects.CreateLink;
  queueGroupName = "listener-service";
  async onMessage(data, msg) {
    try {
      console.log("recieved msg: ", data);
      const { url, title } = JSON.parse(data);
      if (url && title) {
        msg.ack();
        await downloadSong(url, title);
        await uploadToCloud(title);
      }
    } catch (err) {
      console.log("listener error:", err);
    }
  }
}

module.exports = GeneratorListener;
