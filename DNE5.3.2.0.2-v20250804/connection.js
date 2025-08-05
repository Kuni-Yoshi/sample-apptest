var websocket_host = null;
var websocket_port = null;
var websocket_username = null;
var websocket_password = null;

function loadCookie(){
    if(document.cookie == "") {
        var v = getDefaultCookieValue();
        websocket_host = v[0];
        websocket_port = v[1];
        websocket_username = v[2];
        websocket_password = v[3];
    } else {
        var result;
        websocket_host = (result= new RegExp('(?:^|; )' + encodeURIComponent("address") + '=([^;]*)').exec(document.cookie)) ? String(result[1]) : null;
        websocket_port = (result= new RegExp('(?:^|; )' + encodeURIComponent("port") + '=([^;]*)').exec(document.cookie)) ? String(result[1]) : null;
        websocket_username = (result= new RegExp('(?:^|; )' + encodeURIComponent("username") + '=([^;]*)').exec(document.cookie)) ? String(result[1]) : null;
        websocket_password = (result= new RegExp('(?:^|; )' + encodeURIComponent("password") + '=([^;]*)').exec(document.cookie)) ? String(result[1]) : null;
    }
}
function saveCookie(){ //need four input elements
    hostname = document.getElementById("address").value;
    if(hostname.indexOf("wss://") == -1 && document.getElementById("wss").checked){
        hostname = "wss://" + hostname;
    }
    document.cookie = "address=" + hostname + "; max-age=157680000;"
    document.cookie = "port=" + document.getElementById("port").value + "; max-age=157680000;";
    document.cookie = "username=" + document.getElementById("username").value + "; max-age=157680000;"
    document.cookie = "password=" + document.getElementById("password").value + "; max-age=157680000;"
}
function getDefaultCookieValue(){
    var path = window.location.pathname.split("/");
    if (path.length >= 4 && path[1] == "id") {
        var host = window.location.hostname;
        var port = window.location.port;
        if (window.location.protocol === "https:") {
            host = "wss://" + host;
            if (!port) port = "443";
        } else {
            if (!port) port = "80";
        }
        return [ host, port, path[2], path[3] ];
    } else {
        return [ mqtt_host!=""?mqtt_host:(window.location.hostname!=""?window.location.hostname:"localhost"),
            mqtt_port!=""?mqtt_port:"8080",
            mqtt_username!=""?mqtt_username:"mqtt",
            mqtt_password!=""?mqtt_password:"(internal_default)" ];
    }
}
function resetCookie(){
    var v = getDefaultCookieValue();
    document.cookie = "address=" + v[0] + "; max-age=157680000;";
    document.cookie = "port=" + v[1] + "; max-age=157680000;";
    document.cookie = "username=" + v[2] + "; max-age=157680000;";
    document.cookie = "password=" + v[3] + "; max-age=157680000;";
}
