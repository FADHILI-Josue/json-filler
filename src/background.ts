chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "fill_random",
    title: chrome.i18n.getMessage("contextFill"),
    contexts: ["editable"] // input, textarea, contenteditable
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "fill_random" && tab?.id) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["build/content.js"]
    });
  }
});
