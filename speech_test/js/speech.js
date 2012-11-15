window.onload = function () {
  window.map = L.map('map').setView([38.901606, -104.814819], 13),
  base = L.tileLayer('http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18
  }).addTo(map),
  ref = L.tileLayer('http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18
  }).addTo(map);

  var mic = document.getElementById('mic');
  
  mic.onwebkitspeechchange = function (e) {
    var result = e.results[0].utterance;

    switch(result) {
      case 'move left':
        map.panBy(L.point([-100, 0]));
        break;
      case 'move right':
        map.panBy(L.point([100, 0]));
        break;
      case 'move up':
        map.panBy(L.point([0, -100]));
        break;
      case 'move down':
        map.panBy(L.point([0, 100]));
        break;
      case 'move in':
        map.zoomIn();
        break;
      case 'move out':
        map.zoomOut();
        break;
    }

    mic.focus();
  };
};