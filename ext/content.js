let peerInit;
let socketInit;

function isWatchingVideo() {
  return /watch/.test(document.location.href);
}

function sendPayload(peer, data) {
  peer.send(JSON.stringify(data));
}

function clickButton(selector) {
  try {
    document.querySelector(selector).click();
  } catch (e) {}
}

function doesExist(selector) {
  return document.querySelector(selector) !== null;
}

function actionHandler(data, peer) {
  console.log(data);
  const { namespace, payload } = data;

  switch (namespace) {
    case "video_action":
      if (!isWatchingVideo()) {
        sendPayload(peer, { error: "Not watching video" });
      } else {
        let success = false;
        const { action } = payload;
        switch (action) {
          case "play_video":
            if (!doesExist(".button-nfplayerPlay")) {
              sendPayload(peer, { error: "Already playing" });
            } else {
              clickButton(".button-nfplayerPlay");
              success = true;
            }
            break;
          case "pause_video":
            if (!doesExist(".button-nfplayerPause")) {
              sendPayload(peer, { error: "Already paused" });
            } else {
              clickButton(".button-nfplayerPause");
              success = true;
            }
            break;
          case "forward_video":
            clickButton(".button-nfplayerFastForward");
            success = true;
            break;
          case "replay_video":
            clickButton(".button-nfplayerBackTen");
            success = true;
            break;
          case "next_episode":
            clickButton(".button-nfplayerNextEpisode");
            success = true;
            break;
          case "skip_intro":
            clickButton(".skip-credits a");
            success = true;
            break;
          case "set_subtitle":
            const { selectedSubtitleDataUia } = payload;
            clickButton(".button-nfplayerSubtitles");
            setTimeout(function() {
              clickButton(`[data-uia="${selectedSubtitleDataUia}"]`);
            }, 200);
            success = true;
            break;
          case "lln_toggle_translation":
            clickButton("#showHT");
            const blurTranslation = document.getElementById("blurTranslations");
            if (blurTranslation && blurTranslation.checked) {
              clickButton("#blurTranslations");
            }
            success = true;
            break;
          case "lln_view_definition":
            const { sliderValue } = payload;

            if (!sliderValue) {
              if (
                document
                  .querySelector(".lln-dict-tooltip")
                  .classList.contains("show")
              ) {
                clickButton(".button-nfplayerPlay");
              }
            } else {
              const wordEles = document.querySelectorAll(
                "#lln-subs span.lln-word"
              );
              if (wordEles.length) {
                let selectedWorldEle;
                const sliderValueForEachWord = 100 / wordEles.length;
                for (let i = 1; i <= wordEles.length; ++i) {
                  if (sliderValue < sliderValueForEachWord * i) {
                    selectedWorldEle = wordEles[i - 1];
                    break;
                  }
                }
                if (sliderValue === 100)
                  selectedWorldEle = wordEles[wordEles.length - 1];

                if (selectedWorldEle) {
                  selectedWorldEle.click();
                  document.querySelector(".lln-dict-tooltip").style.fontSize =
                    "23px";
                }
              }
            }

            success = true;
            break;
          default:
            console.log(data);
        }

        if (success) {
          sendPayload(peer, { success: true });
        }
      }
      break;
  }
}

function getSocket() {
  const brokerUrl = "https://confession.vn";
  // const brokerUrl = "http://localhost:4003";

  return io.connect(brokerUrl, {
    path: "/netflix-broker/socket.io",
    transports: ["websocket"]
  });
}

function getPeer() {
  return new SimplePeer({ initiator: true, trickle: false });
}

function initPeer() {
  let peer;
  let socket;

  if (peerInit) peerInit.destroy();
  if (socketInit) socketInit.disconnect();

  peer = getPeer();
  peerInit = peer;

  socket = getSocket();
  socketInit = socket;

  const state = {
    socket: false,
    signal: false,
    peerId: false,
    remotePeer: false
  };
  socket.on("connect", function() {
    state.socket = socket.id;
  });
  socket.on("answer-signal", function(data) {
    state.remotePeer = data;
    peer.signal(data);
  });
  socket.on("peer-id", function(data) {
    chrome.runtime.sendMessage({ peerId: data });
    state.peerId = data;
  });

  peer.on("signal", function(data) {
    state.signal = data;
    socket.emit("peer", data);
  });
  peer.on("connect", function() {
    chrome.storage.local.set({ peerConnected: true });
    chrome.runtime.sendMessage({ peerConnected: true });
    socketInit.disconnect();

    //
    sendPayload(peer, { playing: !doesExist(".button-nfplayerPlay") });

    //
    const intervalID = setInterval(() => {
      const subtitleBtn = document.querySelector(".button-nfplayerSubtitles");

      if (subtitleBtn) {
        subtitleBtn.click();

        setTimeout(function() {
          const subtitlesData = [];
          const subtitles = document.querySelectorAll(
            ".track-list-subtitles ul li"
          );
          for (let i = 0; i < subtitles.length; ++i) {
            const subtitleEle = subtitles[i];
            const subtitleDataUia = subtitleEle.getAttribute("data-uia");
            const subtitleText = subtitleEle.textContent;
            const selected = subtitleEle
              .getAttribute("class")
              .includes("selected");
            subtitlesData.push({
              subtitleDataUia,
              subtitleText,
              selected
            });
          }

          if (subtitlesData.length) {
            sendPayload(peer, { subtitlesData: subtitlesData });
            clearInterval(intervalID);
          }
        }, 300);
      }
    }, 100);

    // Check exist LLN
    sendPayload(peer, {
      isHaveLLN: !!document.querySelector(".lln-bottom-panel")
    });
  });
  peer.on("data", function(data) {
    const dataString = data.toString();

    if (dataString[0] === "{") {
      const data = JSON.parse(dataString);
      actionHandler(data, peer);
    }
  });
  peer.on("error", function(err) {
    chrome.storage.local.set({ peerConnected: false });
  });
  peer.on("close", function(err) {
    chrome.storage.local.set({ peerConnected: false });
  });

  return peer;
}

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
  if (Object.keys(msg).includes("initPeer")) {
    chrome.storage.local.set({ peerConnected: false }, function() {
      initPeer();
    });
  }
});
window.addEventListener("load", function() {
  chrome.storage.local.set({ peerConnected: false });
});
