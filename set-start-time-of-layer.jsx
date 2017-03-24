/*
written for this stackoverflow question
http://stackoverflow.com/questions/24115505/after-effects-composition-start-time-on-timeline/24117772#24117772

*/
function fun() {
  app.beginUndoGroup('XXX');
  var curComp = app.project.activeItem;
  if (!curComp || !(curComp instanceof CompItem)) {
    alert('noComp');
    return;
  }
  if(curComp.numLayers < 2) {
    alert('No Enough layers');
    return;
  }
  var compone = curComp.layer(1);
  var comptwo = curComp.layer(2);
  comptwo.startTime = compone.outPoint;
  app.endUndoGroup();
}

fun();
