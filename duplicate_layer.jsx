/**
 * @author fabiantheblind
 * @description duplicates a layer 99 times
 *
 *
 * @todo [description]
 */
fun();
function fun() {

  app.beginUndoGroup('XXX');

  var curComp = app.project.activeItem;
  if (!curComp || !(curComp instanceof CompItem)) {
    alert('noComp');
    return;
  }

  var num = 99;

  for(var i = 0; i < num; i++) {
    curComp.selectedLayers[0].duplicate();
  }

  app.endUndoGroup();
}
