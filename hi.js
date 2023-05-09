var localVideo = document.getElementById("local-video");
var remoteVideo = document.getElementById("remote-video");
var callBtn = document.getElementById("call-btn");
var hangupBtn = document.getElementById("hangup-btn");

var localStream;
var remoteStream;
var peerConnection;

var servers = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

function start() {
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then((stream) => {
      localVideo.srcObject = stream;
      localStream = stream;
      callBtn.disabled = false;
    })
    .catch((error) => {
      console.error("Error getting user media", error);
    });
}

function call() {
  peerConnection = new RTCPeerConnection(servers);
  peerConnection.addEventListener("icecandidate", handleIceCandidate);
  peerConnection.addEventListener("track", handleRemoteStreamAdded);

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection
    .createOffer()
    .then((offer) => {
      return peerConnection.setLocalDescription(offer);
    })
    .then(() => {
      // Send the offer to the remote peer
    })
    .catch((error) => {
      console.error("Error creating offer", error);
    });
}

function hangup() {
  peerConnection.close();
  peerConnection = null;
  remoteVideo.srcObject = null;
  hangupBtn.disabled = true;
  callBtn.disabled = false;
}

function handleIceCandidate(event) {
  if (event.candidate) {
    // Send the candidate to the remote peer
  }
}

function handleRemoteStreamAdded(event) {
  remoteVideo.srcObject = event.streams[0];
  remoteStream = event.streams[0];
  hangupBtn.disabled = false;
}

start();

callBtn.addEventListener("click", call);
hangupBtn.addEventListener("click", hangup);