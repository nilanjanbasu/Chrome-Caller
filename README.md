Chrome-Ca3ller
=============

Chrome Extension to call a number which is embedded in a webpage. 

Instructions
------------

1. Clone the repository and from your Google Chrome extensions dashboard, select "load unpacked extension" and point it to extension directory of cloned repo. The extension should be loaded. Note that you need at least version 23 of Chrome/Chromium.

2. Go to options of Chrome-Caller from extension dashboard and enter your username and password there. Please make sure that the username is that of a valid endpoint that you created in Plivo.com and not your account login email id.

3. Create an application associated with the endpoint you wish to use at Plivo.com and enter these:
>* Answer url: http://stormy-plateau-8636.herokuapp.com/dialxml/
>* Answer Method: GET
>* Leave all the other fields blank.(Hang up url is filled up automatically if you do this. So just fill it up with an arbitrary url but not the base url which may make Plivo call again on hang up.).

4. Now load up any webpage that has a valid phone number embedded in it. The numbers will be highlighted in yellow and a call button will be visible beside it. Clicking call would create a new popup window and you can call the number from there. The phone number patterns that were tested are:
>1. 1-234-567-8901
>2. 1-234-567-8901 x1234
>3. 1-234-567-8901 ext1234
>4. 1 (234) 567-8901
>5. 1.234.567.8901
>6. 1/234/567/8901
>7. 12345678901
>8. 919748327244
>9. +919748327244
>10. (+91) 9748327244
>11. (91) 9903782663
>12. (+91) 9748327244
>13. (+91)3325643809
>14. 919038235262

Please report the cases where a number is in the webpage but does not get highlighted.