var websocket_host = null;
var websocket_port = null;
var websocket_username = null;
var websocket_password = null;

function loadCookie(){
    if(document.cookie == "") resetCookie();
    var result;
    websocket_host = (result= new RegExp('(?:^|; )' + encodeURIComponent("address") + '=([^;]*)').exec(document.cookie)) ? String(result[1]) : null;
    websocket_port = (result= new RegExp('(?:^|; )' + encodeURIComponent("port") + '=([^;]*)').exec(document.cookie)) ? String(result[1]) : null;
    websocket_username = (result= new RegExp('(?:^|; )' + encodeURIComponent("username") + '=([^;]*)').exec(document.cookie)) ? String(result[1]) : null;
    websocket_password = (result= new RegExp('(?:^|; )' + encodeURIComponent("password") + '=([^;]*)').exec(document.cookie)) ? String(result[1]) : null;
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
function resetCookie(){
    document.cookie = "address=" + (mqtt_host!=""?mqtt_host:(window.location.hostname!=""?window.location.hostname:"localhost")) + "; max-age=157680000;";
    document.cookie = "port=" + (mqtt_port!=""?mqtt_port:"8080") + "; max-age=157680000;";
    document.cookie = "username=" + (mqtt_username!=""?mqtt_username:"mqtt") + "; max-age=157680000;";
    document.cookie = "password=" + (mqtt_password!=""?mqtt_password:"(internal_default)") + "; max-age=157680000;";
}
