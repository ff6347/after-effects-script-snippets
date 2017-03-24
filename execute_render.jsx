alert(app.project.file.fullName);


var cmdLineToExecute = '/Applications/Adobe\\ After\\ Effects\\ CC/aerender -project ' + app.project.file.fullName;
var res = system.callSystem(cmdLineToExecute);
alert(res);
