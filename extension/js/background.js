/*Plivo Web SDK Specific codes */


/*End Plivo Web SDK Specific codes */

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

/* Global variables & setings*/
var window_map = new Object();
window_map.call_window_exists = false;                        
/* End Global variables*/
function formatUSNumber(n) {
    var dest = n.replace(/-/g, '');
    dest = dest.replace(/ /g, '');
    dest = dest.replace(/\+/g, '');
    dest = dest.replace(/\(/g, '');
    dest = dest.replace(/\)/g, '');
    dest = dest.replace(/\./g, '');
    if (!isNaN(dest)) {
        n = dest;
        if (n.length == 10 && n.substr(0, 1) != "1") {
            n = "1" + n;
        }
        return n;
    } else {
        return "";        
    }
}

function delete_window_handler(windowid) {    
    window_map.call_window_exists = false;
    window_map.existing_window = undefined;
    window_map.tabid = undefined;
}

function call_window_handler(window) {
    window_map.existing_window = window.id;    
    chrome.windows.onRemoved.addListener(delete_window_handler);
}

function sanitize_phone_number(number) {
    
    return formatUSNumber(number); //TODO more sanitization and verification
    
}

function onRequest(request, sender, sendResponse){
    
    if(request.found_numbers) {
        chrome.pageAction.show(sender.tab.id);
    }
        
    if(request.phone_number) {
        var ph_no = sanitize_phone_number(request.phone_number);
        if(ph_no !== "") {       
        
            if(!window_map.call_window_exists) { // The phone number is not currently being called
                var url = 'html/calling.html#' + ph_no;
                window_map.call_window_exists = true;
                
                chrome.windows.create({
                            focused: true,
                            height: 400, 
                            width: 400 , 
                            left: 400, 
                            top: 200,
                            'url': url,
                            type: 'popup'
                        }, function(w) {
                            // After the window has been created, open and inject window to a tab
                            call_window_handler(w);
                            chrome.tabs.create({
                                windowId: w.id,
                                url: url,
                                focused: true                               
                            }, function(tab){
                                window_map.tabid = tab.id;
                            });
                });
                
                   
                //~ chrome.tabs.create({
                            //~ 'url': url,
                            //~ active: false
                        //~ }, function(tab) {
                            //~ // After the tab has been created, open a window to inject the tab
                            //~ chrome.windows.create({
                                //~ tabId: tab.id,
                                //~ type: 'popup',
                                //~ focused: true,
                                //~ height: 400, 
                                //~ width: 400 , 
                                //~ left: 400, 
                                //~ top: 200
                            //~ }, call_window_handler);
                //~ });             
                

                //~ chrome.windows.create({ 'url' : url, 'type' : 'popup', height: 400, width: 400 , left: 400, top: 200}, call_window_handler);
            } else{
                chrome.windows.update(parseInt(window_map.existing_window, 10), { focused : true }, function(window){});
                //~ chrome
                
                //TODO notify the window properly that another call event came up
            }
        } else { //It is not a valid phone number
            //TODO Send a message to the window for it to notify
        }
    }
    sendResponse({});
}

chrome.extension.onMessage.addListener(onRequest);


