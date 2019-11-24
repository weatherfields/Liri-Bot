// required files, methods, packages, etc
require("dotenv").config();
const keys = require("./keys.js");
let fs = require('fs');
let axios = require("axios")
// let request = require("request");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
let omdb_key = keys.omdb
// let bandsintown = (keys.bandsintown);
const moment = require("moment");

// Terminal commands/inputs
let userChoice = process.argv[2];
let userSearch = process.argv.slice(3).join(" "); // because 2 is the actual search term "andy griffith" for example

// console.log(process.argv); // argv = argument vector 
// switch statement for user inputs to terminal
function userCommand(userChoice, userSearch) {
    switch (userChoice) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this-song":
            spotifyThisSong();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-what-it-says":
            doThis(userSearch);
            break;
        default:
            console.log('Please try again');
    }
}
// call userCommand
userCommand(userChoice, userSearch);

// spotify search function

function spotifyThisSong() {
    // console.log("hey! You are now in a spotify search");
    if (!userSearch) {
        userSearch = "the sign ace of base"
    }
    spotify.search({
        type: 'track',
        query: userSearch
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log(data.tracks.items.forEach(function (item, index) {

            item.artists.forEach(function (artist, index) {

                console.log(artist);
            })


        }));
    });
}


// bands in town function
// https://rest.bandsintown.com/artists/celine+dion/events?app_id=codingbootcamp
function concertThis() {
    const bandThis = "https://rest.bandsintown.com/artists/" + userSearch + "/events?app_id=codingbootcamp";
    console.log(bandThis);

    axios.get(bandThis).then(
        function (response, err) {

            if (err) {
                return console.log('Error occurred: ' + err);
            }
            for (show of response.data) {
                // console.log(show);
                let dateTime = show.datetime;
                let moMent = dateTime.split('T');
                let newTime = moment(moMent[0]).format("MM/DD/YYYY");

                console.log(
                    "Venue: " + (show.venue.name) +
                    "\nLocation: " + (show.venue.city) + ", " + (show.venue.region ? show.venue.region + ", " : "") + (show.venue.country) +
                    "\nDate: " + newTime + "\n");
            }
        }
    )
}

// omdb function
function movieThis() {

    if (!userSearch) {
        userSearch = 'Mr. Nobody';
        console.log("-----------------------------------------------");
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
        console.log("-----------------------------------------------");
    }

    axios.get('http://www.omdbapi.com/?apikey=' + omdb_key + '&t=' + userSearch).then(function (response) {

        // console.log(response);
        console.log("-----------------------------------------------\r\n\r\n");
        console.log(
            "Title: " + response.data.Title +
            "\nYear: " + response.data.Year +
            "\nIMDB Rating: " + response.data.Ratings[0].Value +
            "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
            "\nProduction Location: " + response.data.Country +
            "\nLanguage: " + response.data.Language +
            "\nPlot: " + response.data.Plot +
            "\nActors: " + response.data.Actors);
        console.log("\r\n\r\n-----------------------------------------------");
    })
}
// use the built in readFile method to use random.txt
function doThis() {
    fs.readFile('./random.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log("Errors occured: " + err);
        }
        // } else { // separate objects at comma with .split
        let daTa = data.split(",");
        // use random.txt objects as search parameters 
        userChoice = daTa[0];
        userSearch = daTa[1];
        // call the userCommand function with set parameters
        userCommand(userChoice, userSearch);

    });
};