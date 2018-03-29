require("dotenv").config();

var fs = require('fs')
var path = 'random.txt'
var request = require("request");
var Twitter = require('twitter')
var Spotify = require('node-spotify-api')
var command = process.argv[2]
var search = process.argv.splice(3, process.argv.length)


var spotify = new Spotify( {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
})

var client = new Twitter ({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

console.log(command)

switch (command) {
    case 'my-tweets':
    var params = { screen_name: 'Node_bro'}
    var path = 'statuses/user_timeline'
    client.get(path, params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                var thisTweet = tweets[i].text
                var tweetTime = tweets[i].created_at
                console.log("\r\nTweet : " + tweetTime + '\r\n' + thisTweet + '\r\n')
                // var input = "\r\nTweet : " + tweetTime + '\r\n' + thisTweet + '\r\n'

            }
        }
    })
    break
    case 'spotify-this-song':
    spotify.search({ type: 'track', query: search, limit: 1}, function (err, data) {
        if (err) {
            return console.log('Uh oh, something went wrong!' + err)
        }
        var songArtist = data.tracks.items[0].artists[0].name
        var songTitle = data.tracks.items[0].name
        var songAlbum = data.tracks.items[0].album.name
        var songInfo = data.tracks.items[0].external_urls.spotify

        console.log('Artist: ' + songArtist + '\r\nSong : ' + songTitle + '\r\nAlbum : ' + songAlbum + '\r\nSong Link on Spotify: ' + songInfo
        )
    })
    break
    case 'movie-this':
    var movieURL = 'http://www.omdbapi.com/?apikey=trilogy&t=' + search
    request.get(movieURL, function (error, response, body) {
        if (error) {
            console.log('error:', error)
            console.log('statusCode:', response && response.statusCode)
        }
        var body = JSON.parse(body)
        var movieTitle = body.movieTitle
        var movieYear = body.movieYear
        var movieRating = body.imdbRating
        var movieRotten = body.Ratings[1].Value
        var movieCountry = body.Country
        var movieLanguage = body.Language
        var moviePlot = body.Plot
        var actors = body.Actors

        console.log('Movie: ' + movieTitle + '\r\nYear: ' + movieYear + '\r\nimdb Rating : ' + movieRating + ' / 10 \r\nRotten Tomatoes Rating : ' + movieRotten + '\r\nLanguage : ' + movieLanguage + '\r\nMovie Plot: ' + moviePlot + '\r\nActors : ' + actors)
    })
    break
    case 'do-what-it-says':
    fs.readFile(path, 'utf8', function(e, d) {
        if (e) { console.log(e) }
        command = console.log(command)
    })
    break
}










