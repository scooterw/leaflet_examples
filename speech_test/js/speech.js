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

  // Suppored phrases:
  //   move up/down/left/right
  //   jump up/down/left/right
  //   move in/out
  //   way in/out
  function processPhrase(phrase) {
    var words         = phrase.split(" "),
        motion        = words[0],
        direction     = words[1];

    if (isAZoomCommand(direction))
    {
      var zoomMagnitude = magnitudeOfZoom(motion);
      processZoom(direction, zoomMagnitude);

    } else {
      var moveMagnitude = magnitudeOfMove(motion);
      processDirection(direction, moveMagnitude);
    }
  };

  // The following functions match against the words that are most
  // likely to be translated correctly. This won't always result in
  // the map reacting to a phrase, but it increases the chances
  // greatly. This helps avoid instances where the translation is
  // imprecise. This should give the user more feedback on whether
  // their command was interpreted correctly, or whether the
  // translation was off. This is better than the map not doing
  // anything, and leaving the user wondering what happened.

  function isAZoomCommand(direction) {
    // These are words that are translated most reliably, so they are
    // reliable to use for determining which command we've received.
    return direction == 'in' || direction == 'out';
  }

  function magnitudeOfZoom(motion) {
    // Matching on "way" allows us to ignore the fact that
    // "zoom" is never translated correctly.
    return motion == "way" ? 3 : 1;
  }

  function processZoom(direction, zoomMagnitude) {
    // To zoom out, we need to invert the zoomMagnitude.
    if (direction == 'out') {
      zoomMagnitude *= -1;
    }

    map.setZoom(map.getZoom()+zoomMagnitude);
  }

  function magnitudeOfMove(motion) {
    // Matching on "move" is more reliable than matching on "jump".
    return motion == "move" ? 100 : 500;
  }

  function processDirection(direction, moveMagnitude) {
    var coords;

    switch(direction) {
      case 'left':
        coords = [-moveMagnitude, 0];
        break;

      case 'right':
        coords = [moveMagnitude, 0];
        break

      case 'up':
        coords = [0, -moveMagnitude];
        break;

      case 'down':
        coords = [0, moveMagnitude];
        break;
      
      default:
        // If we didn't recognize the word, don't do anything.
        return;
    }

  panBy(coords);
  }

  function panBy(coords) {
    map.panBy(L.point(coords[0], coords[1]));
  }
};

