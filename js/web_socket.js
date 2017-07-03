window.webSocket = function(address){
    var connect_repeat = 3;
    var connect = function(address) {
        var socket = new WebSocket(address);

        socket.onerror = function (error) {
            // console.log("Error " + error.message);
        };
        socket.onopen = function () {
            // console.log("Server connected.");
        };

        socket.onclose = function (event) {
            if (event.wasClean) {
                // alert('Connection closed');
            } else {
                connect_repeat--;
                if (connect_repeat<=0) {
                    return;
                }
                // console.log('Disconnected');
                setTimeout(function(){
                    connect(address);
                }, 3000);
                // console.log('Code: ' + event.code + ' reason: ' + event.reason);
            };
        };

        if (!socket) {
            return { onmessage:function(e){} };
        }

        return socket;
    };


    return connect(address);
};
