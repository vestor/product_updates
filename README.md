This is a simple Hapi-SocketIO-ReactJS application for showing product updates to a user. It has a simple template as well, from where the content editors can enter their own updates (with proper HTML content).

To run it, just install the all the node modules with npm init. And start the server with node server.js or nodejs server.js

Also, currently there is a userId field which is by default populated as 1. We need to get it from the session (or some other way) to uniquely identify a user.


URLs

For viewing updates: <HOSTNAME>/main.html
For adding new updates: <HOSTNAME>/insert
For refreshing everything: <HOSTNAME>/refresh

The mongo and server config are defined in config.js
