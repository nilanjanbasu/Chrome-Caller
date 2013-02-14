/*Plivo Web SDK Specific codes */


/*End Plivo Web SDK Specific codes */

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
var window_map = new Object();
window_map.call_window_exists = false;

function delete_window_handler(windowid) {    
    window_map.call_window_exists = false;
    window_map.existing_window = undefined;
}

function call_window_handler(window) {
    window_map.existing_window = window.id;    
    chrome.windows.onRemoved.addListener(delete_window_handler);
}

function sanitize_phone_number(number) {
    var new_number = "";
    return number; //return the same number for now TODO
    
}

function onRequest(request, sender, sendResponse){
    chrome.pageAction.show(sender.tab.id); //TODO: Show conditionally
    
    if(request.phone_number) {
        var ph_no = sanitize_phone_number(request.phone_number);
        
        if(!window_map.call_window_exists) { // The phone number is not currently being called
            var url = 'html/calling.html#' + ph_no;
            window_map.call_window_exists = true;

            chrome.windows.create({ 'url' : url, 'type' : 'popup', height: 400, width: 400 , left: 400, top: 200}, call_window_handler);
        } else{
            chrome.windows.update(parseInt(window_map.existing_window), { focused : true }, function(window){});
            //TODO notify the window properly that another call event came up
        }
    }
    sendResponse({});
}

chrome.extension.onMessage.addListener(onRequest);


