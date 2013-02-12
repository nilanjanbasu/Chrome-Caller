function onRequest(request, sender, sendResponse){
    
    chrome.pageAction.show(sender.tab.id);
    sendResponse({});
};

chrome.extension.onMessage.addListener(onRequest);
