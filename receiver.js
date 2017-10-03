var connection;
var candidates = [];
var description;
var noop = function(){};
var channel;

function id(val){
	return document.getElementById(val);
}
// Create a local description to send to the reciever and also send ICE candidates to the reciever
//
//
id('DescICE').onclick = function(){
  window.localConnection = connection = new RTCPeerConnection({iceServers:[connectdetails]});
  var signal = JSON.parse(id('txtDescICE').value);

  if(signal.sdp) {
    connection.setRemoteDescription(new RTCSessionDescription(signal.sdp), noop, noop);
  }
	if(signal.candidates) {
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
	}

	connection.oniceconnectionstatechange = function(e) {
		console.log("state= ", e);
	}
  // When a candidate is added, push it into the array
  connection.onicecandidate = function(e) {
        if(e.candidate) candidates.push(e.candidate);
    console.log(e.candidate);
    if(!e.candidate) {
      id('txtAnswer').value = JSON.stringify({ "sdp": description, "candidates": candidates });
    }
  };
  // Create an Answer
  connection.createAnswer().then(function(desc) {
    connection.setLocalDescription(desc);
    description = desc;
  }, function() {
    trace('Error Creating Offer');
  });
  connection.ondatachannel = function(event) {
    receiveChannel = event.channel;
    channel = receiveChannel;
    receiveChannel.onmessage = onReceiveMessageCallback;
    receiveChannel.onopen = onReceiveChannelStateChange();
    receiveChannel.onclose = onReceiveChannelStateChange;
  };
};
id('sendData').onclick = function() {
      var data = id('txtSendData').value;
      channel.send(data);
      trace('Sent Data: ' + data);
};
function onReceiveMessageCallback(event) {
  trace('Received Message');
  txtReadData.value = event.data;
}

function onSendChannelStateChange() {

}

function onReceiveChannelStateChange() {
}
