(function(thisObj) {

/*! obj-vertex-export.jsx - v0.3.1 - 2015-06-22 */
  // Write WAVEFRONT OBJ files to disk
  // - single frame or sequence
  // - vertex only!
  //
  //
  // Copyright (c)  2012 - 2015
  // Fabian "fabiantheblind" Morón Zirfas
  // Permission is hereby granted, free of charge, to any
  // person obtaining a copy of this software and associated
  // documentation files (the "Software"), to deal in the Software
  // without restriction, including without limitation the rights
  // to use, copy, modify, merge, publish, distribute, sublicense,
  // and/or sell copies of the Software, and to  permit persons to
  // whom the Software is furnished to do so, subject to
  // the following conditions:
  // The above copyright notice and this permission notice
  // shall be included in all copies or substantial portions of the Software.
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  // EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  // OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
  // IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF  CONTRACT,
  // TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTIO
  // WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  // see also http://www.opensource.org/licenses/mit-license.php

  /**
   *
   * First of all.
   * Satya G Meka aka Rowbyte is the only one out of
   * Element 3D, Form and Plexus
   * who seems to get the obj import right
   * I didn't try the atomkraft plugins.
   * Element 3D and Form fail with the OBJ files created
   * E3D needs faces to import an obj and then the scale is strange.
   * Its pretty wired.
   * Form does also not get the AE world right back in.
   * No offense I love E3D and Form but
   * Plexus eats these OBJ files out of the box.
   *
   * But hey. Still have fun with that script.
   *
   *
   *
   * Videocopilot Element 3D Quirks:
   * - E3D needs faces in the obj. If there are only verticies he does not find anything at all
   * - E3D seems to read only positive values
   * - E3D scaleing is offseted
   * - E3D position is offseted
   * - E3D writing all v's to faces does not solve the problem so it is deactivated
   *
   * Trapcode Form Quirks:
   * - Form needs no faces. He finds the verticies
   * - better shut of normalize
   * - To get something that is near to but not fully right
   *   Set the Basefrom x to your obj comps x
   *   Set the Basefrom y to your obj comps y
   *   Set the Basefrom z to your obj comps z
   *   But still. It is not fully right.
   *   Fiddle with the z offset
   *   you need to offset the center z of the Base Form
   *
   * @todo calculate also rotation values und scales using a buffer layer with this expression
   * // apply to position of buffer layer
   * // works 2D and 3D
   * a = thisComp.layer("parented layer");
   * a.toWorld(a.anchorPoint);
   *
   */

var settings = {};
var v = '0.3.1';


settings.helptext = "#obj-vertex-export.jsx\n\nis a simple oneshot script that takes the positions of all selected layers and writes obj verticies from it. It works out of the box with Plexus by Rowbyte.  \n\nParenting:  \nThis script can export parented layers If you run int o any problems try:\n'Blurrypixel' http://aescripts.com/bake-parented-transform/  \n\nPlexus is the only one out of Element 3D, Form and Plexus who seems to get the obj import right. I didn't try the atomkraft plugins nor others. Element 3D and Form get problems with the OBJ files created E3D needs faces to import an obj and seems to have problem with negative Z values. Its pretty wired. So I disabled that for the moment. Form also does not get the world right. No offense I love E3D and Form but Plexus eats these OBJ files out of the box. But hey. You still can have fun with this script.\n\nTrapcode Form Quirks:  \n- Form needs no faces. He finds the verticies\n- better shut of normalize\n- To get something that is near to but not fully right\n Set the Basefrom x to your obj comps x\n Set the Basefrom y to your obj comps y\n Set the Basefrom z to your obj comps z\n But still. It is not fully right. Fiddle with the z offset you need to offset the center z of the Base Form.\n\nVideocopilot Element 3D Quirks:  \nE3D needs faces in the obj. If there are only verticies he does not find anything at all E3D seems to read only positive values E3D scaleing is offseted E3D position is offseted E3D writing all v's to faces does not solve the problem so it is deactivated.  ";


  // This is a global variable for recursive layer parenting handling
  // This will be overwritten and set to [0,0,0] at the end of every layer analysis
  // used in function recurs_position
  // type {Array with 3 Numbers x ,y ,z}
  //
  // ------------------------
  run_obj_vertex_export_script(thisObj);
  // ------------------------


  /**
   * this runs the whole script
   */
  function run_obj_vertex_export_script(thisObj) {

    var global_curr_pos = [0, 0, 0];

    /**
     * Check if license already was accepted
     * and save it
     */
    var res = null;
    var website = "http://fabiantheblind.github.com/obj-vertex-exporter/";
    var settingsSectionName = "obj-vertex-exporter";
    if ((app.settings.haveSetting(settingsSectionName, "licaccept") === true)) {
      var licres = parseInt(app.settings.getSetting(settingsSectionName, "licaccept"));
      if (licres == 1) {
        res = [true, true];
      } else {
        res = objex_licenseDiag("obj-vertex-exporter", website);
      }
    } else {
      res = objex_licenseDiag("obj-vertex-exporter", website);
    }
    if (!res[1]) {
      return;
    }
    if (res[0]) {
      app.settings.saveSetting(settingsSectionName, "licaccept", 1);
    }



    var objex = {};
    objex.settings = {
      sequence: false,
      /**
       * This is a poor attempt to write faces
       * You cant reach this via UI
       */
      writefaces: false
    };


    /**
     * This object holds all help info
     * will be joined for display
     * @type {Array of String}
     */
//     objex.helpString = [];
//     objex.helpString.push("obj-vertex-export.jsx");

//     objex.helpString.push("is a simple oneshot script that takes the positions of all selected layers and writes obj verticies from it. It works out of the box with Plexus by Rowbyte.");

//     objex.helpString.push("\nParenting:\nThis script can export parented layers If you run int o any problems try:\n'Blurrypixel' http://aescripts.com/bake-parented-transform/\n");
//     objex.helpString.push("Plexus is the only one out of\
// Element 3D, Form and Plexus\
// who seems to get the obj import right.\
// I didn't try the atomkraft plugins nor others.\
// Element 3D and Form get problems with the OBJ files created\
// E3D needs faces to import an obj and seems to have problem with negative Z values.\
// Its pretty wired. So I disabled that for the moment.\
// Form also does not get the world right.\
// No offense I love E3D and Form but\
// Plexus eats these OBJ files out of the box.\
// But hey. You still can have fun with this script.");
//     objex.helpString.push("\
// Trapcode Form Quirks:  \
// - Form needs no faces. He finds the verticies\
// - better shut of normalize\
// - To get something that is near to but not fully right\
//  Set the Basefrom x to your obj comps x\
//  Set the Basefrom y to your obj comps y\
//  Set the Basefrom z to your obj comps z\
//  But still. It is not fully right.\
//  Fiddle with the z offset\
//  you need to offset the center z of the Base Form");
//     objex.helpString.push("\
// Videocopilot Element 3D Quirks:  \
// E3D needs faces in the obj. If there are only verticies he does not find anything at all\
// E3D seems to read only positive values\
// E3D scaleing is offseted\
// E3D position is offseted\
// E3D writing all v's to faces does not solve the problem so it is deactivated");

    /**
     * This will hold all error Messages
     * @type {Object}
     */
    var errorStrings = {};
    errorStrings.noComp = "Please select a compsition";
    errorStrings.noLayer = "Please select at least one laxer.";

    var uiStrings = {};
    uiStrings.selFolder = "Select a output folder...";
    /**
     * Message for the end of the script
     * wrote file to location
     *
     * @param  {String} fn the file name
     * @param  {String}   tf The target folder
     */
    uiStrings.wroteMsg = function (fn, tf) {
      alert("wrote: " + fn + ".obj\nto folder: " + tf);
    };

    ///   THIS WILL CHECK IF PANEL IS DOCKABLE OR FLAOTING WINDOW
    var win = buildUI(thisObj, objex, errorStrings, uiStrings);
    if ((win !== null) && (win instanceof Window)) {
      win.center();
      win.show();
    } // end if win  null and not a instance of window



    /**
     * This builds the UI
     * @param  {The script engine?} thisObj      the Engine
     * @param  {Object} objex        Holds al info and settings
     * @param  {Object} errorStrings Holds all error strings
     * @param  {Object} uiStrings    Holds all UI strings
     * @return {Panel or Window}     The UI we created
     */
    function buildUI(thisObj, objex, errorStrings, uiStrings) {
      var win = (thisObj instanceof Panel) ? thisObj : new Window('palette', 'obj-vertex-export', [0, 0, 150, 260], {
        resizeable: true
      });

      if (win !== null) {

        var H = 25; // the height
        var W1 = 30; // the width
        var G = 5; // the gutter
        var x = G;
        var y = G;
        // var yuioff = G; // and some offset

        win.sequence_check = win.add('checkbox', [x, y, x + W1 * 2, y + H], 'seq');
        win.sequence_check.value = objex.settings.sequence;
        win.export_button = win.add('button', [x + W1 * 2 - G * 2, y, x + W1 * 5, y + H], 'export');
        win.help_button = win.add('button', [x + W1 * 5 + G, y, x + W1 * 6, y + H], '?');

        win.sequence_check.onClick = function () {
          objex.settings.sequence = this.value;
        };
        win.help_button.onClick = function () {
          alert(settings.helptext);
        };
        win.export_button.onClick = function () {
          export_obj(objex, uiStrings, errorStrings);
        };


      }
      return win;
    } // end buildUI

    /*

This is the license dialoge that shows up
on startup. If you dont tell him to go away

*/
    /**
     * [objex_licenseDiag description]
     * @param  {[type]} n       [description]
     * @param  {[type]} website [description]
     * @return {[type]}
     */
    function objex_licenseDiag(n, website) {
      var lic = "DONT USE SCRIPTS FROM UNTRUSETED SOURCES! ALWAYS DOWNLOAD THIS SCRIPT @ " + website + "/\n\n" +
        "You have to allow the script to read and write to disk.\nso if you obtained this script from any other source then the above mentioned" +
        "\nIT COULD INCLUDE MALICIOUS CODE!\nBy confirming this dialog you also accept the license agreement below\n" +
        "\nLICENSES\n" + "Copyright (c)  2012 -2015 Fabian \"fabiantheblind\" Morón Zirfas\n" +
        "Permission is hereby granted, free of charge*, to any person obtaining a copy of this " +
        "software and associated documentation files (the \"Software\"), to deal in the Software " +
        "without restriction, including without limitation the rights to use, copy, modify " +
        "the Software, and to permit persons to whom the Software is furnished to do so, subject to the following " +
        "conditions:\n" +
        "The above copyright notice and this permission notice shall be included in all copies " +
        "or substantial portions of the Software.\n" +
        "THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, " +
        "INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A " +
        "PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT " +
        "HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF " +
        "CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE " +
        "OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n" +
        "see also http://www.opensource.org/licenses/mit-license.php\n\n" +
        "*if you want to donate something so I can buy cookies and beer\ndo it via aescripts.com\n";

      var diag = new Window("dialog", n + " || readme and license agreement");
      diag.preferredSize = {
        "width": 450,
        "height": 450
      };
      var pan = diag.add('group', undefined, '');
      pan.orientation = 'column';
      var txt = pan.add('edittext', undefined, lic, {
        multiline: true,
        scrolling: false
      });
      txt.preferredSize = {
        "width": 440,
        "height": 430
      };
      var btg = pan.add("group");
      var cbg = btg.add("group");
      cbg.alignment = "left";
      var cb = cbg.add("checkbox", undefined, "dont warn me again");
      btg.orientation = 'row';
      btg.alignment = "right";
      btg.add("button", undefined, "OK");
      btg.add("button", undefined, "cancel");
      if (diag.show() == 1) {
        return [cb.value, true];
      } else {
        return [false, false];
      }
    }
    // ------------------------------------------------------------

    //  ______ _   _ _____   ____  ______ _    _ _____
    // |  ____| \ | |  __ \ / __ \|  ____| |  | |_   _|
    // | |__  |  \| | |  | | |  | | |__  | |  | | | |
    // |  __| | . ` | |  | | |  | |  __| | |  | | | |
    // | |____| |\  | |__| | |__| | |    | |__| |_| |_
    // |______|_| \_|_____/ \____/|_|     \____/|_____|


    // ------------------------------------------------------------


    /**
     * This is the main function
     * That does all the stuff
     * @param  {Object} objex        Holds al info and settings
     * @param  {Object} errorStrings Holds all error strings
     * @param  {Object} uiStrings    Holds all UI strings
     */
    function export_obj(objex, uiStrings, errorStrings) {


      app.beginUndoGroup("export obj"); // this is not usefull. You cant make the export go away

      var curComp = app.project.activeItem;
      if (!curComp || !(curComp instanceof CompItem)) {
        alert(errorStrings.noComp);
        return;
      }

      if ((curComp.selectedLayers.length < 1)) {
        alert(errorStrings.noLayer);
        return;
      }


      var selection = curComp.selectedLayers;


      // ------------ So lets write some OBJ ------------


      var newLocation = Folder.selectDialog(uiStrings.selFolder); // select the folder
      if (newLocation === null) return; // if there was an error or the user hits escape

      var buffer = curComp.layers.addNull();
      buffer.name = "buffer";

      if (objex.settings.sequence === false) {
        var coords = []; // this will hold single frame coords

        /**
         * This is single frame
         * He takes the valueAtTime so where ever the CTI
         * is he will make an WAVEFRONT OBJ file
         *
         *
         */
        for (var j = 0; j < selection.length; j++) {

          var sel = selection[j];
          writeLn("layer " + sel.name + " number (" + j + "/" + selection.length + ")");
          get_position(sel, curComp.time, buffer);
          // recurs_position(sel,curComp.time,[0,0,0]); // this is neat. Check for parenting recursive ;)
          coords.push("" + global_curr_pos[0] + " " + global_curr_pos[1] + " " + global_curr_pos[2]);

          global_curr_pos = [0, 0, 0];

        } // end of j loop single frame

        // make the time stamp for the file
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1; //Months are zero based
        var curr_year = d.getFullYear();
        var curr_hour = d.getHours();
        var curr_min = d.getMinutes();
        var curr_sec = d.getSeconds();

        var timestamp = String(curr_year + "_" + pad(curr_month, 2) + "_" + pad(curr_date, 2) + "__" + pad(curr_hour, 2) + "_" + pad(curr_min, 2) + "_" + pad(curr_sec, 2));

        var fn = curComp.name + " " + timestamp; // prompt("Enter target file name","myObjFile");
        var tf = newLocation.fsName;
        var txtFile = new File(tf + "/" + fn + ".obj");
        // now lets wirte all that junk out
        //
        writeArray(txtFile, coords, curComp.name + "", "", objex.settings.writefaces);
        // and give a message to see that everything worked
        uiStrings.wroteMsg(fn, tf);
        // end of singleframe export
      } else {

        // now for the workarea
        var frDur = curComp.frameDuration;
        var waDur = curComp.workAreaDuration;
        var waStart = curComp.workAreaStart;
        var frRate = curComp.frameRate;
        var waLen = waDur * frRate;

        // the time loop
        for (var t = 0; t < waLen; t++) {

          var curFr = waStart + (t * frDur);

          writeLn("Fetching data on frame " + String((curFr * frRate) + 1) + " of " + String(waLen));

          var coordsAtTime = [];

          // the layer loop
          for (var l = 0; l < selection.length; l++) {
            var lyr = selection[l];

            // writeLn("layer "+lyr.name + " number (" + l+"/"+selection.length+")");
            get_position(lyr, curFr, buffer);
            // recurs_position(lyr,curFr,[0,0,0]);// this is neat. Check for parenting recursive ;)
            coordsAtTime.push("" + global_curr_pos[0] + " " + global_curr_pos[1] + " " + global_curr_pos[2]);
            global_curr_pos = [0, 0, 0];

          } // end of l loop layers

          var timestamp = pad(t, 6);
          var fn = curComp.name + "_" + timestamp;
          var tf = newLocation.fsName;
          var txtFile = new File(tf + "/" + fn + ".obj");


          writeArray(txtFile,
            coordsAtTime,
            curComp.name + "",
            String("# frame " + timestamp + " of " + waLen + " at fps" + frRate),
            objex.settings.writefaces);

        } // end of t loop time / workarea


        uiStrings.wroteMsg(fn, tf);
      } // end of objex.settings.sequence is true
      buffer.remove();
      app.endUndoGroup();
    }; // end of obj export

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

      if (layer.parent == null) {

        x = layer.transform.position.valueAtTime(time, false)[0] - (layer.containingComp.width / 2);
        y = layer.transform.position.valueAtTime(time, false)[1] - (layer.containingComp.height / 2);
      } else {
        x = layer.transform.position.valueAtTime(time, false)[0];
        y = layer.transform.position.valueAtTime(time, false)[1];
      }

      if (layer.threeDLayer) {
        z = layer.transform.position.valueAtTime(time, false)[2];
      } else {
        z = 0.0;
      };

      return [x, y, z];
    };

    /**
     * This is the masterpiece of code for this script
     * this function cals itself recursive.
     * So if you have severeal parented layers it will calc
     * all the positions right. ;) But only positions ;(
     *
     * @deprecated This function is cool but not AE style. I use now get_position(layer,time,buffer)
     * HULK SANGRY!
     * @param  {Layer Object} layer the current layer
     * @param  {Number} time  the current time
     * @param  {Array of 3 Values} pos   this if not parented [0,0,0] or the position of the parent layer
     * @return  nothing
     */
    function recurs_position(layer, time, pos) {

      var res = get_pos_values_at_time(layer, time);
      var x1 = res[0] + pos[0];
      var y1 = res[1] + pos[1];
      var z1 = res[2] + pos[2];

      if (layer.parent == null) {

        global_curr_pos = [x1, y1, z1]; // set the global value
        return;
      } else {

        recurs_position(layer.parent, time, [x1, y1, z1]);
      };
    }

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
      if (layer.parent != null) {

        var expr = [];
        expr.push("// obj-vertex-export parent bake expression thnx 2 Paul T. & Dan E.");
        expr.push("var sourceLayer = thisComp.layer(" + layer.index + ");");
        expr.push("sourceLayer.toWorld(sourceLayer.anchorPoint)");

        if (layer.threeDLayer == true) {
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
      global_curr_pos = [x, y, z]; //

    };

    /**
     * writeArray writes Array data to File
     * @param  {File} txtFile  The target textfile
     * @param  {Array Of Strings} arr    the Array to write
     * @param  {String} grName   [description]
     * @param  {String} comment  [description]
     * @param  {Boolean} addFaces [description]
     * @return {Nothing}          [description]
     */
    function writeArray(txtFile, arr, grName, comment, addFaces) {
      var out;
      if (txtFile != '') {
        //Open the file for writing.
        out = txtFile.open('e', undefined, undefined);

        txtFile.encoding = "UTF-8";

        var res = checkOSSave();
        if ((res[0] == true) && (res[1] == false)) {
          txtFile.lineFeed = "Windows"; //convert to Windows linefeed
        } else if ((res[0] == false) && (res[1] == true)) {
          txtFile.lineFeed = "Unix"; //convert to UNIX linefeed
        } else {
          alert("I cant determine your OS.\nI will use Unix linefeeds.");
          txtFile.lineFeed = "Unix"; //convert to UNIX linefeed
        }

        var openString = "# WaveFront *.obj file generated by Adobe After Effects\n" +
          "# with obj-export.jsx\n";
        // var groupName = "g " + grName;
        txtFile.writeln(openString);
        if (comment.length > 0) {
          txtFile.writeln(comment);
        };

        arr.sort(sortfunc); //must sort vertices to get rid of errant vertex at the end
      }
      if (out != false) {
        for (var i = 0; i < arr.length; i++) {

          txtFile.writeln("v " + arr[i]);
        }

        // this is not reachable by UI
        //
        if (addFaces == true) {
          // not fit for E3D
          var e3dface_str = "f ";
          for (var j = 0; j < arr.length; j++) {
            e3dface_str += " " + String(j + 1);
          }
          txtFile.writeln(e3dface_str);
        };

        txtFile.close();
        // txtFile.execute();
      }
    };
    /**
     * found here
     * http://stackoverflow.com/questions/9223701/math-round-adding-leading-zeros
     *
     * adds digits to the frame number to keep it in order
     * @param  {Number Integer} number the number to pad
     * @param  {Number Integer} length the number of digits to add
     * @return {String}        this is part of the filename like *.00001.obj
     */
    function pad(number, length) {
      var str = '' + number;
      while (str.length < length) {
        str = '0' + str;
      }
      return str;
    }

    /**
     * Checks what type of operating system
     * I think we need to write windows Linefeeds and unix linefeeds
     * @return {Array of Bool} To be really shure we check for both
     */
    function checkOSSave() {
      var os_w = null;
      var os_m = null;
      os_w = ($.os.search(/windows/i) != -1) ? true : false;
      os_m = ($.os.search(/macintosh/i) != -1) ? true : false;
      return [os_w, os_m];
    }

    /**
     * sort the vericies
     * I never really understood these
     * @param  {[type]} a [description]
     * @param  {[type]} b [description]
     * @return {[type]}   [description]
     */
    function sortfunc(a, b) {
      return a - b;
    };

  }; // close run_obj_vertex_export_script


})(this);
