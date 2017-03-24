/**
 * @author Dan Ebberts
 * @description randomize order of layers
 * random order found on: http://forums.creativecow.net/thread/227/10609
 * by Dan Ebberts
 * @todo [description]
 */


randomOrder();
function randomOrder() {

  app.beginUndoGroup('randomOrder selected Layers');
  var myComp = app.project.activeItem;
  var n = myComp.selectedLayers.length;
  var myLayers = [];
  var myIdx = [];
  for (var i = 0; i < n; i++) {
    myIdx[i] = i;
    myLayers[i] = myComp.selectedLayers[i];
  }

  var idx;
  var temp;
  for (var i = 0; i < myLayers.length; i++) {
    idx = i + Math.floor(Math.random() * (myIdx.length - i));
    temp = myIdx[i];
    myIdx[i] = myIdx[idx];
    myIdx[idx] = temp;
  }
  for (var i = 0; i < myLayers.length; i++) {
    myLayers[myIdx[i]].moveToBeginning();
  }

  app.endUndoGroup();

}
