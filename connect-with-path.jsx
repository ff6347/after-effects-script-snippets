/**
 * @author fabiantheblind
 * @description tries to connect selected layers with a path
 *
 *
 * @todo get also parented position and position with expressions
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
             var H = 25; // the height
        var W = 30; // the width
        var G = 5; // the gutter
        var x = G;
        var y = G;
        var rownum = 1;
        var columnnum = 3;
        var gutternum = 2;
    var win = (thisObj instanceof Panel) ? thisObj :  new Window('palette', 'Connect With Path',[0,0,gutternum*G + W*columnnum,gutternum*G + H*rownum],{resizeable: true});
    if (win !== null) {

        // win.check_box = win.add('checkbox',[x,y,x+W*2,y + H],'check');
        // win.check_box.value = metaObject.setting1;
        win.do_it_button = win.add('button', [x ,y,x+W*3,y + H], 'connect them');
        // win.up_button = win.add('button', [x + W*5+ G,y,x + W*6,y + H], 'Up');

        // win.check_box.onClick = function (){
        //     alert("check");
        // };
        win.do_it_button.onClick = function () {
            connect_all_layers();
      };

    }
    return win;
}


function connect_all_layers(){
// "in function main. From here on it is a straight run"
//

    var curComp = app.project.activeItem;
   if (!curComp || !(curComp instanceof CompItem)){
        alert('please select a comp');
        return;
    }


    if(curComp.selectedLayers.length < 2){
        alert('Please select at least an even number of layer');
    return;
        }


    app.beginUndoGroup('connect-layers');
    var buffer = curComp.layers.addNull();
    buffer.name = "buffer";

    var layerlist = [];
    for(var i = 0; i < curComp.selectedLayers.length;i+=2){

      var lays = [ curComp.selectedLayers[i] , curComp.selectedLayers[i+1]];
      layerlist.push(lays);

    }

    var shapes = [];
    for(var j = 0; j < layerlist.length; j++){
    var global_curr_pos = [0, 0, 0];


        var p1 = get_position(layerlist[j][0], curComp.time, buffer);;//layerlist[j][0].transform.position.value;

        // var p2 = get_position(layerlist[j][1], curComp.time, buffer); //layerlist[j][1].transform.position.value;
        var n = layerlist[j][0].name + " <-> " +layerlist[j][1].name;
      shapes.push(connect(p1 ,p2 , curComp, n));
    }

    for(var k = 0; k < shapes.length;k++){
        shapes[k].selected = true;
    }
    app.endUndoGroup();
  }

  function connect(pos1, pos2, comp, name){
    var curshape = comp.layers.addShape();
    curshape.name = name;
    make_path([ [ pos1[0]- comp.width / 2,pos1[1]- comp.width / 2 ],[ pos2[0] - comp.width / 2,pos2[1] - comp.width / 2 ] ],curshape,true,null);
    return curshape;
  }

/**
 * Path creation. As always the basis is taken from
 * http://www.redefinery.com/ae/fundamentals/
 *
 * http://www.redefinery.com/ae/fundamentals/masks/
 * with some additions to fit my needs
 * Still... Thanks 2 Jeff Almasol aka redefinery
 *
 *
 *
 * this builds a path using ternary operators
 * I like it that why a lot. Pretty slick
 * http://stackoverflow.com/questions/1771786/question-mark-in-javascript
 *
 * @param  {Array of Arrays}            path        holds the coordinates for the path
 * @param  {AVLayer}                    layer       The layer to draw on
 * @param {String}                      rowname     This is to sort ot rows
 * @param  {String}                     pathname    The name of the path
 * @param  {Array of 3 Values 0 -1 }    maskcolor   The color of the masks always per Glyph
 * @param {ADBE Vectors Group}          shapegroup The group that contains the path
 * @return {ADBE Vectors Group}         for reuse.
 *
 * @todo Get the hang of the diffrent paths in a Character
 */
