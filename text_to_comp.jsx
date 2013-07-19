/**
 * @author fabiantheblind
 * @description adds text to a comp with UI
 *
 *
 * @todo check if it works
 */

/**
 *  function template by @author fabiantheblind
 */
(function(thisObj){
// basic panel
simple(thisObj);
/**
 * [simple description]
 * @param  {[type]} thisObj [description]
 * @return {[type]}         [description]
 */
function simple(thisObj){

// this is global
data =  {
    'x':10,
    'y':10,
    "text":"",
    "counter":0
};


// THIS WILL CHECK IF PANEL IS DOCKABLE OR FLAOTING WINDOW
var win   = buildUI(thisObj );
if ((win !== null) && (win instanceof Window)) {
    win.center();
    win.show();
} // end if win  null and not a instance of window

 function buildUI (thisObj  ) {
        var H = 25; // the height
        var W = 30; // the width
        var G = 5; // the gutter
        var x = G;
        var y = G;
    var win = (thisObj instanceof Panel) ? thisObj :  new Window('palette', 'window',[0,0,G*3 + W*6 ,G*2 + H*1],{resizeable: true});

    if (win !== null) {
      win.txt = win.add('edittext',[x ,y,x+W*3,y + H],"");
      x+=W*3+G;
        win.do_it_button = win.add('button', [x ,y,x+W*3,y + H], 'do it');
        win.do_it_button.onClick = function () {
          data.counter++;
            run();
      };

      win.txt.onChange = function (){
        data.text = this.text;
      };
    }
    return win;
}
function run(){
// "in function run. From here on it is a straight run"

    var curComp = app.project.activeItem;
   if (!curComp || !(curComp instanceof CompItem)){
        alert('please select a comp');
        return;
    }
    // if(curComp.selectedLayers.length < 1){
    //     alert('Please select at least one layer');
    // return;
    //  }
    app.beginUndoGroup('run function');
    var solid = curComp.layers.addSolid([1,1,1], "bg", curComp.width, curComp.height, 1, curComp.duration);
    var txt = curComp.layers.addText(data.text);
    precomper([solid,txt],curComp,"comp" + data.counter );
    app.endUndoGroup();
  }

  // my personal precomposer


function precomper(arrOLayers,curComp, name){

var layerIndices = []; // precompose takes layer inidcies
// loop thru a list of layer
for(var l = 0;l < arrOLayers.length;l++){
// and push their index into an array
    layerIndices[layerIndices.length] = arrOLayers[l].index;
  }

// now precompose the result
var newComp = curComp.layers.precompose(layerIndices, name, true );
// newComp.parentFolder = folder;
// it is the selected layer
var preCompedLayer = curComp.selectedLayers[0];
}
 }// close run
})(this);