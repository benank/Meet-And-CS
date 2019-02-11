

let map_mini;
let marker = false;
function initMap2() {
    map_mini = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 38.537699, lng: -121.7520045},
		zoom: 15,
		disableDefaultUI: true
    });
        
    google.maps.event.addListenerOnce(map_mini, 'idle', function () {
        GoogleMapLoaded_();
    });
}

function GoogleMapLoaded_()
{
    google.maps.event.addListener(map_mini, 'click', function(event) {                
        //Get the location that the user clicked.
        var clickedLocation = event.latLng;
        //If the marker hasn't been added.
        if(!marker){
            //Create the marker.
            marker = new google.maps.Marker({
                position: clickedLocation,
                map: map_mini,
                draggable: true //make it draggable
            });
            //Listen for drag events!
            google.maps.event.addListener(marker, 'dragend', function(event){
                markerLocation();
            });
        } else{
            //Marker has already been added, so just change its location.
            marker.setPosition(clickedLocation);
        }
        //Get the marker's location.
        markerLocation();
    });
}
    
let location_ = {lat: 0, lng: 0}

function markerLocation(){
    //Get location.
    var currentLocation = marker.getPosition();
    //Add lat and lng values to a field that we can save.
    location_.lat = currentLocation.lat(); //latitude
    location_.lng = currentLocation.lng(); //longitude
}

$(document).ready(function() 
{
    SOCKET.on('get user data', function(data) 
    {
        data = JSON.parse(data);
        $('#title-welcome').text(`Welcome back, ${data.name}!`);
    })

    
    
	SOCKET.on('post update', function(data)
	{
        CreatePost(JSON.parse(data));
		// update or create new post if not exists
	});

    SOCKET.emit('load feed');

    // Get the modal
    var modal = document.getElementById('myModal');
    // Get the button that opens the modal
    var btn = document.getElementById("newpostbtn");
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks the button, open the modal 
    btn.onclick = function() {
      modal.style.display = "block";
    }
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }

    function CreatePost(data)
    {
        const post = $(`
        <div class="row">
          <div class="col s12 m12">  
            <div class="card" style="background-color: #f4511e;"> 
               <div class="card-content black-text">
                <span class="card-title">${data.title}</span>
                <p class="text">${data.description}</p>
                </div>
              <div class="card-action">
                <a href="#">Join</a>
              </div>
            </div>
          </div>
        </div>`)
        if (data.category == "studying")
        {
            $('div.feed-area.study').prepend(post);
        }
        else if (data.category == "social")
        {
            $('div.feed-area.socialize').prepend(post);
        }
        else if (data.category == "help")
        {
            $('div.feed-area.gethelp').prepend(post);
        }
    }

    $('#submitButton').click(function()
    {
        SOCKET.emit('submit post', JSON.stringify({
            title: $('#titleinput').val(),
            category: $('select.options').val(),
            time: {start: $('#starttime').val, end: $('#endtime').val()},
            description: $('#description').val(),
            location: location_
        }))
        $('#myModal').css('display', 'none');
    })
})
