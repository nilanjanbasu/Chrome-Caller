$(function() {
    //~ $("#notification_bar").fadeIn(30).fadeOut(3000);
    
    function notify(msg) {
        $("#notification_bar").text(msg);
        $("#cont").fadeIn(30).delay(3000).fadeOut(300); //notify
    }    
    
    $("#save").on("click", function(){
        var username = $("#uname").val();
        var password = $("#passwd").val();
        var password_rep = $("#passwd_rep").val();
        
        //~ alert(username + password + password_rep);
        if(username && password && password_rep){ 
            if( password == password_rep)  {
                localStorage["plivoUsername"] = username;
                localStorage["plivoPassword"] = password;
                notify("Saved Successfully");
            } else {
                notify("Passwords do not match. Please try again");                
            }
        } else {
            notify("Please fill all the fields");
        }
    });
    
});
