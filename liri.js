require("dotenv").config();

var arguement = process.argv[2];
var searchItem = process.argv[3];
var searchLimit = 20;
var fs = require("fs");
var request = require("request");
var keys = require("./key.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

var spotifykey = new Spotify(keys.spotify);
var twitterkey = new Twitter(keys.twitter);
var omdb = keys.omdb.apikey;



// The switch and cases for what to do based on the arguement
switch (arguement) {
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
  default:
    console.log(
      "\r\n" +
      "LIRI is here to respond to whatever request you have. As long as it has to do with twitter, spotify, or omdb" +
      "\r\n" +
      "First type node liri.js then you have the choice between the commands:" +
      "\r\n\n" +
      " - my-tweets: + a twitter username to call the last 20 tweets of that user" +
      "\r\n\n" +
      " - spotify-this-song: + a song title to return song title and info that meet your request" +
      "\r\n\n" +
      " - movie-this: + a movie title will bull in information for that movie." +
      "\r\n\n" +
      " - do-what-it-says: will call the song 'I Want It That Way' by the Backstreet Boys." +
      "\r\n\n" +
      "The only catch is to put all requests in quotation marks or else I won't be able to understand you."
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
  twitterkey.get("statuses/user_timeline/", parameters, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      console.log(`Here are ${searchItem}'s latest tweets:\n`);
      for (let i = 0; i < searchLimit; i++) {
        var tweetresponses =
          "================================\n\n" +
          tweets[i].text + "\n";
        console.log(tweetresponses);
        logtxt(tweetresponses);
      }
    } else console.log("Sorry I couldn't fullfil your Twitter resquest. Please try again.");
  });
}

// Spotify Function
function spotifyAPI(txtFileSong) {
  if (!searchItem && txtFileSong) {
    searchItem = txtFileSong;
    searchLimit = 1;
  } else if (!searchItem && !txtFileSong) {
    searchItem = "The Sign";
    searchLimit = 5;
  }
  spotifykey.search({
    type: "track",
    query: searchItem,
    limit: searchLimit
  }, function(error, data) {
    if (error) {
      return console.log("Sorry I couldn't fullfil your Spotify resquest. Please try again.")
    }
    // console.log(data.tracks.items);
    for (let i = 0; i < searchLimit; i++) {
      var songInfo = data.tracks.items;
      var artistsResponse = songInfo[i].artists;
      var artistArray = [];
      var previewLink = "";
      var album = songInfo[i].album.name;
      // console.log(album);
      if (songInfo[i].preview_url === null) {
        previewLink = "N/A";
        // Add album information
      } else previewLink = songInfo[i].preview_url;

      for (let j = 0; j < artistsResponse.length; j++) {
        if (artistsResponse[j].hasOwnProperty("name")) {
          artistArray.push(artistsResponse[j].name)
        }
      };
      var artistName = artistArray;

      var songResults =
        "\n\n================================\n\n" +
        "Artist: " + artistName + "\n" +
        "Song: " + songInfo[i].name + "\n" +
        "Album: " + album + "\n" +
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
  var queryUrl = "http://www.omdbapi.com/?i=tt3896198&t=" + searchItem + "&apikey=" + omdb;
  request(queryUrl, function(error, response, body) {

    // change code to searchLimit after testing
    if (!error && response.statusCode === 200) {
      var omdbResponse = JSON.parse(body)
      var rottenTomatoesRating = omdbResponse.Ratings[1].Value;;

      var omdbResults =
        "\n\n===============================\n\n" +
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
    } else console.log("Sorry I couldn't fullfil your OMDB resquest. Please try again.");
  });
}

// Function to grab from Text file
function other() {
  fs.readFile("./random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var txtFileArray = data.split(",");
    txtFileSong = txtFileArray[1];
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
