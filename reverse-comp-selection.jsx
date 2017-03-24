(function(thisObj) {

  var main = function() {
    var proj = app.project;
    var curComp = proj.activeItem;
    if (!curComp || !(curComp instanceof CompItem)) {
      alert('noComp');
      return;
    }
    for(var i = 1; i < curComp.numLayers + 1; i++) {
      curComp.layers[i].selected = !curComp.layers[i].selected;
    }

//  var arr = [];
//  for (var i = 0; i < curComp.selectedLayers.length; i++) {
//    arr.push(curComp.selectedLayers[i].name);

//  }
//  $.writeln("layername\n"+arr.join ("\n"));
  };

  var run = function(f) {
    f();
  };
  run(main);
}(this));
