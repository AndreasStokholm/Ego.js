#Ego.js

##What?
Ego.js is a simple Node web app that lets you track statistics from your twitter and analytics (More services to come, feel free to add one yourself, just do a pull request). It's optimized for iPhone like displays.

##Why?
Friday the 19th of October 2012 the awesome app Ego for iPhone was temporarily discontinued, and I didn't like that one bit. I read the news while on a 5 hour train, and though I could make my own replacement while they rewrite their own app. So that's what I did. It took a bit longer than the 5 hour trip though.

##How?
Simply run the server.js file in the folder server. There is currently some nasty looking code that requires you to actually be in the folder when you run the code. When you've started you're running your very own version of Ego.js on port 8080.

##Widgets
A bit of info on how to add widgets. They're stored in localStorage, on your device. Beware that potential passwords are sent as cleartext in the URL.

###Twitter
Just put in the name of the twitter user you want followers count for. (Currently working on showing more metrics)

###Google Analytics
Put in your username and password in the two first fields. Next go to google.com/analytics and select the site you're interested in tracking. Now click Admin in the top right side. Click one of the profiles in the table showed, and finally go to "Profile settings".
Put in the Profile ID, under the username and password. In the last field you put the name of the site.

##Want to help?

Do you know I'm doing something horribly wrong? - Please do a pull request with a fix, and I will gladly take a look at your code and implement it if it's smarter than my solution.

Designer? Would you mind helping me making this look better? Please contact me on [twitter](https://twitter.com/stkhlm) or here at github.