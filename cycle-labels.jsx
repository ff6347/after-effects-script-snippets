/**
 * @author fabiantheblind
 * @description cycle thru label colors
 * this is CS6+ feature I think
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
  for(var i = 0; i < curComp.selectedLayers.length; i++) {
    var lay = curComp.selectedLayers[i];
    lay.label = (i + 1) % 16;
  }
}
