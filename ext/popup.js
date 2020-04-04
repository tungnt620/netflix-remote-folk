function initPeer() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { initPeer: true }, function(response) {
      console.log(response);
      document.querySelector("#status").textContent = response;
    });
  });
}

function peerDisconnected() {
  document.querySelector("#helper-text").hidden = false;
  document.querySelector("#peer-id").hidden = false;
  document.querySelector("#connection-status").hidden = true;
}
function peerConnected() {
  const status = document.querySelector("#connection-status");
  document.querySelector("#helper-text").hidden = true;
  document.querySelector("#peer-id").hidden = true;
  status.hidden = false;
  status.textContent = "Connected";
  status.classList.add("connection--success");
}
chrome.runtime.onMessage.addListener(function(msg, sender, response) {
  if (Object.keys(msg).includes("peerId")) {
    document.querySelector("#peer-id").innerHTML = msg.peerId;
  }
  if (Object.keys(msg).includes("peerConnected")) {
    peerConnected();
  }
});
document.addEventListener("DOMContentLoaded", function() {
  document.querySelector("#status").textContent = "Loading";
  chrome.storage.local.get(["peerConnected"], function(data) {
    if (!data.peerConnected) {
      initPeer();
    } else {
      document.querySelector("#status").textContent = "";
      peerConnected();
    }
  });

  document.querySelector("#refresh").addEventListener("click", function() {
    peerDisconnected();
    initPeer();
  });
});
