var myProject = app.project;

var myComposition = myProject.items.addComp("happy_holidays", 1920, 1080, 1.0, 5, 24);

var myTextLayer = myComposition.layers.addText("new_text_layer");

var myTextDocument = myTextLayer.property("ADBE Text Properties").property("ADBE Text Document")

var textDocument1 = myTextDocument.value;

myString = "Happy holidays!";

textDocument1.resetCharStyle();

textDocument1.fontSize = 60;

textDocument1.fillColor = [1, 0, 0];

textDocument1.strokeColor = [0, 1, 0];

textDocument1.strokeWidth = 2;

textDocument1.font = "TimesNewRomanPSMT";

textDocument1.strokeOverFill = true;

textDocument1.applyStroke = true;

textDocument1.applyFill = true;

textDocument1.text = myString;

textDocument1.justification = ParagraphJustification.CENTER_JUSTIFY;

myTextDocument.setValue(textDocument1);