var window_map = new Object();

function delete_window_handler(windowid) {
    if( windowid in window_map) {
        delete window_map[windowid];
    }
}

function create_window_handler(phone_number){
    
    function handle_new_window(window) {
        window_map[window.id] = phone_number;
        chrome.windows.onRemoved.addListener(delete_window_handler);
    }
    return handle_new_window;
}
function sanitize_phone_number(number) {
    var new_number = "";
    //~ for(var i=0;i<number.length; ++i){
        //~ if
    return number; //return the same number for now TODO
    
}


function onRequest(request, sender, sendResponse){
    chrome.pageAction.show(sender.tab.id); //TODO: Show conditionally
    
    if(request.phone_number) {
        
        var ph_no = sanitize_phone_number(request.phone_number);
        var exists = false;
        var win_id_if_exists = "";
        for(var prop in window_map){
            if(window_map[prop] == ph_no) {
                exists = true;
                win_id_if_exists = prop;
                break;
            }
        }
        if(!exists) { // The phone number is not currently being called
            var url = 'html/calling.html#' + ph_no;
            chrome.windows.create({ 'url' : url, 'type' : 'popup', height: 400, width: 400 , left: 400, top: 200}, create_window_handler(ph_no));
        } else{
            chrome.windows.update(parseInt(win_id_if_exists), { focused : true }, function(window){});
        }
    }
    sendResponse({});
};

chrome.extension.onMessage.addListener(onRequest);
