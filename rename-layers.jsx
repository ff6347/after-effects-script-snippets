fun();
function fun(){

app.beginUndoGroup("fun");
var curComp = app.project.activeItem;
   if (!curComp || !(curComp instanceof CompItem)){
        alert("noComp");
        return;
    };



    for(var i =0; i < curComp.selectedLayers.length;i++){
      var name = "Scene" + String(i+1);
      curComp.selectedLayers.source.name = name;
      curComp.selectedLayers.name = name;
    }

app.endUndoGroup();
}