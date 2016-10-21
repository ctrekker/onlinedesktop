# onlinedesktop

[![Join the chat at https://gitter.im/onlinedesktop/chat](https://badges.gitter.im/onlinedesktop/chat.svg)](https://gitter.im/onlinedesktop/chat?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)  
A desktop that can be accessed from anywhere!

This program, being a web application is built primarly with JavaScript. Some internal PHP code is used for user tracking (sign-ins) and 
MySQL data storage.

The main focus of this program is to be able to make application publication and usage easier, as well as adding the capabilities for a 
desktop-like website with the same capabilities as a desktop, that can be accessed with a username and password from any computer in the 
world. Of course, this means that security is also key, and that extra precautions are needed to be taken before publicly releasing this 
project on a domain. If you see any security holes anywhere in my PHP (which can be located in a few locations which are listed below) code,
please let me know using issues, or make a pull request with the fix. I will examine either your issue or pull request and make sure it 
is valid.

##Where to find programs##
###JavaScript###
The main JavaScript code can be found in the /core/lib/js directory. The main controller js file is OS.js, which contains all the display 
and base code used for creating and initializing the desktop. Various code that is executed in Web Workers can be found scattered about in 
the directories, but primarily, the main Worker library is called lang.js, and can be located in the /core/os/lang.js directory.

###PHP###
Most of the php libraries are found in thhe /core/lib/security folder. The PHP pages used for displaying data are indexes, which are 
either located in the root, or are found in /user. The get.php, set.php, and other php files located in /user are also utilities that 
are used both in the PHP code, and used in AJAX in JavaScript code. More can be learned about these files in the wiki.
