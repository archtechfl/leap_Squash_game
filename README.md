leap_Squash_game
================

This is a game that combines leapJS, nodeJS, and threeJS to create a multiplayer squash experience.

Steps to get up and running

1) node must be installed on your machine. You can get the node installer here: http://nodejs.org

2) Verify that Node Package Manager is installed and running by entering this on your command line "npm --version". You should get a version number

2) Download the leap_Squash_game directory

3) in terminal or command prompt, change the current working directory to your leap_Squash_game folder

4) Run the command "npm install" to install the dependencies for the game

5) If one does not already exist, create a folder called "node_modules" at the highest level of your main drive (windows) or your user directory (mac) and relocate socket.io and express there

6) Move the leapJS and three folders to the public folder in the leap Squash app

7) in the public folder, open groupLeap.js and change the following on line 2

  var socket = io.connect('http://your_IP:3700'); 
  
  Update "your_IP" to reflect the IP address on your network (this is the address assigned by your LOCAL network, NOT the external IP that your network is assigned by your ISP.
  
8) Once this is done, make sure your current working directory is leap_Squash_game

9) plug in your leap motion controllers and make sure the desktop indicator is green and it is tracking

10) Run "node index.js" to start the app

11) Navigate to http://localhost:3700/gamePlay.html to bring up the start screen

12) Your opponent should navigate to yourIP:3700/gamePlay.html to start

13) Once both players have clicked "Let's play", a 3 second countdown will begin and then the game will start
