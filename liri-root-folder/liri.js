// All npm's and files needed
require("dotenv").config();
var request = require("request");
var fs = require("fs");
var inquire = require("inquirer");
var moment = require("moment");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");

// kind of an intro to the app, a little pointless because it wouldnt run until after the user put info into the command line
console.log("\n\nWelcome to LIRI!\n\nYou can find out when a band is in town by using the search command concert-this followed by the name of the band or artist")
console.log("\nYou can find songs through Spotify using the command spotify-this-song followed a song title\n\nYou can find any movie using the search movie-this followed by a film title")
console.log("\nLastly you can take a random chance and see what others have searched for by using the do-what-it-says command\n")

// argv array postions, index two will be the command from the user, index 3 will be the search term, sliced and joined so that it can handle multiple worded searches
var command = process.argv[2];
var term = process.argv.slice(3).join(" ");

// switch that looks for the argv[2] command from the user and executes the right funtion. If the correct commands arent used it logs directions with the optional commands
// where need it takes the users input and inserts it as an argument for the functions that it executes
switch (command) {
    case "concert-this":
      bandTour(term);
      break;
    
    case "spotify-this-song":
      spotifySong(term);
      break;
    
    case "movie-this":
      movieInfo(term);
      break;
    
    case "do-what-it-says":
      lotto();
      break;
    
    default:
      console.log("\nThis search command is not supported by LIRI\n\nPlease use: concert-this / spotify-this-song / movie-this / do-what-it-says \n")    
}

// function that turns all the first letters of strings to capital letters, regardless of how many words are in a string 
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// function for bandsintown api, lacks much of the requisit functionality currently
function bandTour(search){
    
    request("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp", function(error, response, body){
        
    if (!error && response.statusCode === 200) {
            
            var data = JSON.parse(body, null, 2);

            console.log(data);
            
            console.log(data.venue.name);

            console.log(data.offers.body.venue.name);
            
            console.log(JSON.parse(body.venue.name));

        }
    }); 
}   

// spotify npm
function spotifySong (searchSong){
    
    var spotify = new Spotify(keys.spotify);
   
    spotify.search({ type: 'track', query: searchSong }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        // converts the users song input so that all the first letters of words are upper case
        var songTitle = toTitleCase(searchSong);

        // displays song in uppercase, album, artist, and a url
        console.log("Song: " + songTitle) 
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
        console.log("Url: " + data.tracks.items[0].album.artists[0].external_urls.spotify);
      });
}

// movie info function
function movieInfo(search){
    
    request("http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy", function(error, response, body) {       
        if (!error && response.statusCode === 200) {
            
            var data = JSON.parse(body, null, 2);

            // displays the title, year, rating, language, summary, and actors
            console.log("Title: " + data.Title);
            console.log("Year: " + data.Year);
            console.log("IMDB Rating: " + data.imdbRating);
            console.log("Native Language: " + data.Language);
            console.log("Summary: " + data.Plot);
            console.log("Actors: " + data.Actors);
        }
    });
}

// goes into the random.txt file and extracts the info stored there, currently lacks any functionality
function lotto(){
    console.log("lotto functon executed");
}
