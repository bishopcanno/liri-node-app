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
      fsRandom();
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

// bandsintown api
function bandTour(search) { // bandsintown API function with a parameter of search that will ne injected into the query Url for the API call/request

    var queryUrl = `https://rest.bandsintown.com/artists/${search}/events?app_id=codingbootcamp`; // cleaner to define url outside of the request function. 
    // the ${search} is what is called a template literal and it is bad ass when concatenating variables into strings. 
    // Instead of "http://thisurl.com/" + variable + "/restoftheurl/", you simply write` http://thisurl.com/${variable}/restoftheurl/` using the 
    // tick marks to surround the entire string.
 
    request(queryUrl, function (error, response, body)  { // do a request with the queryUrl variable
 
        if (error) console.log(`There was an error getting tour data for ${search}.`); // if there is an error, console where the error is happening.
        if (!error && response.statusCode === 200) { // if there isn't an error
            var data = JSON.parse(body, null, 2); // parse the body data
            console.log(data); // log if necessary
            data.forEach(function(event) { // iterate through all objects in the data and do this/pull this data for each object contained in the response
                console.log(`Show Lineup: ${event.lineup[0]}\nShow Date: ${moment(event.datetime).format("MM-DD-YYYY")}\nVenue: ${event.venue.name}\nLocation: ${event.venue.city}, ${event.venue.region}\n`); // an example of what a template literal console.log looks like. One line and one console log. Pretty dope.
            });           
        };
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
function fsRandom(){
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }

        // console.log(data);

        var dataArr = data.split(",");
      
        console.log(dataArr[1]);
      
        spotifySong(dataArr[1]);
      });
}
