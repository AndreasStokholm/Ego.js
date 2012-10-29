#Ego.js

##What?
Ego.js is a simple Node web app that lets you track statistics from your twitter and analytics (More services to come, feel free to add one yourself, just do a pull request). It's optimized for iPhone like displays.

![Ego.js](https://dl.dropbox.com/u/29198/ego.js.png "Screenshot of Ego.js")

##Why?
Friday the 19th of October 2012 the awesome app Ego for iPhone was temporarily discontinued, and I didn't like that one bit. I read the news while on a 5 hour train, and though I could make my own replacement while they rewrite their own app. So that's what I did. It took a bit longer than the 5 hour trip though.

##How?
Simply run the server.js file, like shown below. When you've started you're running your very own version of Ego.js on port 8080.

`node server.js`

If port 8080 is taken on your server, then just supply a -p and a port number after the file name, like this:

`node server.js -p 1234`

##Widgets
A bit of info on how to add widgets. They're stored in localStorage, on your device. Beware that potential passwords are sent as cleartext in the URL.

###Twitter
Just put in the name of the twitter user you want followers count for. (Currently working on showing more metrics)

###Google Analytics
Put in your username and password in the two first fields. Next go to google.com/analytics and select the site you're interested in tracking. Now click Admin in the top right side. Click one of the profiles in the table showed, and finally go to "Profile settings".
Put in the Profile ID, under the username and password. In the last field you put the name of the site.

##Icon
The icon is generated automatically according to the widgets you have on your screen. It's not super pretty, but I had fun making it.

##Want to help?

Do you know I'm doing something horribly wrong, or got some nifty thing you wanna add? - Please do a pull request with a fix or addition.

Designer, comments or other? Please contact me on [twitter](https://twitter.com/stkhlm).