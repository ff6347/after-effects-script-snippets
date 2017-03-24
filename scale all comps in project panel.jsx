(function(thisObj) {// ~ scale all comps in panel

  run(thisObj);

  function run(thisObj) {

    var data = {
      scale_factor: 4.0,
      scirptname: File($.fileName)
    };

    doScale(data);

  }

// var curComp = app.project.activeItem;
//    if (!curComp || !(curComp instanceof CompItem)){
//         alert("noComp");
//         return;
//     };
//
  function doScale(data) {
        // By bracketing the operations with begin/end undo group, we can
        // undo the whole script with one undo operation.
    app.beginUndoGroup('do sale');

    for(var i = 0; i < app.project.selection.length; i++) {

      var activeItem = app.project.selection[i];// = app.project.activeItem;
      if ((activeItem === null) || !(activeItem instanceof CompItem)) {
        alert('Please select or open a composition first.', data.scriptName);
      } else {
        // Validate the input field, in case the user didn't defocus it first (which often can be the case).
        // this.parent.parent.optsRow.text_input.notify("onChange");

        var activeComp = activeItem;

        // app.beginUndoGroup(data.scriptName);

        // Create a null 3D layer.
        var null3DLayer = activeItem.layers.addNull();
        null3DLayer.threeDLayer = true;

        // Set its position to (0,0,0).
        null3DLayer.position.setValue([0, 0, 0]);

        // Set null3DLayer as parent of all layers that don't have parents.
        makeParentLayerOfAllUnparented(activeComp, null3DLayer);

        // Set new comp width and height.

        activeComp.width = Math.floor(activeComp.width * data.scale_factor);
        activeComp.height = Math.floor(activeComp.height * data.scale_factor);

        // Then for all cameras, scale the Zoom parameter proportionately.
        scaleAllCameraZooms(activeComp, data.scale_factor);

        // Set the scale of the super parent null3DLayer proportionately.
        var superParentScale = null3DLayer.scale.value;
        superParentScale[0] *= data.scale_factor;
        superParentScale[1] *= data.scale_factor;
        superParentScale[2] *= data.scale_factor;
        null3DLayer.scale.setValue(superParentScale);

        // Delete the super parent null3DLayer with dejumping enabled.
        null3DLayer.remove();

        // app.endUndoGroup();

        // Reset data.scale_factor to 1.0 for next use.
// ~         data.scale_factor = 1.0;
// ~         if (this.parent.parent.optsRow.scaleButton.value) {
// ~           this.parent.parent.optsRow.text_input.text = "1.0";
// ~         }
      }
    }
    app.endUndoGroup();

  } // close onScaleClick

      //
    // Scales the zoom factor of every camera by the given scale_factor.
    // Handles both single values and multiple keyframe values.
  function scaleAllCameraZooms(theComp, scaleBy) {
    for (var i = 1; i <= theComp.numLayers; i++) {
      var curLayer = theComp.layer(i);
      if (curLayer.matchName === 'ADBE Camera Layer') {
        var curZoom = curLayer.zoom;
        if (curZoom.numKeys === 0) {
          curZoom.setValue(curZoom.value * scaleBy);
        } else {
          for (var j = 1; j <= curZoom.numKeys; j++) {
            curZoom.setValueAtKey(j, curZoom.keyValue(j) * scaleBy);
          }
        }
      }
    }
  }
    // Sets newParent as the parent of all layers in theComp that don't have parents.
    // This includes 2D/3D lights, camera, av, text, etc.
    //
  function makeParentLayerOfAllUnparented(theComp, newParent) {
    for (var i = 1; i <= theComp.numLayers; i++) {
      var curLayer = theComp.layer(i);
      if (curLayer !== newParent && curLayer.parent === null) {
        curLayer.parent = newParent;
      }
    }
  }
}(this));
