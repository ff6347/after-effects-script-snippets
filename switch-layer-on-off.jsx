// shut on/off of layer visibility
// written for
// http://stackoverflow.com/questions/19882937/after-effects-extendscript-hide-and-show-video-layers-randomly
// ae scripting guide
// http://blogs.adobe.com/aftereffects/files/2012/06/After-Effects-CS6-Scripting-Guide.pdf

fun();
function fun() {
  app.beginUndoGroup('XXX');// undo possiblilty
    // prerequisites
    // if there is no comp active return
  var curComp = app.project.activeItem;
  if (!curComp || !(curComp instanceof CompItem)) {
    alert('noComp');
    return;
  }

    // loop all layers of comp 1 based Array
  for(var i = 1; i < curComp.layers.length + 1; i++) {
      // check name
    if(curComp.layers[i].name == 'foo') {
        // turn into opposite
      curComp.layers[i].enabled = !curComp.layers[i].enabled;
    }
  }
  app.endUndoGroup();
}
