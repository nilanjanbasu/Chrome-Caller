/* Global Variables*/

var phoneNoFound = false;

/*End Global Variables */

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
    //~ var regex = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/g ;
    //~ var regex = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|c2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}/g;
    var regex = /(?:\(?\+?\d{1,3}\)?)?[\s\./-]*(\(?\d{3}\)?[\s\./-]*\d{3}[\s\./-]*\d{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/g;
    var new_str =  str.replace(regex, function(word){
        phoneNoFound = true;
        var style = "";
        console.log("Found a replacable string");
        return "<span class=\"phone_number\">"+word+"</span><button type=\"button\">Call</button>";
    });
    if(str != new_str) {
        var div = document.createElement('div');
        div.className = "phone_div";
        //~ div.style.display = "inline";
        div.innerHTML = new_str;
        el.parentNode.replaceChild(div,el);
    }
}

findTelNumbers(document.body,findAndReplace);

var spans = document.getElementsByClassName("phone_number");
for(var x = 0; x < spans.length; ++x) {
    spans[x].style.backgroundColor ='yellow';
    var bt = spans[x].nextSibling; //potential code breaking point
    bt.addEventListener("click", onCallPressed , false);
}
if(phoneNoFound) {
    chrome.extension.sendMessage({found_numbers : true},function(response){});    
}

//~ string = document.body.innerHTML;

//~ if(result){
    //~ chrome.extension.sendRequest({}, function(response) {});
//~ }
