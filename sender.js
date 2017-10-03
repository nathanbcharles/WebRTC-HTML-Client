var connection;
var candidates = [];
var description;
var noop = function(){};

function id(val){
	return document.getElementById(val);
}
// Create a local description to send to the reciever and also send ICE candidates to the reciever
//
//
id('DescICE').onclick = function(){
  trace('Create Local Description and format ICE candidates for sending');
  // Initiate the RTC Connection
  window.localConnection = connection = new RTCPeerConnection({iceServers:[connectdetails]});
  // Create a data Channel for communication
  sendChannel = connection.createDataChannel('sendDataChannel');

  sendChannel.onmessage = function(event) {
    trace('Received Message');
    txtReadData.value = event.data;
  }

  // When a candidate is added, push it into the array
  connection.onicecandidate = function(e) {

    if(e.candidate) candidates.push(e.candidate);
    console.log(e.candidate);
    if(!e.candidate) {
      id('txtDescICE').value = JSON.stringify({ "sdp": description, "candidates": candidates });
    }
  };

  // Create an offer
  connection.createOffer().then(function(desc) {
    connection.setLocalDescription(desc);
    description = desc;
  }, function() {
    trace('Error Creating Offer');
  });
};

id('enterAnswer').onclick = function(){
  var signal = JSON.parse(id('txtEnterAnswer').value);
  connection.ondatachannel = function(evt) {
    alert('datachannel');
  };
  if(signal.sdp) {
    connection.setRemoteDescription(new RTCSessionDescription(signal.sdp), noop, noop);
  }
  signal.candidates.forEach(function(element) {
    connection.addIceCandidate(element).then(
      function() {
        console.log("Added Candidate");
      },
      function(err) {
        console.log("Error Adding Candidate: ", err);
      }
    );
  });
};

id('sendData').onclick = function() {
      var data = id('txtSendData').value;
      sendChannel.send(data);
      trace('Sent Data: ' + data);
};
