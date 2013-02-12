function addStyle(style) {
}

function onCallPressed() {
    //~ alert(this.parentNode.nodeName);
    var span = this.parentNode.getElementsByClassName('phone_number')[0];
    var phone = span.innerText;
    if(phone) {
        chrome.extension.sendMessage({ phone_number: phone}, function(response) {});
    }
}
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
    var str = el.nodeValue;
    var regex = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/g ;
    var new_str =  str.replace(regex, function(word){
        var style = "";
        console.log("Found a replacable string");
        return "<span class=\"phone_number\">"+word+"</span><button type=\"button\">Call</button>";
    });
    if(str != new_str) {
        var div = document.createElement('div');
        div.className = "phone_div"
        //~ div.style.display = "inline";
        div.innerHTML = new_str;
        el.parentNode.replaceChild(div,el);
    }
}

findTelNumbers(document.body,findAndReplace);
//~ chrome.tabs.insertCSS(null, { file: '../css/phone.css' }); //inject CSS

var spans = document.getElementsByClassName("phone_number");
for(var x = 0; x < spans.length; ++x) {
    spans[x].style.backgroundColor ='yellow';
    var bt = spans[x].nextSibling; //potential code breaking point
    bt.addEventListener("click", onCallPressed , false);
}



//~ string = document.body.innerHTML;

//~ if(result){
    //~ chrome.extension.sendRequest({}, function(response) {});
//~ }
