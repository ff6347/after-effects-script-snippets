var keys = []; // Build an array

for (var i = 1; i <= selectedProp.numKeys; i++) {
  keys[keys.length] = selectedProp.keyValue(i);
} // Copy all values

    // Save the time of the first and last keyframe, so the script knows the space where to distribute them
var first = selectedProp.keyTime(1);
var last = selectedProp.keyTime(selectedProp.numKeys);

    // Delete all keyframes
while(selectedProp.numKeys) {
  selectedProp.removeKey(1);
}

    // Set new keyframes
for(i = 1; i <= keys.length; i++) {
  selectedProp.setValueAtTime(first + (last - first) / (keys.length - 1) * (i - 1), keys[i - 1]);
}
