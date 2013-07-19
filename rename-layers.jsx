/**
 * @author fabiantheblind
 * @description rename selected layers with number
 * this happens in comp and project panel
 *
 *
 * @todo catch error if layer as no source
 */
fun();
function fun(){

app.beginUndoGroup("fun");
var curComp = app.project.activeItem;
   if (!curComp || !(curComp instanceof CompItem)){
        alert("noComp");
        return;
    }



    for(var i =0; i < curComp.selectedLayers.length;i++){
      var name = "Scene" + String(i+1);
      curComp.selectedLayers.source.name = name;
      curComp.selectedLayers.name = name;
    }

app.endUndoGroup();
}