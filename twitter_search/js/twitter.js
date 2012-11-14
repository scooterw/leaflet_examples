var map = L.map('map').setView([38.901606, -104.814819], 13),
    base = L.tileLayer('http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18
    }).addTo(map);

var markers = {};

var displayTweets = function (obj) {
  var tweetCount = obj.results.length,
      geoTweetCount = 0;

  var queryElem = document.createElement('li');
  queryElem.className = 'query_li';
  queryElem.innerHTML = '<p>Query: <strong>' + obj.query + '</strong></p>';
  document.getElementById('tweets').appendChild(queryElem);

  for (var i = 0, len = obj.results.length; i < len; i++) {
    var tweet = obj.results[i];

    var tweetInfo = {
      name: tweet.from_user_name,
      nick: tweet.from_user,
      text: tweet.text,
      icon: tweet.profile_image_url
    };

    var tweetElem = document.createElement('li');
    tweetElem.className = 'tweet_li';
    document.getElementById('tweets').appendChild(tweetElem);
    var tweetInfos = document.createElement('div');
    tweetInfos.className = 'tweet_info';
    tweetElem.appendChild(tweetInfos);
    var tweetImg = document.createElement('div');
    tweetImg.className = 'tweet_img';
    tweetImg.innerHTML = '<img src="' + tweetInfo.icon + '" />';
    tweetInfos.appendChild(tweetImg);
    var tweetName = document.createElement('div');
    tweetName.className = 'tweet_name';
    tweetName.innerHTML = '<p>' + tweetInfo.name + ' (' + tweetInfo.nick + ')</p>';
    tweetInfos.appendChild(tweetName);
    var tweetBody = document.createElement('div');
    tweetBody.className = 'tweet_body';
    tweetBody.innerHTML = '<p>' + tweetInfo.text + '</p>';
    tweetElem.appendChild(tweetBody);

    if (tweet.geo) {
      geoTweetCount++;

      var icon = L.icon({
        iconUrl: tweetInfo.icon,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, 0],
        shadowUrl: null
      });

      var poof = L.icon({
        iconUrl: L.Icon.Default.imagePath + '/sm_poof.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      var coords = L.latLng(tweet.geo.coordinates);
      
      var marker = L.marker(L.latLng(coords), {
        icon: icon,
        draggable: true
      }).addTo(map);
      
      marker.bindPopup('<h3>' + tweetInfo.nick + '</h3><p>(' + tweetInfo.name + ')<br /><p>' + tweetInfo.text);

      marker.on('dragend', function (e) {
        e.target.setIcon(poof);

        window.setTimeout(function () {
          map.removeLayer(e.target);
        }, 500);
      });
      
      map.panTo(coords);
    }
  }

  var queryElem = document.createElement('li');
  queryElem.className = 'query_li';
  queryElem.innerHTML = '<p>Query: <strong>' + obj.query + '</strong></p>';
  document.getElementById('tweets').appendChild(queryElem);

  var tweetList = document.getElementById('tweet_list');
  tweetList.scrollTop = tweetList.scrollHeight;

  var statsElem = document.getElementById('query_stats');
  statsElem.innerHTML = '<p>Tweets: ' + tweetCount + ' | GeoTweets: ' + geoTweetCount + ' | % Geocoded: ' + (geoTweetCount / tweetCount) + '</p>';

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