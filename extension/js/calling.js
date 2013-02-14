function notify(msg) {
    
}

function isNotEmpty(n) {
    return n.length > 0;
}

function formatUSNumber(n) {
    var dest = n.replace(/-/g, '');
    dest = dest.replace(/ /g, '');
    dest = dest.replace(/\+/g, '');
    dest = dest.replace(/\(/g, '');
    dest = dest.replace(/\)/g, '');
    if (!isNaN(dest)) {
        n = dest
        if (n.length == 10 && n.substr(0, 1) != "1") {
            n = "1" + n;
        }
    }
    return n;
}

function replaceAll(txt, replace, with_this) {
    return txt.replace(new RegExp(replace, 'g'),with_this);
}

function disableButton(selector){
    $(selector).attr("disabled", "disabled");
}

function enableButton(selector){
    $(selector).attr("disabled", "");    
}

function initUI() {
    $("#endcall").hide();
    $("#call").show();
    enableButton("#call");
    $("#mute").text("Mute");
    disableButton("mute");
}

function call(event) {
    if( isNotEmpty(event.data.phone_no) ) {
        $("#togglecall").attr("disabled", "disabled");
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

$(function () {            
    Plivo.onCalling = onCalling;
    Plivo.onCallRemoteRinging = onCallRemoteRinging;
    Plivo.onCallAnswered = onCallAnswered;
    Plivo.onCallTerminated = onCallTerminated;
    Plivo.onCallFailed = onCallFailed;
    
    var phone = window.location.hash.substring(1);
    $("title").text("Call" + phone);
    
    $("#call").on("click", {phone_no : phone}, call);
    $("#endcall").on("click", hangup);    
    $("#mute").on("click", mute);
    $("#unmute").on("click", unmute);
    
});


