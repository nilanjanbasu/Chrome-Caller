function notify(msg) {
    $("#notification_bar").text(msg);
    $("#cont").fadeIn(30).delay(6000).fadeOut(300); //notify
}

function notifyHTML(html) {
    $("#notification_bar").html(html);
    $("#cont").fadeIn(30).delay(3000).fadeOut(300); //notify    
}


function isNotEmpty(n) {
    return n.length > 0;
}

function replaceAll(txt, replace, with_this) {
    return txt.replace(new RegExp(replace, 'g'),with_this);
}

function disableButton(selector){
    $(selector).prop("disabled", true);
}

function enableButton(selector){
    $(selector).attr("disabled", false);    
}

function login() {
    Plivo.conn.login(localStorage["plivoUsername"], localStorage["plivoPassword"]);
}

function logout() {
    Plivo.conn.logout();
}

function onReady() {
    console.log("onReady...");
}

function webrtcNotSupportedAlert() {
    alert("Your browser doesn't support webrtc. You need Chrome 23 to use this demo. This extension will not function properly in this browser");
    isWebRTCSupported = false;
}

function onLoginEvent() {
    console.log("Logged in");
}

function onLoginFailed() {
    console.log("From extension: Login failed. Check username-password");
    //notifyHTML("Login Failed. Update in <a href=\"chrome-extension://__MSG_@@extension_id__/html/options.html\">Options</a> page");
    notify("Login failed. Go to options page to update username-password");
}

function onLogout() {
    console.log("From Extension: Logged out");
}

function initUI() {
    $("#endcall").hide();
    $("#call").show();
    enableButton("#call");
    $("#mute").text("Mute");
    disableButton("#mute");
}

function call(event) {
    if( isNotEmpty(event.data.phone_no) ) {
        $("#call").prop("disabled", true);
        Plivo.conn.call(event.data.phone_no);
        
    } else {
        console.log("Invalid Number"); //TODO: Notify support
    }
}

function onCalling() {
    console.log("onCalling");
    $('#status').text('Connecting....');
    disableButton("#call");
}

function onCallRemoteRinging() {
    $('#status').text('Ringing..');
    $("#call").hide().attr("disabled","");
    $("#endcall").show();
}

function onCallAnswered() {
    console.log('onCallAnswered');
    
    enableButton("#mute");
    $('#status').text("Now talking");
}
function onCallTerminated() {
    console.log("onCallTerminated");
    $('#status').text("Call terminated");
    initUI();
}

function onCallFailed(cause) {
    $('#status').text("Call Failed:"+cause);
    console.log("onCallFailed:"+cause);
    initUI();
}

function hangup(event) {
    Plivo.conn.hangup();
    initUI();
}

function mute() {
    Plivo.conn.mute();
    $("#mute").hide();
    $("#unmute").show();
}

function unmute() {
    Plivo.conn.unmute();
    $("#mute").show();
    $("#unmute").hide();
}

function onRequest(request, sender, sendResponse) {
    if(request.notification) {
        notify(request.notification);        
    }
}

$(function () {            
    Plivo.onCalling = onCalling;
    Plivo.onCallRemoteRinging = onCallRemoteRinging;
    Plivo.onCallAnswered = onCallAnswered;
    Plivo.onCallTerminated = onCallTerminated;
    Plivo.onCallFailed = onCallFailed;
    Plivo.onWebrtcNotSupported = webrtcNotSupportedAlert;
    Plivo.onReady = onReady;
    Plivo.onLogin = onLoginEvent;
    Plivo.onLoginFailed = onLoginFailed;
    Plivo.onLogout = onLogout;
    Plivo.init();
    
    var phone = window.location.hash.substring(1);
    //~ var phone = "919748327244"; 
    $("title").text("Call: " + phone);
    $("#phone_number").text(phone);
    
    login();
    
    $("#call").show();
    $("#endcall").hide();
    $("#mute").show();
    $("#unmute").hide();
    $("#call").on("click", {phone_no : phone}, call);
    $("#endcall").on("click", hangup);    
    $("#mute").on("click", mute);
    $("#unmute").on("click", unmute);
    
    chrome.extension.onMessage.addListener(onRequest);
    
});


