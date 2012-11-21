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
    var phrase = e.results[0].utterance;

    processPhrase(phrase);

    mic.focus();
  };

  function panMap(x,y)
  {
    map.panBy(L.point(x,y));
  }

  function magnitudeOfMotion(motion) {
    return motion == "jump" ? 500 : 100
  }

  function processPhrase(phrase) {
    var words     = phrase.split(" "),
        motion    = words[0],
        direction = words[1],
        magnitude = magnitudeOfMotion(motion);

    switch(motion) {
      case 'move':
        switch(direction) {
          case 'left':
            panMap(-magnitude, 0);
            break;

          case 'right':
            panMap(magnitude, 0);
            break;

          case 'up':
            panMap(0, -magnitude);
            break;

          case 'down':
            panMap(0, magnitude);
            break;

          case 'in':
            map.zoomIn();
            break;

          case 'out':
            map.zoomOut();
            break;
        }
        break;

      case 'jump':
        switch(direction) {
          case 'left':
            panMap(-magnitude, 0);
            break;

          case 'right':
            panMap(magnitude, 0);
            break

          case 'up':
            panMap(0, -magnitude);
            break;

          case 'down':
            panMap(0, magnitude);
            break;

          case 'out':
            map.setZoom(map.getZoom()-3);
            break;
          
          case 'in':
            map.setZoom(map.getZoom()+3);
            break;
        }
        break;
    }
  };
};

