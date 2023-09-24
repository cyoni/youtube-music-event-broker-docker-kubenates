function sendNotification(title, message) {
  chrome.notifications.create("", {
    title: title || "Youtube Downloader",
    message,
    iconUrl: "/icon.jpg",
    type: "basic",
  });
}

async function getYouTubeTab(queryOptions) {
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.commands.onCommand.addListener(async (command) => {
  console.log(`YouTube Downloader: Command "${command}" triggered`);

  let queryOptions = { audible: true, url: "https://www.youtube.com/*" };
  let tab = await getYouTubeTab(queryOptions);
  if (tab) downloadSong(tab.title, tab.url);
  else {
    queryOptions.audible = null;
    tab = await getYouTubeTab(queryOptions);
    if (tab) downloadSong(tab.title, tab.url);
    else sendNotification("YouTube Downloader", "Couldn't find YouTube tab");
  }
});

function getCleanTitle(title) {
  if (title) {
    title = title
      .replace(/[\(\[].*?[\]\)]/g, "")
      .replace(/[\/.|":\]\[\(\)]/g, "")
      .replace(/\s+/g, " ")
      .replace("- YouTube", "");
  }
  return title?.trim();
}

function downloadSong(title, url) {
  title = getCleanTitle(title);

  chrome.notifications.create("", {
    title: title || "Youtube Downloader",
    message: "Download started",
    iconUrl: "/icon.jpg",
    type: "basic",
  });

  fetch(`http://localhost:4000/download?url=${url}&title=${title}`)
    .then((res) => {
      const response = res.json();
      return response;
    })
    .then((res) => {
      if (res.status == "success") {
        sendNotification(title, "Download completed");
      } else {
        sendNotification(title, "Failed to download");
      }
    })
    .catch((e) => {
      console.log("error caught:", e.message);
      sendNotification(title, e.message);
    });
}
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith("https://www.youtube.com/watch")) {
    downloadSong(tab.title, tab.url);
  }
});

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.method == "download_video") {
//     fetch(
//       `http://localhost:4000/download?url=${request.url}&format=audioonly&quality=highestaudio`
//     )
//       .then((res) => {
//         const response = res.json()
//         return response
//       })
//       .then((res) => {
//         sendResponse(res)
//       })
//   }
//   if (request.type === "notification") {
//     chrome.notifications.create("", request.options)
//   }
//   return true
// })