function make_path(path,layer, use_shapes, shapegroup){
var masksGroup = null;
    masksGroup = use_shapes ? layer("ADBE Root Vectors Group") : layer("ADBE Mask Parade");
// Get
// PropertyGroup for the shape
// or
// the PropertyGroup for the masks
    // masksGroup = layer("ADBE Mask Parade");
if (masksGroup !== null){
    var mask = null;
// Create a new mask
if(shapegroup === null && use_shapes === true){
    var pregroup = masksGroup.addProperty("ADBE Vector Group");
    pregroup.name = "group";//charname + ' ' + rowname;
    shapegroup = pregroup.addProperty("ADBE Vectors Group");
    mask = shapegroup;

}
    mask = use_shapes ? shapegroup.addProperty("ADBE Vector Shape - Group") : masksGroup.addProperty("ADBE Mask Atom");
        // mask = masksGroup.addProperty("ADBE Mask Atom");
        if (mask !== null){
            mask.name = "path"; // use_shapes ? pathname : charname + ' ' + rowname + ' ' + pathname;
            // mask.color = maskcolor;
            var s = new Shape();// new shape object
            if (s !== null){
                s.vertices = path;
                // The close attribute defaults to true
                s.closed = false;
                // put the path verticies into the shape or mask
                maskShape = use_shapes ? maskShape = mask.property("ADBE Vector Shape") : mask.property("ADBE Mask Shape");
                // Change the mask shape (not keyframed)
                maskShape.setValue(s);
            }
        }
    }
// return shapegroup;
}

    /**
     * Gets the position value at a specific time
     * It gets shortend to 3 digits float
     * @param  {Layer Object} layer the current layer the get the value from
     * @param  {Number Float} time The curent time
     * @return {String}       builds a string that looks like this: "" + x +" " + y + " "+ z
     */

    function get_pos_values_at_time(layer, time) {
      // var str = "";
      var x = 0.0;
      var y = 0.0;
      var z = 0.0;

      if(layer.parent == null) {

        x = layer.transform.position.valueAtTime(time, false)[0] - (layer.containingComp.width / 2);
        y = layer.transform.position.valueAtTime(time, false)[1] - (layer.containingComp.height / 2);
      } else {
        x = layer.transform.position.valueAtTime(time, false)[0];
        y = layer.transform.position.valueAtTime(time, false)[1];
      }

      if(layer.threeDLayer) {
        z = layer.transform.position.valueAtTime(time, false)[2];
      } else {
        z = 0.0;
      };

      return [x, y, z];
    };
    /**
     * Recursive fetching layer posiitons is cool but does not solve the parenting problem
     * Wee need to calc the positions a diffrent way
     * Add a buffer layer with an expression that calcs a parented position toWorld
     * thnx to the marvelous Paul Tuersley
     * http://aenhancers.com/viewtopic.php?p=4647
     * also saw this @ http://forums.creativecow.net/thread/227/13960
     * by the inginious Dan Ebberts
     * apply to position of buffer layer to get the world position
     * works 2D and 3D
     * a = thisComp.layer("parented layer");
     * a.toWorld(a.anchorPoint);
     *
     * Gets the position of layers
     * @param  {Layer Object} layer  The Layer to analys
     * @param  {Number Comp Current Time} time   The moment to capture
     * @param  {Layer Object} buffer A NullObject added to the Comp for buffering the positions
     * @return {NOTHING}        Sets a global value. Should return result. Thats better
     * @todo Remove Global object
     */

    function get_position(layer, time, buffer) {
      var x = 0;
      var y = 0;
      var z = 0;
      var result = [0, 0, 0];
      if(layer.parent != null) {

        var expr = new Array();
        expr.push("// obj-vertex-export parent bake expression thnx 2 Paul T. & Dan E.");
        expr.push("var sourceLayer = thisComp.layer(" + layer.index + ");");
        expr.push("sourceLayer.toWorld(sourceLayer.anchorPoint)");

        if(layer.threeDLayer == true) {
          buffer.threeDLayer = true;
        } else {
          buffer.threeDLayer = false;
        }
        // buffer.transform.position.expression = "";
        buffer.transform.position.expression = expr.join("\n");
        result = get_pos_values_at_time(buffer, time);
      } else {
        result = get_pos_values_at_time(layer, time);
      }
      x = result[0];
      y = result[1];
      z = result[2];
      return [x,y];
      // global_curr_pos = [x, y, z]; //
    };

 }// close mpo_import

})(this);