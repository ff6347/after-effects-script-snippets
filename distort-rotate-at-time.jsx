/**
 * @author fabiantheblind
 * @description Distord rotation keyframes at a certain time
 *
 *
 * @todo [description]
 */
/**
 * This snippet distorts keyframed rotations
 * The selected prop has to be rotation
 *
 */


var curComp = app.project.activeItem;
app.beginUndoGroup('rotate');
for(var i = 0; i < curComp.selectedProperties.length; i++) {
  var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
  var range = 300;
  var val = (400 + (range * Math.random())) * plusOrMinus;
  curComp.selectedProperties[i].setValueAtTime(curComp.time, val);
}
app.endUndoGroup();
