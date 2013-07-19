/**
 * @author fabiantheblind
 * @description add textlayers from string.
 * layers will be splitted by whitespaces
 *
 * @todo [description]
 */
fun();
function fun(){

str = prompt("Enter Your Text Here","");
if(str.length < 1 ) return;
app.beginUndoGroup("XXX");

var curComp = app.project.activeItem;
   if (!curComp || !(curComp instanceof CompItem)){
        alert("noComp");
        return;
    }

var arr = str.split(" ");
for(var i = 0; i < arr.length;i++){
curComp.layers.addText(arr[i]);
    }


app.endUndoGroup();
}