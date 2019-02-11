let map;
let mapLoaded = false;
let bitmojiReceived = false;

CustomMarker = function(){};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 38.537699, lng: -121.7520045},
		zoom: 15,
		disableDefaultUI: true
    });
        
    google.maps.event.addListenerOnce(map, 'idle', function(){
		GoogleMapLoaded();
    });


}

// Data should include: location {lat, lng} bitmoji
function LoadOneBitmoji(data)
{
	const marker = new CustomMarker(new google.maps.LatLng(data.location), map, data)
}

function GoogleMapLoaded()
{
	CustomMarker = function CustomMarker(latlng, map, args) {
		this.latlng = latlng;	
		this.args = args;	
		this.setMap(map);	
	}
	
	CustomMarker.prototype = new google.maps.OverlayView();
	
	CustomMarker.prototype.draw = function() {
		
		var self = this;
		
		var div = this.div;
		
		if (!div) {

			div = this.div = document.createElement('div');
			div.className = "bitmoji";
			div.style.backgroundImage = `url(\"${this.args.bitmoji.avatar}\")`
			
			/*google.maps.event.addDomListener(div, "click", function(event) {			
				google.maps.event.trigger(self, "click");
			});*/
			
			var panes = this.getPanes();
			panes.overlayImage.appendChild(div);
		}
		
		var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
		
		if (point) {
			div.style.left = point.x + 'px';
			div.style.top = point.y + 'px';
		}
	};
	
	CustomMarker.prototype.remove = function() {
		if (this.div) {
			this.div.parentNode.removeChild(this.div);
			this.div = null;
		}	
	};
	
	CustomMarker.prototype.getPosition = function() {
		return this.latlng;	
	};

	SOCKET.emit('get map bitmojis');

	SOCKET.on('map bitmojis', function(data)
	{
		data = JSON.parse(data);

		data.forEach((elem) => {
			LoadOneBitmoji(elem);
		});
	})

}
