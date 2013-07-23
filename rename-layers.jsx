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
    var basename = prompt("enter base name will have a number","Layer");
    if(basename.length < 1){
      alert("nothing is to short");
      return;
    }
    for(var i =0; i < curComp.selectedLayers.length;i++){
      var name = basename + " " + String(i+1);
      var currLayer = curComp.selectedLayers[i];
      try{currLayer.source.name = name;}catch(error){ $.writeln( "this layer has no source"); }
      currLayer.name = name;
    }

app.endUndoGroup();
}