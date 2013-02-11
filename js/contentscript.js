function findTelNumbers(el, func) {
    if(el.nodeType == 3) {
        func(el);
    } else {
        var snapshot = Array.prototype.slice.call(el.childNodes, 0);
        for(var i=0 ; i < snapshot.length; ++i) {
            if(snapshot[i].nodeName.toLowerCase() != 'script')
                findTelNumbers(snapshot[i], func);
        }
    }
}
function findAndReplace(el) {
    str = el.nodeValue;
    regex = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/g ;
    new_str =  str.replace(regex, function(word){
        style = "";
        console.log("Found a replacable string");
        return "<span class=\"phone_number\">"+word+"</span>";
    });
    if(str != new_str) {
        var div = document.createElement('div');
        div.style.display = "inline";
        div.innerHTML = new_str;
        el.parentNode.replaceChild(div,el);
    }
}

findTelNumbers(document.body,findAndReplace);

//~ string = document.body.innerHTML;

//~ if(result){
    //~ chrome.extension.sendRequest({}, function(response) {});
//~ }
