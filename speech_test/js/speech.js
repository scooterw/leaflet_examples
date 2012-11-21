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

  function processPhrase(phrase) {
    var words = phrase.split(" ");

    var motion = words[0];
    var direction = words[1];

    switch(motion) {
      case 'move':
        var pixelsToMove = 100;

        switch(direction) {
          case 'left':
            panMap(-pixelsToMove, 0);
            break;

          case 'right':
            panMap(pixelsToMove, 0);
            break;

          case 'up':
            panMap(0, -pixelsToMove);
            break;

          case 'down':
            panMap(0, pixelsToMove);
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
        var pixelsToJump = 500;

        switch(direction) {
          case 'left':
            panMap(-pixelsToJump, 0);
            break;

          case 'right':
            panMap(pixelsToJump, 0);
            break

          case 'up':
            panMap(0, -pixelsToJump);
            break;

          case 'down':
            panMap(0, pixelsToJump);
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

