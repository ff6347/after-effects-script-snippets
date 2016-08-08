var main = function (){
  
  app.beginUndoGroup("XXX");

var curComp = app.project.items.addComp('foo', 1000, 1000, 1, 5, 25);

   if (!curComp || !(curComp instanceof CompItem)){
        alert("noComp");
        return;
    };

for(var x = 0; x < curComp.width; x+=50){
  for(var y = 0; y < curComp.height; y+=50){
      var l = curComp.layers.addNull(5);
      l.threeDLayer = true;
      l.position.setValue([x,y,Math.random() * 100 -50]);

    
      }
  }

app.endUndoGroup();
  };


main();
