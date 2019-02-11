const config = require("./config");
const PORT = 8070;
const helpers = 
{
    CryptoLibraryHelper: require('./CryptoLibraryHelper'),
    URLBuilderHelper: require('./URLBuilderHelper'),
}

const posts = []
const Post = require("./Post")
let current_user = {}


const IO = require('socket.io').listen(PORT);

IO.sockets.on('connection', function (socket) 
{
    console.log(`User ${socket.id} (${socket.handshake.address}) connected`);
    socket.on('snap data', function(data)
    {
        RegisterUser(socket, JSON.parse(data));
        socket.emit('redirect', "http://localhost:8080/feed");

    })

    socket.on('submit post', function(data)
    {
        data = JSON.parse(data);
        data.author = current_user.name;
        data.author_bitmoji = current_user.bitmoji;
        posts.push(new Post(data)); // Ideally we would verify this data LOL
        socket.emit('post update', JSON.stringify(posts[posts.length - 1].get_sync_object()));
    })

    socket.on('load feed', function()
    {
        socket.emit('get user data', JSON.stringify({
            name: current_user.name
        }))

        posts.forEach((post) => {
            socket.emit('post update', JSON.stringify(post.get_sync_object()))
        });
    })

    socket.on('navigate', function(nav)
    {
        if (nav == "Feed")
        {
            socket.emit('redirect', "http://localhost:8080/feed");
        }
        else if (nav == "Map")
        {
            socket.emit('redirect', "http://localhost:8080/map");
        }
    })
    
    socket.on('get map bitmojis', function()
    {
        const bitmojis = []

        posts.forEach((post) => {
            bitmojis.push({
                location: post.location,
                bitmoji: {avatar: post.author_bitmoji.avatar}
            })
        });

        socket.emit('map bitmojis', JSON.stringify(bitmojis));
    })
    
    socket.on('disconnect', function()
    {
        console.log(`User ${socket.id} (${socket.handshake.address}) disconnected`);
    });


});




// ******************** ExpressJS Server Main Logic ************************

var express = require('express');
var app = express();

var path = require('path');
const htmlPath = path.join(__dirname, 'html');

app.use(express.static(htmlPath));

var clientId = config.OATH2_CLIENT_ID;
var clientSecret = config.SNAP_SECRET_KEY;
var redirectUri = 'http://localhost:8080/oauth2';
var scopeList = ['https://auth.snapchat.com/oauth2/api/user.display_name', 'https://auth.snapchat.com/oauth2/api/user.bitmoji.avatar'];

app.get('/oauth2', function(req, res){
  // Generate query parameters
  var state = helpers.CryptoLibraryHelper();

  // Build redirect URL
  var getRedirectURL = helpers.URLBuilderHelper.getAuthCodeRedirectURL(clientId, redirectUri, scopeList, state);
}); 

function RegisterUser(socket, data)
{
    const name = data.data.me.displayName;
    const bitmoji = data.data.me.bitmoji;
    const user_id = GetUserId();

    current_user = {user_id, name, bitmoji, user_id, socket}
    config.users.push({user_id, name, bitmoji, user_id, socket})
}

function GetUserId()
{
    return config.user_id++;
}

app.listen(8080);
console.log("Server listening...");

setInterval(() => {}, 500);