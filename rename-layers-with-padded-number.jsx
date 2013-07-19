/**
 * @author fabiantheblind
 * @description pad all layernames
 *
 *
 * @todo [description]
 */
fun();
function fun(){


app.beginUndoGroup("rename layers");

var curComp = app.project.activeItem;
   if (!curComp || !(curComp instanceof CompItem)){
        alert("noComp");
        return;
    }
    for(var i = 1; i <= curComp.layers.length;i++){
            var layer = curComp.layers[i];
            layer.name = 'Rohedit_clip ' +  String(pad(i,5));
        }
app.endUndoGroup();

}

function pad(num, size) {
    var s = "00000" + num;
    return s.substr(s.length-size);
}