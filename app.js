var morgan  = require('morgan');
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var port    = process.env.PORT || 3000;
var keys    = require('./secrets');

app.set('views', './views');
app.set('view engine', __dirname, 'html');
app.use(express.static(__dirname + '/views'));


var Twit = require('twit');

var twitter = new Twit({
  consumer_key:        keys.consumerKey,
  consumer_secret:     keys.consumerSecret,
  access_token:        keys.accessToken,
  access_token_secret: keys.accessTokenSecret
});

app.get('/', function(req, res){
  res.render('./views/index.html')
});

server.listen(port)
console.log('listening on port: ' + port)


var io = require('socket.io')(server);

var stream = twitter.stream('statuses/filter', { track: 'javascript' });

io.on('connect', function(socket) {
  stream.on('tweet', function (tweet) {
  var data = {};
    data.name = tweet.user.name;
    data.screen_name = tweet.user.screen_name;
    data.text = tweet.text;
    data.user_profile_image = tweet.user.profile_image_url;
    socket.emit('tweets', data);
  });
});


console.log(stream)
