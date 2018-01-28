var testdata = require('../data.json');

var express = require('express');
var app = express();
var server = app.listen(3000, listening);

function listening() {
  console.log('listening ...');
}

app.get('/search/department/', getPreReqs);

function getPreReqs(request, response) {
  var department = request.query.name;
  var specialization = request.query.spec;
  var reply;

  if (testdata.department.some(item => item.name === department)) {
    var tmp = testdata.department.find(item => item.name == department);
    tmp = tmp.specialization.find(item => item.name === specialization);
    if (tmp) {
      reply = {
        status: "found",
        department: department,
        data: tmp
      }
    }
    else {
      reply = {
        status: "specialization not found",
        department: department
      }
    }
  }
  else {
    reply = {
      status: "department not found"
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
    data: { "departments": data }
  }
  response.send(reply);
}

app.get('/search/courses/', getAllCourses);

function getAllCourses(request, response) {
  //TODO return all courses instaed of just data;
  var reply;
  var data = testdata;

  reply = {
    status: "found",
    data: { "courses" : data }
  }
  response.send(reply);
}

app.get('/search/course/:coursename', getCourse);

function getCourse(request, response) {
  var reply;
  var course = request.params.coursename;
}
