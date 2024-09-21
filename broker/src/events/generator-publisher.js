const Publisher = require("@cyoni10/yt-common/src/base-publisher");
const { Subjects } = require("@cyoni10/yt-common/src/subjects");

class GeneratorPublisher extends Publisher {
  subject = Subjects.CreateLink;
}

module.exports = GeneratorPublisher;
