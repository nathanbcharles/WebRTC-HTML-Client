function id(val){
	return document.getElementById(val);
}
function trace(arg) {
  var now = (window.performance.now() / 1000).toFixed(3);
  console.log(now + ': ', arg);
}
var connectdetails = {
    urls: "turn:52.210.97.83:3478?transport=tcp" ,
    username: "dvw",
    credential: "helloice1"
};
