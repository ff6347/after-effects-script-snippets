// ~ change-specific-setting.jsx
// works great with rd_gimmePropsPath.jsx

var main = function() {
  var proj = app.project;
  app.beginUndoGroup('change specific setting');

  for(var i = 0; i < proj.selection.length; i++) {

    var item = proj.selection[i];

    if(item instanceof CompItem) {
      var layer = item.layers[1];
      $.writeln(layer.name);
// ~ layer.effect("Keylight 906")("Keylight 906-0014").setValue(0); // keylight clip rollback
// ~ layer.effect("Keylight 906")("Keylight 906-0015").setValue(-1.5);//Screen Shrink grow
// ~ layer.effect("Keylight 906")("Keylight 906-0016").setValue(1);// Softness
// ~ layer.effect("Keylight 906")("Keylight 906-0010").setValue(1);// Screen pre blur
      try{
        layer.effect('ADBE Spill2')('ADBE Spill2-0003').setValue([0.61568629741669, 0.73333334922791, 0.3098039329052, 1]);
      }catch(e) {
        $.writeln(e);
      }
    }

  }
  app.endUndoGroup();
  return 0;
};


var run = function(f) {
  return f();
};

run(main);
