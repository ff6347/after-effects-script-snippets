/**
 * @author fabiantheblind
 * @description moves all selected layers to the top of the comp
 *
 *
 * @todo [description]
 */
(function(thisObj){
// basic panel
mpo_import(thisObj);

 function mpo_import(thisObj){

// this is global
import_data =  {
    'x':10,
    'y':10
};


///   THIS WILL CHECK IF PANEL IS DOCKABLE OR FLAOTING WINDOW
var win   = buildUI(thisObj );
if ((win !== null) && (win instanceof Window)) {
    win.center();
    win.show();
} // end if win  null and not a instance of window

 function buildUI (thisObj  ) {
    var win = (thisObj instanceof Panel) ? thisObj :  new Window('palette', 'FSS Fake Parallax',[0,0,150,260],{resizeable: true});

    if (win !== null) {

        var H = 25; // the height
        var W = 30; // the width
        var G = 5; // the gutter
        var x = G;
        var y = G;

        // win.check_box = win.add('checkbox',[x,y,x+W*2,y + H],'check');
        // win.check_box.value = metaObject.setting1;
        win.do_it_button = win.add('button', [x ,y,x+W*3,y + H], 'do it');
        // win.up_button = win.add('button', [x + W*5+ G,y,x + W*6,y + H], 'Up');

        // win.check_box.onClick = function (){
        //     alert("check");
        // };
        win.do_it_button.onClick = function () {
            runit();
      };

    }
    return win;
}


function runit(){
// "in function main. From here on it is a straight run"
//

    var curComp = app.project.activeItem;
   if (!curComp || !(curComp instanceof CompItem)){
        alert('please select a comp');
        return;
    }



    // if(curComp.selectedLayers.length < 1){
    //     alert('Please select at least one layer');
    // return;
    //     }


   if(curComp.selectedLayers.length > 1){
    curComp.selectedLayers[1].moveAfter(curComp.selectedLayers[0]);
  }else if(curComp.selectedLayers.length === 1){
      curComp.selectedLayers[0].moveToBeginning();
    }
    app.beginUndoGroup('open-close-mask');
    for(var l = 0; l< curComp.selectedLayers.length;l++){

    }
// var props = curComp.selectedProperties

    app.endUndoGroup();
  }
 }// close mpo_import

})(this);