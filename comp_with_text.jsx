/**
 * @author fabiantheblind
 * @description should create comps from a csv file
 *
 *
 * @todo check if it works
 */
comp_from_text();
function comp_from_text(){

var meta = {
  "w":1280,
  "h":720,
  "aspect":1,
  "dur":20,
  "rate":25,
  "data" :null
};

meta.data = get_data();

if(meta.data === null){
  alert("Data is null");
  return;
}

app.beginUndoGroup("comp from text");
var proj = app.project;
var curComp = proj.activeItem;
   if (!curComp || !(curComp instanceof CompItem)){
        alert("noComp");
        return;
    }


for(var r = 0; r < meta.data.fields.length; r++){

var nc = proj.items.addComp(
     "scene " + String(r+1),
     meta.w,
     meta.h,
     meta.aspect,
     meta.dur,
     meta.rate);
  // for(var f = 0; f < meta.data.fields.length;f++){
  //       var tl = nc.addText(meta.data.fields[f].value);
  //   }
  curComp.layers.add(nc, meta.dur);
}


app.endUndoGroup();
}


function get_data () {
       // alert(this.text);
        var textLines = read_in_txt();
        var rawdata = null;
        if(textLines !== null){
            // markers = lines_to_markers(textLines);
            var res = textlines_to_data(textLines,",");
            // alert(res.toSource());
            rawdata = res;
            // reading the textlines worked if it wasnt null
 if(rawdata !== null){

// alert(rawdata.fields[0].field + " "+rawdata.fields[0].value);
return rawdata;


}else{

return null;
}// end of else textLines !== null
}

}
/**
 * gets lines of strings and creates the data we need from
 * CSV Header and content
 * @param  {Array of String} textLines are , or \t separeted values
 * @return {Object}
 */
function textlines_to_data(textLines,separator){

    var data = {};
    data.fields = [];
    data.keys = [];

    for(var i = 0; i < textLines.length;i++){
      var line = [];
        var line_arr = split_csv(separator,textLines[i]);
    if(i === 0){
        for(var j = 0; j < line_arr.length;j++){
        data.keys[j] = line_arr[j];
        }

        }else{
             var obj = {};
            for(var k = 0; k < line_arr.length;k++){

                // if(k !== line_arr.length -1){
                //     obj_str += 'field_' + k + ':"' + line_arr[k] + '",';
                // }else{
                //     obj_str += 'field_' + k + ':"' + line_arr[k] + '"';
                // }
        line.push({'field':k,"value":line_arr[k]});
            } // end k loop
        } // end else
        data.fields.push(line);
    } // end i loop

 return data;
}

function split_textline(line){
    // var arr = line.split("\t");
    var arr = line.split(/[,\t]/);

return arr;
}

/**
 * This is a string prototype function
 * found here http://www.greywyvern.com/?post=258
 * @param  {String} sep is the separator we use only ,
 * @return {Array}     returns an Array of strings
 */
// String.prototype.splitCSV = function(sep) {
//   for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
//     if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
//       if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
//         foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
//       } else if (x) {
//         foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
//       } else foo = foo.shift().split(sep).concat(foo);
//     } else foo[x].replace(/""/g, '"');
//   } return foo;
// };


// Dont use prototypes?
// for the time beeing YES
// Makes problems with other scripts
// or we need to use a unique prefix! like ftb_splitCSV

function split_csv (sep,the_string){

for (var foo = the_string.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
    if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
      if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
        foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
      } else if (x) {
        foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
      } else foo = foo.shift().split(sep).concat(foo);
    } else foo[x].replace(/""/g, '"');
  }
  return foo;
}


/**
 * this reads in a file
 * line by line
 * @return {Array of String}
 */
function read_in_txt(){

  var textFile = File.openDialog("Select a text file to import.", "*.*",false);



        var textLines = [];
    if (textFile !== null) {
        textFile.open('r', undefined, undefined);
        while (!textFile.eof){
            textLines[textLines.length] = textFile.readln();
        }

        textFile.close();
    }

    if(!textLines){
        alert("ERROR Reading file");
        return null;
    }else{

    return textLines;
    }
}