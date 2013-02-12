$(function() {
    
    $("#save").on("click", function(){
        var username = $("#uname").val();
        var password = $("#passwd").val();
        var password_rep = $("#passwd_rep").val();
        
        alert(username + password + password_rep);
        if( (username && password && password_rep) && ( password == password_rep) ) {
            alert("Validated");
        } else {
            return false;
        }
    });
    
});
