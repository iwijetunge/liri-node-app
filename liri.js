require("dotenv").config();

var moment = require('moment');
var request = require("request");
let axios = require("axios");

const fs = require("fs");
const keys = require("./keys");

var Spotify = require('node-spotify-api');

var spotify = new Spotify({
    id: keys.id,
    secret: keys.secret
});

function getCommand(array) {
    return array.slice(2)[0];
}

function getSearchTerm(array) {
    return array.slice(3).join(" ");
}

function omdbAPICall(movie) {
    if (movie == "") {
        movie = "Mr. Nobody"
    }
    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            console.log("The title of the movie is : " + response.data.Title);
            console.log("The year the movie came out : " + response.data.Year);
            console.log("The IMDB rating of the Movie is : " + response.data.Ratings[1].Value);
            console.log("The country where the movie was produced : " + response.data.Country);
            console.log("The language of the move was : " + response.data.Language);
            console.log("The Plot of the move was : " + response.data.Plot);
            console.log("The actors in the movie were : " + response.data.Actors);
        }
    );

}
function bandsInTownAPICall(band) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp";
    request(queryUrl, function (error, response, body) {
        // If the request is successful
        if (!error && response.statusCode === 200) {
            var concerts = JSON.parse(body);
            for (var i = 0; i < concerts.length; i++) {
                console.log("----------------EVENT INFO-----------------------");
                console.log("Name of the Venue: " + concerts[i].venue.name);
                console.log("Venue Location: " + concerts[i].venue.city);
                console.log("Date of the Event: " + moment(concerts[i].datetime).format('MM/DD/YYYY' + "\n"));
                //console.log("-------------------------------------------------");            
            }
        } else {
            console.log('Error occurred.');
        }
    });
}
function spotifyAPICall(song) {
    if (!song) {
        song = 'The Sign';
    }

    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        //console.log(JSON.stringify(data,null,2));
        var songInfo = data.tracks.items;
        console.log("Artist(s): " + songInfo[0].artists[0].name);
        console.log("Song Name: " + songInfo[0].name);
        console.log("Preview Link: " + songInfo[0].preview_url);
        console.log("Album: " + songInfo[0].album.name);

    });
}

function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function (error, text) {
        if (error) throw error;

        const textArray = text.split(",");
        startLiri(textArray[0], textArray[1]);
    });
}

function startLiri(command, searchTerm) {
    console.log("command: ", command);


    switch (command) {
        case "spotify-this-song":
            return spotifyAPICall(searchTerm);

        case "movie-this":
            return omdbAPICall(searchTerm);

        case "concert-this":
            return bandsInTownAPICall(searchTerm);

        case "do-what-it-says":
            return doWhatItSays();

        default:
            console.log("please enter a valid command");
    }
}
startLiri(getCommand(process.argv), getSearchTerm(process.argv));