var testdata = require('../data.json');
var coursedata = require('../data2.json');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Setup connection to MongoDB
var mongo = require('mongodb').MongoClient;
var db;
var url = 'mongodb://root:floreqadmin@ds117848.mlab.com:17848/floreqs';

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

mongo.connect(url, function (err, database) {
  if(err) {
    console.log(err);
    process.exit(1);
  }

  db = database.db('floreqs');
  var server = app.listen(3000 || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
})

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
  // need temp json file that has courses
  var reply;
  var data = coursedata;

  reply = {
    status: "found",
    data: data
  }
  response.send(reply);
}

app.get('/search/course/:coursename', getCourse);

function getCourse(request, response) {
  var reply;
  var course = request.params.coursename;
}

app.post('/insert/department/', insertDepartment);

function insertDepartment(req, res) {
  console.log(req.body);
  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  } else {
    var department = {
      "name" : req.name,
      "specializations": []
    };

    db.collection("department").insertOne(department, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new department.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
}
