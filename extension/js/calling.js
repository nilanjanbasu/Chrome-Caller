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

function initUI() {
    //callbox
    $('#callcontainer').hide();
    $('#btn-container').hide();
    $('#status_txt').text('Waiting login');
    $('#login_box').show();
    $('#logout_box').hide();
}

function callUI() {
    //show outbound call UI
    dialpadHide();
    $('#incoming_callbox').hide('slow');
    $('#callcontainer').show();
    $('#status_txt').text('Ready');
    $('#make_call').text('Call');
}

function IncomingCallUI() {
    //show incoming call UI
    $('#status_txt').text('Incoming Call');
    $('#callcontainer').hide('slow');
    $('#incoming_callbox').show('slow');
}

function callAnsweredUI() {
    $('#status_txt').text('Call Answered....');
    $('#incoming_callbox').hide('slow');
    $('#callcontainer').hide('slow');
    dialpadShow();
}

function onCalling() {
    console.log("onCalling");
    $('#status_txt').text('Connecting....');
}

function onCallRemoteRinging() {
    $('#status_txt').text('Ringing..');
}

function onCallAnswered() {
    console.log('onCallAnswered');
    callAnsweredUI()
}

function onCallTerminated() {
    console.log("onCallTerminated");
    callUI()
}

function onCallFailed(cause) {
    $('#status_txt').text("Call Failed:"+cause);
    console.log("onCallFailed:"+cause);
    callUI();
}

function call() {
    if ($('#make_call').text() == "Call") {
        var dest = $("#to").val();
        if (isNotEmpty(dest)) {
            $('#status_txt').text('Calling..');

            Plivo.conn.call(dest);
            $('#make_call').text('End');
        }
        else{
            $('#status_txt').text('Invalid Destination');
        }

    }
    else if($('#make_call').text() == "End") {
        $('#status_txt').text('Ending..');
        Plivo.conn.hangup();
        $('#make_call').text('Call');
        $('#status_txt').text('Ready');
    }
}

function hangup() {
    $('#status_txt').text('Hanging up..');
    Plivo.conn.hangup();
    callUI()
}

function dtmf(digit) {
    console.log("send dtmf="+digit);
    Plivo.conn.send_dtmf(digit);
}
function dialpadShow() {
    $('#btn-container').show();
}

function dialpadHide() {
    $('#btn-container').hide();
}

function mute() {
    Plivo.conn.mute();
    $('#linkUnmute').show('slow');
    $('#linkMute').hide('slow');
}

function unmute() {
    Plivo.conn.unmute();
    $('#linkUnmute').hide('slow');
    $('#linkMute').show('slow');
}

function onIncomingCall(account_name, extraHeaders) {
    console.log("onIncomingCall:"+account_name);
    console.log("extraHeaders=");
    for (var key in extraHeaders) {
        console.log("key="+key+".val="+extraHeaders[key]);
    }
    IncomingCallUI();
}

function onIncomingCallCanceled() {
    callUI();
}

function answer() {
    console.log("answering")
    $('#status_txt').text('Answering....');
    Plivo.conn.answer();
    callAnsweredUI()
}

function reject() {
    callUI()
    Plivo.conn.reject();
}

$(function () {            
    Plivo.onCalling = onCalling;
    Plivo.onCallRemoteRinging = onCallRemoteRinging;
    Plivo.onCallAnswered = onCallAnswered;
    Plivo.onCallTerminated = onCallTerminated;
    Plivo.onCallFailed = onCallFailed;
    Plivo.onIncomingCall = onIncomingCall;
    Plivo.onIncomingCallCanceled = onIncomingCallCanceled;
    
    
    var phone = window.location.hash.substring(1);
    $("title").text("Call" + phone);
    $("span").text("Do you wish to call: " + phone);  
    
});


