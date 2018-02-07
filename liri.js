require("dotenv").config();

var arguement = process.argv[2];
var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var twitQuire = ("twitter");
var spotiFire = ("node-spotify-api");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var ombd = new OMDB(keys.omdb);

// What LIRI should be able to switch from

* `my-tweets`

* `spotify-this-song`

* `movie-this`

* `do-what-it-says`

// What it should be able to do
// node liri.js my-tweets
// This will show your last 20 tweets and when they were created at in your terminal/bash window

// node liri.js spotify-this-song '<song name here>'
// This will show the following information about the song in your terminal/bash window
// Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from
