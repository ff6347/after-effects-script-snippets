// sort-l-to-r.jsx
// sort layers from left to right


(function(thisObj) {

  var compare = function(a, b) {
    if(a.xy[0] < b.xy[0]) {
      return -1;
    }
    if(a.xy[0] > b.xy[0]) {
      return 1;
    }
    return 0;
  };

  var main = function() {
    var proj = app.project;
    var curComp = proj.activeItem;
    if (!curComp || !(curComp instanceof CompItem)) {
      alert('noComp');
      return;
    }
    var arr = [];
    for (var i = 0; i < curComp.selectedLayers.length; i++) {
      var l = curComp.selectedLayers[i];
      var pos = l.transform.position.value;
      arr.push({layer: l, xy: pos});
    }
// ~     $.writeln(arr.toSource());
    arr.sort(compare);
    $.writeln('------------------');
// ~     $.writeln(arr.toSource());

    for(var j = 0; j < arr.length; j++) {
      arr[j].layer.moveToEnd();
    }
    // $.writeln("layername\n"+arr.join ("\n"));
  };

  var run = function(f) {
    f();
  };
  run(main);
}(this));
