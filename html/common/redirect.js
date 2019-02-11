const BASE_URL_ = "http://localhost";
const URL = BASE_URL_ + ":8070"; 
const SOCKET = io(URL);

SOCKET.on('connect', function()
{
    console.log('Common connect');
});

SOCKET.on('disconnect', function()
{
    console.log(`Common disconnect`);
});

SOCKET.on('redirect', function(location)
{
    window.location.href = location;
});