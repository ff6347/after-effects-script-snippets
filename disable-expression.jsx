/**
 * @author fabiantheblind
 * @description enable expression
 *
 *
 * @todo [description]
 */
/**
 * This snippet disables/enables all sellected expressions
 *
 */
var curComp = app.project.activeItem;
app.beginUndoGroup('disable expression');

for(var i = 0; i < curComp.selectedProperties.length; i++) {

  var prop = curComp.selectedProperties[i];
  if(prop.expressionEnabled === false) {
    prop.expressionEnabled = true;
  }else{
// prop.expressionEnabled = false;
  }


}
app.endUndoGroup();
