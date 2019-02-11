let map;
let mapLoaded = false;
let bitmojiReceived = false;

function initMap() {
        
    google.maps.event.addListenerOnce(map, 'idle', function(){
    });


}

$(document).ready(function() 
{
	const BASE_URL_ = "http://localhost";
  	const URL = BASE_URL_ + ":8070"; 
    
    const CLIENT_ID = "SNAP_OAUTH_ID"

    window.snapKitInit = function () {
      var loginButtonIconId = 'login-button';
        // Mount Login Button
        snap.loginkit.mountButton(loginButtonIconId, {
          clientId: CLIENT_ID,
          redirectURI: BASE_URL_ + ":8080/",
          scopeList: [
            'user.display_name',
            'user.bitmoji.avatar',
          ],
          handleResponseCallback: function() {
            snap.loginkit.fetchUserInfo()
              .then(data => {
                // send to server
					SOCKET.emit("snap data", JSON.stringify(data));
              })
          },
        });
      };

      // Load the SDK asynchronously
      (function (d, s, id) {
        var js, sjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://sdk.snapkit.com/js/v1/login.js";
        sjs.parentNode.insertBefore(js, sjs);
      }(document, 'script', 'loginkit-sdk'));



})
