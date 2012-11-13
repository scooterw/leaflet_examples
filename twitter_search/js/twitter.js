var map = L.map('map').setView([38.901606, -104.814819], 13),
    base = L.tileLayer('http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18
    }).addTo(map);

var displayTweets = function (obj) {
  for (var i = 0, len = obj.results.length; i < len; i++) {
    var tweet = obj.results[i];
    if (tweet.geo) {
      var icon = L.icon({
        iconUrl: tweet.profile_image_url,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        popupAnchor: [0, 0],
        shadowUrl: null
      });

      var coords = L.latLng(tweet.geo.coordinates);
      
      var marker = L.marker(L.latLng(coords), {
        icon: icon
      }).addTo(map);

      var tInfo = {
        name: tweet.from_user_name,
        nick: tweet.from_user,
        text: tweet.text
      };
      
      marker.bindPopup('<h3>' + tInfo.nick + '</h3><p>(' + tInfo.name + ')<br /><p>' + tInfo.text);
      
      map.panTo(coords);
    }
  }
  document.body.removeChild(document.getElementById('getTweets'));
};

var getTweets = function (query) {
  var center = map.getCenter(),
      lat = center.lat,
      lng = center.lng,
      rad = '50mi',
      count = 1000;

  var url = 'http://search.twitter.com/search.json?q=' + query + '&geocode=' + [lat, lng, rad].join(',') + '&rpp=' + count + '&callback=displayTweets';

  var script = document.createElement('script');
  script.id = 'getTweets';
  script.src = url;
  document.body.appendChild(script);
};

document.getElementById('search').addEventListener('keyup', function (e) {
  if (e.keyCode == 13) {
    getTweets(this.value);
    this.value = '';
  }
});