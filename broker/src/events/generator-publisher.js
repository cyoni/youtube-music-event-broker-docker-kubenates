const Publisher = require("../../../common/base-publisher");
const { Subjects } = require("../../../common/subjects");

class GeneratorPublisher extends Publisher {
  subject = Subjects.CreateLink;
}

module.exports = GeneratorPublisher;
