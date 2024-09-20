const ytdl = require("@distube/ytdl-core");
const fs = require("fs");
const express = require("express");
const app = express();
const credentials = require("./credentials.json");

// app.get("/download", async (req, res) => {
//   try {
//     const url = req.query.url;
//     const title = req.query.title;
//     if (!url) {
//       res.status(400).json({
//         error: "url is missing",
//       });
//       return;
//     }

//     await downloadSong(url, title);
//     await uploadToCloud(title);

//     res.status(400).json({ status: "success" });
//   } catch (e) {
//     return res.status(400).json({ status: "failed", error: e });
//   }
// });

const port = 4000;
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

function downloadSong(url, title) {
  return new Promise((resolve, reject) => {
    console.log("downloading", url);
    try {
      ytdl(url, { filter: "audioonly" })
        .pipe(fs.createWriteStream(`./songs/${title}.mp3`))
        .on("finish", function () {
          console.log("finished");
          resolve(true);
        })
        .on("error", function (e) {
          console.log("error", e);
          throw e;
        });
    } catch (e) {
      console.log(e);
      throw e;
    }
  });
}

async function uploadToCloud(title) {
  const { GoogleAuth } = require("google-auth-library");
  const { google } = require("googleapis");

  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/drive",
    credentials,
  });
  const service = google.drive({ version: "v3", auth });
  const requestBody = {
    name: `${title}.mp3`,
    fields: "id",
    parents: ["1ObxUCb3-onR1XYThbYf6SzFtOOrBzgy-"],
  };
  const media = {
    mimeType: "audio/mpeg",
    body: fs.createReadStream(`./songs/${title}.mp3`),
  };
  try {
    const file = await service.files.create({
      requestBody,
      media: media,
    });
    console.log("Uploaded successfuly to Google Drive. File id:", file.data.id);
    return file.data.id;
  } catch (err) {
    throw err;
  }
}

module.exports = { downloadSong, uploadToCloud };
