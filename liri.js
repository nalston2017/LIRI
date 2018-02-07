require("dotenv").config();

var arguement = process.argv[2];
var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var twitQuire = ("twitter");
var spotiFire = ("node-spotify-api");

var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);
var ombd = keys.omdb.apikey;

// The switch and cases for what to do based on the arguement
switch (arugement) {
  case "my-tweets": twitterAPI(); break;
  case "spotify-this-song": spotifyAPI(); break;
  case "movie-this": "OMDB function"; break;
  case "do-what-it-says": "random function"; break;

  console.log(
    "\r\n" +
    "LIRI is here to respond to whatever request you have. As long as it has to do with twitter, spotify, or OMBD" +
    "\r\n" +
    "First type node liri.js then you have the choice between the commands:" +
    "\r\n\n"
    " - my-tweets: + a twitter username to call the last 20 tweets of that user" +
    "\r\n\n" +
    " - spotify-this-song: + a song title to return song title and info that meet your request" +
    "\r\n\n" +
    " - movie-this: + a movie title will bull in information for that movie." +
    "\r\n\n" +
    " - do-what-it-says: will call the song 'I Want It That Way' by the Backstreet Boys." +
    "\r\n\n" +
    "The only catch is to put all requests in quotation marks (" ") or else I won't be able to understand you."
  );
}

////////////////
////Functions//
///////////////

function twitterAPI() {
  var userName = process.argv[3];
  if(!userName) {
    userName = "FiftyShades";
  }
  parameters = {
    screen_name: userName
  };
  twitQuire.get("statuses/user_timeline/", parameters, function (
    error,
    tweets,
    response
  ) {
    if (!error) {
      console.log(`Here are ${userName}'s latest tweets:\n`);
      for (let i = 0; i < 20; i++) {
        var tweetSponses =
        "================================ \n\n" +
        tweetSponses[i].text + "\n";
        console.log(tweetSponses);
        logdata(tweetSponses);
      }
    } else console.log("Sorry I couldn't fullfil your resquest. Please try again.")
  });
}

function spotifyAPI() {

}
