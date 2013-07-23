// Copyright (c)  2013
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

// check out this post
// http://aenhancers.com/viewtopic.php?f=8&t=889
//

(function(thisObj){
// basic panel
run(thisObj);

 function run(thisObj){

// this is global
data =  {
    'id':8000 /* this is execute script */
};


///   THIS WILL CHECK IF PANEL IS DOCKABLE OR FLAOTING WINDOW
var win   = buildUI(thisObj );
if ((win !== null) && (win instanceof Window)) {
    win.center();
    win.show();
} // end if win  null and not a instance of window

 function buildUI (thisObj  ) {
    var win = (thisObj instanceof Panel) ? thisObj :  new Window('palette', 'PANEL LABEL',[0,0,150,260],{resizeable: true,name:"aPanel"});

    if (win !== null) {

        var H = 25; // the height
        var W = 30; // the width
        var G = 5; // the gutter
        var x = G;
        var y = G;
        win.command_id_etext = win.add('edittet',[x,y,x+W*3,y + H],8000);
        y+=H;
        // win.check_box = win.add('checkbox',[x,y,x+W*2,y + H],'check');
        // win.check_box.value = metaObject.setting1;
        win.do_it_button = win.add('button', [x ,y,x+W*3,y + H], 'do it');
        // win.up_button = win.add('button', [x + W*5+ G,y,x + W*6,y + H], 'Up');

        // win.check_box.onClick = function (){
        //     alert("check");
        // };
        win.command_id_etext.onChanging = function (){

          data.id = parseTextToInteger( this.text, "sorry this is not a value",0);
        };

        win.do_it_button.onClick = function () {
            some_fun();
      };

    }
    return win;
}

function resetValIfNAN(val,resetVal, theErrorMessage){
    if(isNaN(val) === true){
    val = resetVal;
    // alert(theErrorMessage);
    }
  return val;
}

/**
 * [parseTextToInteger description]
 * @param  {[type]} theText         [description]
 * @param  {[type]} theErrorMessage [description]
 * @param  {[type]} resetVal        [description]
 * @return {[type]}
 */
function parseTextToInteger(theText,theErrorMessage,resetVal){
  var val = Math.abs( parseInt(theText, 10));
    val = resetValIfNAN(val,resetVal,theErrorMessage);
  return val;
}

function some_fun(){
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


    app.beginUndoGroup('execute command ' + data.id);

// var props = curComp.selectedProperties

    app.endUndoGroup();
  }
 }// close run

})(this);