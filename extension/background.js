var winId = null;
var tabsId = [];

const youtubeURLs = {
  "buy-mode":
    "https://youtu.be/399YneFTwh0?list=PL6CUjwslQrfi_Xwp4fvqBIMTmeofJq7xU",
  "wii-store": "https://youtu.be/o0HIn9ksF4M",
  "nook-store": "https://youtu.be/QAm7vgyOnN4"
};

chrome.runtime.onMessage.addListener(function(message) {
  if (winId === null && message.type && message.type === "buy_mode") {
    chrome.storage.sync.get(
      { selectedTrack: "buy-mode" },
      ({ selectedTrack }) => {
        let urls = [];
        if (selectedTrack === "both") {
          urls.push(...Object.values(youtubeURLs));
        } else if (selectedTrack === "random") {
          urls.push(Object.values(youtubeURLs)[Math.floor(Math.random() * 2)]);
        } else {
          urls.push(youtubeURLs[selectedTrack]);
        }
        for (const url of urls) {
          chrome.windows.create(
            {
              url,
              focused: false,
              width: 200,
              height: 300,
              incognito: false
            },
            function(win) {
              winId = win.id;
            }
          );
        }
      }
    );
  }
});

chrome.tabs.onCreated.addListener(function(tab) {
  if (tab.url.includes(".amazon.")) {
    tabsId.push(tab.id);
  }
});

chrome.tabs.onUpdated.addListener(function(id, { url }, tab) {
  if (tab.url.includes(".amazon.") && tabsId && !tabsId.includes(tab.id)) {
    tabsId.push(tab.id);
  } else if (
    !tab.url.includes(".amazon.") &&
    tabsId &&
    tabsId.includes(tab.id)
  ) {
    var index = tabsId.indexOf(tab.id);
    tabsId.splice(index, 1);

    if (tabsId.length === 0) {
      chrome.windows.remove(winId);
      winId = null;
    }
  }
});

chrome.tabs.onRemoved.addListener(function(tab, info) {
  if (tabsId.includes(tab)) {
    var index = tabsId.indexOf(tab);
    tabsId.splice(index, 1);

    if (tabsId.length === 0) {
      chrome.windows.remove(winId);
      winId = null;
    }
  }
});
