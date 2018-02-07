require("dotenv").config();

var arguement = process.argv[2];
var searchItem = process.argv[3];
var searchLimit = 20;

var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var twitQuire = require("twitter");
var spotiQire = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);
var ombd = keys.omdb.apikey;

// The switch and cases for what to do based on the arguement
switch (arugement) {
  case "my-tweets":
    twitterAPI();
    break;
  case "spotify-this-song":
    spotifyAPI();
    break;
  case "movie-this":
    OMDBAPI();
    break;
  case "do-what-it-says":
    other();
    break;

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
      "The only catch is to put all requests in quotation marks ("
      ") or else I won't be able to understand you."
    );
}

////////////////
////Functions//
///////////////

// Twitter Function
function twitterAPI() {
  if (!searchItem) {
    searchItem = "FiftyShades";
  }
  parameters = {
    screen_name: searchItem
  };
  twitQuire.get("statuses/user_timeline/", parameters, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      console.log(`Here are ${userName}'s latest tweets:\n`);
      for (let i = 0; i < searchLimit; i++) {
        var tweetSponses =
          "================================ \n\n" +
          tweetSponses[i].text + "\n";
        console.log(tweetSponses);
        logtxt(tweetSponses);
      }
    } else console.log("Sorry I couldn't fullfil your resquest. Please try again.");
  });
}

// Spotify Function
function spotifyAPI(txtFileSong) {
  if (!searchItem && txtFileSong) {
    searchItem = txtFileSong;
  } else if (!searchItem && !txtFileSong) {
    searchItem = "The Sign";
  }
  spotiQire.search({
    type: "track",
    query: searchItem,
    limit: searchLimit
  }, function(error, data) {
    if (error) {
      return console.log("Sorry I couldn't fullfil your resquest. Please try again.")
    }
    console.log(data.tracks.items);
    for (let i = 0; i < searchLimit; i++) {
      var songInfo = data.tracks.items;
      var artistsResponse = data.tracks.items[0].artists;
      var artistArray = [];
      var previewLink = "";
      if (songInfo[i].preview_url === null) {
        previewLink = "N/A";
// Add album information
      } else previewLink = songInfo[i].preview_url;

      for (let j = 0; j < artistsResponse.length; j++) {
        if (artistsResponse[j].hasOwnProperty("name")) {
          artistArray.push(artistsResponse[j].name)
        }
      };
      var artistName = artistArray.name;

      var songResults =
        "================================ \n\n" +
        "Artist: " + artistName[i] + "\n" +
        "Album: " + songInfo[i].name + "\n" +
        "Preview Link: " + previewLink;
      console.log(songResults);
      logtxt(songResults);
    }
  });
}

// OMDB Function
function OMDBAPI() {
  if (!searchItem) {
    searchItem = "Mr. Nobody";
  }
  var queryUrl = "http://www.omdbapi.com/?i=tt3896198&t=" + searchItem + "&apikey=" + ombd;
  request(queryURL, function(error, response, body) {

    // change code ti searchLimi after testing
    if (!error && response.statusCode === 200) {
      var omdbResponse = JSON.parse(body)
      var rottenTomatoesRating = "";
      console.log("body:", omdbResponse);
      if (omdbResponse.hasOwnProperty(omdbResponse.Ratings[1])) {
        rottenTomatoesRating = omdbResponse.Ratings[1].Value;
      } else rottenTomatoesRating = "N/A";
      var omdbResults =
        "================================ \n\n"
      "Title: " + omdbResponse.Title + "\n" +
        "Year: " + omdbResponse.Year + "\n" +
        "IMDB Rating: " + omdbResponse.imdbRating + "\n" +
        "Rotten Tomatoes Rating: " + rottenTomatoesRating + "\n" +
        "Country: " + omdbResponse.Country + "\n" +
        "Language: " + omdbResponse.Language + "\n" +
        "Plot: " + omdbResponse.Plot + "\n" +
        "Actors: " + omdbResponse.Actors + "\n" +
        "Awards: " + omdbResponse.Awards + "\n\n" +
        "================================";
      console.log(omdbResults);
      logtxt(omdbResults);
    } else console.log("Sorry I couldn't fullfil your resquest. Please try again.");
  });
}

// Function to grab from Text file
function other() {
  fs.readFile("./random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var txtFileArray = data.split(",");
    var txtFileSong = txtFileArray[1];
    spotifyAPI(txtFileSong);
  });
}

// Log to log.txt
function logtxt(data) {
  fs.appendFile("log.txt", data, function(error) {
    if (error) {
      console.log(error);
    }
  });
}
