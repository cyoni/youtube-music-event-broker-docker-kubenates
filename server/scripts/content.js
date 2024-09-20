function handleLikeClick() {
  const likeBtn = document.querySelector("button[aria-label^='like this']");
  if (likeBtn) likeBtn.click();
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.method === "HANDLE_LIKE_CLICK") {
    handleLikeClick();
  }
});
