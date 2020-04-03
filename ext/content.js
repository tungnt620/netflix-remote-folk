let peerInit;
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
  console.log(data, peer);

  switch (data.action) {
    case "video_action":
      if (!isWatchingVideo()) {
        sendPayload(peer, { error: "Not watching video" });
      } else {
        const { action } = data.payload;
        let success = false;
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
        }
        if (success) {
          sendPayload(peer, { success: true });
        }
      }
      break;
  }
}
function initPeer() {
  let peer;
  if (!peerInit) {
    peer = new SimplePeer({ initiator: true, trickle: false });
    peerInit = peer;
  } else {
    peerInit.destroy();
    peer = new SimplePeer({ initiator: true, trickle: false });
  }

  // const socket = io.connect("http://localhost:4003", {
  //   path: "/netflix-broker/socket.io"
  // });
  const socket = io.connect("https://confession.vn", {
    path: "/netflix-broker/socket.io"
  });
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
