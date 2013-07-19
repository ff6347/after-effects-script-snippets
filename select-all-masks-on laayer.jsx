/**
 * @author redefinery with some edits by fabiantheblind
 * @description select all masks on layer
 * take a look into the fundamentals
 * http://www.redefinery.com/ae/fundamentals/
 * @todo [description]
 */
// given:
// layer = Layer object, and the layer can have masks applied
//
fun();
function fun(){


app.beginUndoGroup("XXX");

var curComp = app.project.activeItem;
   if (!curComp || !(curComp instanceof CompItem)){
        alert("noComp");
        return;
    }

var layer = curComp.selectedLayers[0];

var masksGroup = layer("Masks");
var selectedMasks = new Array();                 // Store masks in an array; starts as empty
if (masksGroup != null)
{
                                                 // Iterate through properties of masksGroup
                                                 // Append selected mask to the array
    for (var i = 1; i <= masksGroup.numProperties; i++)
        masksGroup.property(i).selected = true;
//~         if (masksGroup.property(i).selected)
//~             selectedMasks[selectedMasks.length] = masksGroup.property(i);
//~ }
// The selectedMasks array now contains the list of selected masks
// in top-to-bottom order




}
app.endUndoGroup();

}