function qrCode(text) {
  return "https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=" + text;
}
function initPeer() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { initPeer: true }, function(response) {
      document.querySelector("#status").textContent = response;
    });
  });
}
function peerDisconnected() {
  document.querySelector("#qr-code").hidden = false;
  document.querySelector("#helper-text").hidden = false;
  document.querySelector("#connection-status").hidden = true;
}
function peerConnected() {
  const status = document.querySelector("#connection-status");
  document.querySelector("#helper-text").hidden = true;
  chrome.storage.local.get(["qrCodeImage"], function(data) {
    document.querySelector("#qr-code").src = data.qrCodeImage;
  });
  status.hidden = false;
  status.textContent = "Connected";
  status.classList.add("connection--success");
}
chrome.runtime.onMessage.addListener(function(msg, sender, response) {
  if (Object.keys(msg).includes("peerId")) {
    const qrCodeImage = qrCode(msg.peerId);
    chrome.storage.local.set({ qrCodeImage: qrCodeImage });
    document.querySelector("#qr-code").src = qrCodeImage;
    document.querySelector("#peer-id").innerHTML = msg.peerId;
  }
  if (Object.keys(msg).includes("peerConnected")) {
    document.querySelector("#qr-code").hidden = true;
    document.querySelector("#helper-text").hidden = true;
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
