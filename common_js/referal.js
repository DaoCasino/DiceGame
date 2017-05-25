var ref_abi = [{"constant":true,"inputs":[{"name":"_player","type":"address"}],"name":"getAdviser","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_operator","type":"address"},{"name":"_adviser","type":"address"}],"name":"setService","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"adviserOf","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_player","type":"address"}],"name":"getOperator","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"operatorOf","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"}]
var operator = "0x";

function sendRefAndOperator() {

    var q_params = (function () {
        var params = {};
        if (window.location.href.split('?').length < 2) {
            return params;
        }
        var parts = window.location.href.split('?')[1].split('&');
        for (var k in parts) {
            var kv = parts[k].split('=');
            params[kv[0]] = kv[1];
        }
        return params;
    }());

    var referal = q_params.ref;
    


}