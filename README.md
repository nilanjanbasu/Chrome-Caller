Chrome-Caller
=============

Chrome Extension to call a number which is embedded in a webpage. 

Instructions
------------

1. Clone the repository and from your Google Chrome extensions dashboard, select "load unpacked extension" and point it to extension directory of cloned repo. The extension should be loaded. Note that you need at least version 23 of Chrome/Chromium.

2. Go to options of Chrome-Caller from extension dashboard and enter your username and password there. Please make sure that the username is that of a valid endpoint that you created in Plivo.com and not your account login email id.

3. Create an application associated with the endpoint you wish to use at Plivo.com and enter these:
>* Answer url: http://stormy-plateau-8636.herokuapp.com/dialxml/
>* Answer Method: GET
>* Leave all the other fields blank.(Hang up url is filled up automatically if you do this).

4. Now load up any webpage that has a valid phone number embedded in it. The numbers will be highlighted in yellow and a call button will be visible beside it. Clicking call would create a new popup window and you can call the number from there. 

Please report the cases where a number is in the webpage but does not get highlighted.