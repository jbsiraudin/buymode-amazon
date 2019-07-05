var tabsId = [];
var isPlaying = false;

const musicObjs = {
  "buy-mode": new Audio(chrome.runtime.getURL('sims.mp3')),//"https://youtu.be/399YneFTwh0?list=PL6CUjwslQrfi_Xwp4fvqBIMTmeofJq7xU",
  "wii-store": new Audio(chrome.runtime.getURL('wiishop.mp3')),// "https://youtu.be/o0HIn9ksF4M",
  "nook-store": new Audio(chrome.runtime.getURL('nook.mp3')),//"https://youtu.be/QAm7vgyOnN4"
};

function stop() {
  Object.keys(musicObjs).map(function (objKey, _index) {
    musicObjs[objKey].pause();
    musicObjs[objKey].currentTime = 0;
  });
  isPlaying = false;
}

function play() {
  chrome.storage.sync.get(
    { selectedTrack: "buy-mode" },
    ({ selectedTrack }) => {
      let music = [];
      if (selectedTrack === "both") {
        music.push(...Object.values(musicObjs));
      } else if (selectedTrack === "random") {
        music.push(Object.values(musicObjs)[Math.floor(Math.random() * 2)]);
      } else {
        music.push(musicObjs[selectedTrack]);
      }
      for (const currMusic of music) {
        currMusic.play();
        currMusic.loop = true;
      }
    }
  );
  isPlaying = true;
}

// chrome.runtime.onMessage.addListener(function(message, sender) {
//   if (!isPlaying && message.type && message.type === "buy_mode" && sender.tab) {
//     if (tabsId.find(el => el == sender.tab.id) === sender.tab.id) {
//       return false;
//     }
//     play();
//     tabsId.push(sender.tab.id);
//     return true;
//   }
// });

chrome.tabs.onUpdated.addListener(function(id, _changes, tab) {
  if (typeof tab.url == 'string') { // If we can access the url property, it means that's the URL is amazon (because the ext doesn't have access to other websites)
    if (tabsId.includes(tab.id)) {
      return;
    } else {
      tabsId.push(tab.id);
      if (!isPlaying) { // This listener is faster than the content script, we use this to optimize script execution
        play();
      }
    }
  } else { // Else it means it's an other website than amazon
    if (tabsId.includes(tab.id)) {
      var index = tabsId.indexOf(tab);
      tabsId.splice(index, 1);

      if (tabsId.length === 0) {
        stop();
      }
    }
  }
});

chrome.tabs.onRemoved.addListener(function(tab, info) {
  if (tabsId.includes(tab)) {
    var index = tabsId.indexOf(tab);
    tabsId.splice(index, 1);

    if (tabsId.length === 0) {
      stop();
    }
  }
});
