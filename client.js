if (!window.WebSocket) {
    document.body.innerHTML = 'WebSocket is not supported.';
}
var socket = new WebSocket("ws://localhost:8081");
var timer;

document.forms.publish.onsubmit = function (message) {
    var outgoingMessage = message.data;

    var file = document.getElementById('file');

    if (file.files.length) {
        var reader = new FileReader();

        reader.onload = function (e) {
            socket.send(e.target.result);

            var startTime = (new Date()).getTime();

            function calculateSpeed() {
                var downloadSize = e.target.result.length;
                var duration = Math.round((new Date().getTime() - startTime) / 1000);
                var bitsLoaded = downloadSize * 8;
                var speedBps = Math.round(bitsLoaded / duration);
                var speedKbps = (speedBps / 1024).toFixed(2);
                var speedMbps = (speedKbps / 1024).toFixed(2);
                socket.send(speedMbps);
            }

            timer = setInterval(calculateSpeed, 1000);
        };

        reader.readAsBinaryString(file.files[0]);
    }

    return false;
};

socket.onmessage = function (event) {
    var incomingMessage = event.data;
    showMessage(incomingMessage);
    clearInterval(timer);
};

function showMessage(message) {
    var messageElem = document.createElement('div');
    messageElem.appendChild(document.createTextNode(message));
    document.getElementById('subscribe').appendChild(messageElem);
}
