var client_connected = false;
var client_retry = true;
var client = null;
var mqtt_opt = null;
var connetced_msg = "Connect success";
var keepAlive = null;
var autoDisconnect = null;
var useBeep = true;
var json_text = "";

function tryConnectFirst(){
    if(typeof loadCookie !== 'undefined') loadCookie();
    if(document.location.search.length > 1){
        var array = document.location.search.substring(1).split('&');
        var re = /^[A-Z]\w*-\w+-\w+$/;
        for(var str of array) if(re.test(str)) type_and_serial = str;
    }
    if(websocket_host != null && websocket_port != null && websocket_username != null && websocket_password != null){
        keepAlive = null;
        client_connected = false;
        client = new Paho.MQTT.Client(websocket_host.replace(/^[^\/]*:\/\//,""), Number(websocket_port), "clientId" + new Date().getTime());
        client.onMessageArrived = onMessageArrived;
        client.onConnectionLost = onConnectionLost;
        connetced_msg = type_and_serial;
        mqtt_opt = {
            useSSL: websocket_host.indexOf("wss://") == 0,
            userName: websocket_username,
            password: (websocket_password=="(internal_default)"?"sI7G@DijuY":websocket_password),
            keepAliveInterval: 2,
            timeout: 5,
            onSuccess: onConnect,
            onFailure: doFail
        };
        client.connect(mqtt_opt);
    }else{
        if(connetced_msg != "Connect success") document.title = "Setting error";
        if(document.getElementById("status") != null) document.getElementById("status").innerHTML = "Setting error";
    }
}

function onConnect() {
    keepAlive = null;
    client_connected = true;
    console.log("onConnect");
    if(connetced_msg != "Connect success") document.title = "onConnect";
    if(document.getElementById("status") != null) document.getElementById("status").innerHTML = "onConnect";
    client.subscribe("0/WHISPERER/+/version"); //later DNE4.9
}

function doFail() {
    autoDisconnect = null;
    client_connected = false;
    if(client_retry) client.connect(mqtt_opt);
    console.log("doFail");
    if(connetced_msg != "Connect success") document.title = "Connect fail";
    if(document.getElementById("status") != null) document.getElementById("status").innerHTML = "Connect fail";
}

function onConnectionLost(responseObject) {
    autoDisconnect = null;
    client_connected = false;
    if(client_retry) client.connect(mqtt_opt);
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
    if(connetced_msg != "Connect success") document.title = "Disconnected";
    if(document.getElementById("status") != null) document.getElementById("status").innerHTML = "Disconnected";
}

function onMessageArrived(message) {
    console.log('payload: ' + message.destinationName + " : " + message.payloadString);
    if(message.destinationName.match(new RegExp("0/WHISPERER/.+/version")) != null){
        if(!keepAlive){
            if(connetced_msg != "Connect success") document.title = connetced_msg;
            if(document.getElementById("status") != null) document.getElementById("status").innerHTML = connetced_msg;
            if(typeof onConnected == 'function') onConnected();
        }
        keepAlive = new Date(); //later DNE4.9
    }
    if(typeof subscribeParse == 'function') subscribeParse(message);
    if(typeof subscribeParsed == 'function') subscribeParsed(message.destinationName, JSON.parse(json_text = message.payloadString));
}

setInterval("keepAlive100()", 100);
function keepAlive100(){
    if(client_connected && keepAlive && new Date().getTime() - keepAlive.getTime() > 5000){ //later DNE4.9 (version topic)
        keepAlive = null;
        autoDisconnect = new Date();
        client.disconnect();
        if(connetced_msg != "Connect success") document.title = "Timeout";
        if(document.getElementById("status") != null) document.getElementById("status").innerHTML = "Timeout";
    }
    if(autoDisconnect && new Date().getTime() - autoDisconnect.getTime() > 2000){
        autoDisconnect = null;
        client_connected = false;
        if(client_retry) client.connect(mqtt_opt);
    }
}

function beep() {
    if(useBeep) new Audio("data:audio/wav;base64,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").play();
}

function subscribe(topic) {
    if(client_connected){
        client.subscribe(topic);
        console.log("subscribe:" + topic);
    }else{
        console.log("no connect");
    }
}

function unsubscribe(topic) {
    if(client_connected){
        if(topic != "0/WHISPERER/+/version"){ //later DNE4.9
            client.unsubscribe(topic);
            console.log("unsubscribe:" + topic);
        }
    }else{
        console.log("no connect");
    }
}

function publish(topic, msg) {
    if(client_connected){
        if(typeof msg !== 'string'){
            msg = JSON.stringify(msg);
        }
        message = new Paho.MQTT.Message(msg);
        message.destinationName = topic;
        client.send(message);
        console.log("publish: " + topic + " : " + msg);
    }else{
        console.log("no connect");
    }
}

function publishHW(dest) {
    if(typeof type_and_serial !== 'undefined'){
        publish("0/THOUZER_HW/" + type_and_serial + "/exec/cmd", "{\"app\":\"highway\",\"params\":\"--destination " + dest + "\"}");
        beep();
    }
}
function publishCmdParam(cmd, param) {
    if(typeof type_and_serial !== 'undefined'){
        publish("0/THOUZER_HW/" + type_and_serial + "/exec/cmd", "{\"app\":\"" + cmd + "\",\"params\":\"" + param + "\"}");
        beep();
    }
}
function publishCmd(cmd) {
    if(typeof type_and_serial !== 'undefined'){
        publish("0/THOUZER_HW/" + type_and_serial + "/exec/cmd", "{\"app\":\"" + cmd + "\"}");
        beep();
    }
}
function publishVW(v, w) {
    if(typeof type_and_serial !== 'undefined'){
        publish("0/WHISPERER/" + type_and_serial + "/navTest", "{\"v_mps\":\"" + v.toPrecision(3) + "\", \"w_degps\":\"" + w.toPrecision(2) + "\"}"); //The old topic was "navTest". This has been revised, but you can use either.
    }
}
function publishVW_per(v, w) {
    if(typeof type_and_serial !== 'undefined'){
        publish("0/WHISPERER/" + type_and_serial + "/navTest", "{\"v_per\":\"" + v.toPrecision(3) + "\", \"w_per\":\"" + w.toPrecision(2) + "\"}"); //The old topic was "navTest". This has been revised, but you can use either.
    }
}

function subscribeCheckFinishSuccess(from_json) {
    return (from_json.app != null && from_json.app == "#success" && from_json.running != null && from_json.running == "OK");
}
