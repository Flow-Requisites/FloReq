var testdata = { "department": [
                {
                  "name": "compe",
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

app.get('/search/:department/:specialization/', getDepartment);

function getDepartment(request, response) {
  var department = request.params.department;
  var specialization = request.params.specialization;
  var reply;

  if (testdata.department.some(item => item.name === department)) {
    reply = {
      status: "found",
      data: testdata.department.find(item => item.name === department)
    }
  } else {
    reply = {
      status: "department cannot be found"
    }
  }
  response.send(reply);
}


app.get('/search/departments/', getAllDepartments);

function getAllDepartments(request, response) {
  var reply;
  var data = testdata.department.map(value => value.name);

  reply = {
    status: "found",
    data: data
  }
  response.send(reply);
}
