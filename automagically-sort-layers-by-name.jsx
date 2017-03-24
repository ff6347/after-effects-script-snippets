/**
 * This script tries to sort layers by name
 * more a proof of concept thingy
 * using this technique can hold some problems
 * - in this case the "et" gets found in "consectetur" "et" "amet"
 * - the last matching pattern will be the one that gets executed
 */

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

/**
 * get unique Array content
 * does not work on mixed arrays
 * http://stackoverflow.com/questions/1960473/unique-values-in-an-array
 * @return {Array} [description]
 */
Array.prototype.getUnique = function() {
  var u = {}, a = [];
  for(var i = 0, l = this.length; i < l; ++i) {
    if(u.hasOwnProperty(this[i])) {
      continue;
    }
    a.push(this[i]);
    u[this[i]] = 1;
  }
  return a;
};

/**
 * LayerSet Class
 * @param {String} _name The name of the class corresponds to the pattern
 */
function LayerSet(_name) {
  this.name = _name;
  this.collection = [];// will hold layers

  this.add = function(layer) {
    this.collection.push(layer);
  };
}
/**
 * A Pattern Class
 * @param {a regex string} _reg String
 */
function Pattern(_reg) {
  this.reg = escapeRegExp(_reg);
}


function automagically_sort() {


  app.beginUndoGroup('automagically sort by name');
/**
 * prerequisites check if thete is a comp
 * @type {[type]}
 */
  var curComp = app.project.activeItem;
  if (!curComp || !(curComp instanceof CompItem)) {
        // alert("noComp");
        // return;
    curComp = app.project.items.addComp('automagically sort', 500, 500, 1, 10, 25);
  }

  var names = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipisicing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipisicing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];// some random names
  var layers = [];// holds the layers
  for(var l = 0; l < names.length; l++) {
    var lay = curComp.layers.addNull();// add a null
    lay.name = makeid(4) + ' ' + names[l] + ' ' + makeid(5); // give it a name
    layers.push(lay);// push to array
  } // close l create layers loop. // this shoudl be a space seprated field or something like that


  var unique_names = names.getUnique(); // use the prototype functiion
  var patterns = []; // this will hold the patterns
  for (var n = 0; n < unique_names.length; n++) {
    patterns.push(new Pattern(unique_names[n]));
  } // close ncreate patterns from names loop

  var sets = []; // will hold all the layer sets
  for(var r = 0; r < patterns.length; r++) {
    var set = new LayerSet(patterns[r].reg);// make a new set per pattern
    for (var i = 0; i < layers.length; i++) {
      var layer = layers[i];// isolate
      var reg = new RegExp(patterns[r].reg, 'g');// make a regex
      if(reg.test(layer.name) === true) {
        set.add(layer);// Yes found something push to LayerSet
      } // close regex check
    } // close i layers loop
    if(set.collection.length > 0) {
      sets.push(set);
    }
  }// close r pattern loop


/**
 * Now the sorting
 * We need to get every item from the set and move it to the top
 */

// alert(sets.toSource());
  for (var s = 0; s < sets.length; s++) {
    var curSet = sets[s];// isolate
    if(curSet.collection.length > 0) {
    // continue;
  // we have something in the set loop the collection
      var collabel = (s) % 16;
      for (var cl = 0; cl < curSet.collection.length; cl++) {
        var curLayer = curSet.collection[cl];
        curLayer.moveToBeginning();
        if(parseInt(app.version, 10) > 10) {
      // CS6+ feature
          curLayer.label = collabel;
        }
      } // end cl collection loop
    }// if there are no layers move to the next set
  } // end s sets loop
  app.endUndoGroup();
}


/**
 * [escapeRegExp description]
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 * http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
 */
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}


/**
 * Make pseudo random text found here
 * http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
 * @return {String} [Pseudo random string]
 */
function makeid(num) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for(var i = 0; i < num; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}


  //  _   _  ______          _______  _    _ _   _ _____       _______ _______ _____ _   _  _____
  // | \ | |/ __ \ \        / /  __ \| |  | | \ | |  __ \   /\|__   __|__   __|_   _| \ | |/ ____|
  // |  \| | |  | \ \  /\  / /| |__) | |  | |  \| | |  | | /  \  | |     | |    | | |  \| | |  __
  // | . ` | |  | |\ \/  \/ / |  _  /| |  | | . ` | |  | |/ /\ \ | |     | |    | | | . ` | | |_ |
  // | |\  | |__| | \  /\  /  | | \ \| |__| | |\  | |__| / ____ \| |     | |   _| |_| |\  | |__| |
  // |_| \_|\____/   \/  \/   |_|  \_\\____/|_| \_|_____/_/    \_\_|     |_|  |_____|_| \_|\_____|

automagically_sort();
