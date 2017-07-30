Captive Portal
==============
A captive portal written in express which stores user data in a MongoDB database and then authenticates the user on a UniFi controller.

Dependencies
============

* Node.js
* MongoDB

How to install
==============

1. Clone repository
2. Go to project root
3. Run `npm install`
4. (Optional, if running MongoDB on localhost) Create a directory called `data`
5. (Optional, same as 4) run `mongod --dbpath < path-to-project >\data`
6. Replace the placeholder info in `config.json` with correct data
7. `npm start` (run with sudo if using on Linux)

config.json
===========
The `config.json` file is used in order to configure the app. Here you can enter the following:
* UniFi Controller credentials (in the controllerAuth object), site and server
* MongoDB server, port and credentials
* The fields you want to store in the database
* The messages you want to show on the login, register and final page

Site selection
--------------
There are two ways to select the site you want to use. You can either
* use the site id, which you can find by analyzing the network requests sent by the controller to the `/api/stat/sites` endpoint, OR
* use the site name (easier, but slower at first access since it has to look up the id - the server caches it for faster access in future requests, though)
Either can be specified as an object in the `site` object. By default the server will look for the id, and if it is not specified, it will fallback to using the name.

Fields
------
THe fields are defined as objects inside the `fields` object of `config.json`. The key represents the string by which the value is stored in the database, and the value is an object with the following properties:
* `displayName` (string) which represents the name that should be displayed to the user (required)
* `required`  (boolean) defines whether the field is required or not
* `email` (boolean) defines whether the field is for an email address
* `tel` (boolean) defines whether the field is for a phone number
* `password` (boolean) defines whether the field is for a password
* `login` (boolean) defines whether the field should be shown on the login page and used to check if the user is already registered
* `regex` (string) a regex pattern to validate the field
* `hint` (string) a message to be shown to the user when the input does not match the regex rule

Messages
--------
There are three strings in the `messages` object:
* `login` which is shown on the login page
* `register` which is shown on the registration page
* `multumesc` which is shown on the final page