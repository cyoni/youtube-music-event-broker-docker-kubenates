if (window.location.href.includes("https://www.youtube.com/results")) {
  console.log("hello from youtube extension")
  function removeElements() {
    const elements = document.querySelectorAll(
      "ytd-promoted-sparkles-web-renderer"
    );
    elements.forEach((element) => element.remove());
  }

  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === "childList") {
        removeElements();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
} else {
  function handleLikeClick() {
    const likeBtn = document.querySelector("button[aria-label^='like this']");
    if (likeBtn) likeBtn.click();
  }

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.method === "HANDLE_LIKE_CLICK") {
      handleLikeClick();
    }
  });
}
