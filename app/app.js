var testdata = { "departments": [
                {
                  "name": "Computer Engineering",
                  "courses": [
                    {
                      "coursename" : "ECE 315",
                      "prereq" : "ECE 212"
                    },
                    {
                      "coursename" : "ECE 420",
                      "prereq" : "CMPUT 379"
                    }
                  ]
                }
              ]};

console.log('Server is starting up');

var express = require('express');
var app = express();
var server = app.listen(3000, listening);

function listening() {
  console.log('listening ...');
}

app.get('/search/:department/', getDepartment);

function getDepartment(request, response) {
  var department = request.params.department;
  var reply;

  // if (testdata[department]) {
    reply = {
      status: "found",
      data: testdata
    }
  // }
  response.send(reply);
}



