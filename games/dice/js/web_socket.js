window.webSocket = function(address){
    var connect = function(address) {
        var socket = new WebSocket(address);
      
        socket.onerror = function (error) {
            console.log("Error " + error.message);
        };
        socket.onopen = function () {
            console.log("Server connected.");
        };

        socket.onclose = function (event) {
            if (event.wasClean) {
                alert('Connection closed');
            } else {
                console.log('Disconnected');
                setTimeout(connect(address), 10000);
                console.log('Code: ' + event.code + ' reason: ' + event.reason);
            };
        };

        return socket;
    };


    return connect(address);
};
