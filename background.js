// chrome.runtime.onMessage.addListener(function(message) {
//   if (message.type && message.type == "buy_mode") {
//     chrome.tabs.query({ currentWindow: true, highlighted: true }, function(
//       tabs
//     ) {
//       chrome.tabs.create(
//         {
//           url: "https://youtu.be/399YneFTwh0"
//         },
//         () => {
//           console.log(tabs);
//           chrome.tabs.highlight({ tabs: tabs[0].index });
//         }
//       );
//     });
//   }
// });

chrome.runtime.onMessage.addListener(function(message) {
  if (message.type && message.type == "buy_mode") {
    chrome.windows.create({
      url:
        "https://youtu.be/399YneFTwh0?list=PL6CUjwslQrfi_Xwp4fvqBIMTmeofJq7xU",
      focused: false,
      width: 200,
      height: 300,
      incognito: true
    });
  }
});
