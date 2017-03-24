/**
 * @author fabiantheblind
 * @description creates from the selected layer in the project panel a grind in te current comp
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

  var step = 110;

  for(var x = step / 2; x < curComp.width; x += step) {
    for(var y = step / 2; y < curComp.height; y += step) {
      var nl = curComp.layers.add(app.project.selection[0]);
      nl.transform.position.setValue([x, y]);
    }
  }

  app.endUndoGroup();
}
