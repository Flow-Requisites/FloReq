var testdata = require('../data.json');
var coursedata = require('../data2.json');

var DEPARTMENT_COLLECTION = 'department';
var SPECIALIZATION_COLLECTION = 'specialization';
var COURSE_COLLECTION = 'course';

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

// app.get('/search/department/', getPreReqs);

// function getPreReqs(request, response) {
//   var department = request.query.name;
//   var specialization = request.query.spec;
//   var reply;

//   if (testdata.department.some(item => item.name === department)) {
//     var tmp = testdata.department.find(item => item.name == department);
//     tmp = tmp.specialization.find(item => item.name === specialization);
//     if (tmp) {
//       reply = {
//         status: "found",
//         department: department,
//         data: tmp
//       }
//     }
//     else {
//       reply = {
//         status: "specialization not found",
//         department: department
//       }
//     }
//   }
//   else {
//     reply = {
//       status: "department not found"
//     }
//   }
//   response.send(reply);
// }

app.get('/search/departments/', getAllDepartments);

function getAllDepartments(req, res) {
  db.collection(DEPARTMENT_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get departments.");
    } else {
      res.status(200).json(docs);
    }
  });
}

app.get('/search/specializations/', getAllSpecializations);

function getAllSpecializations(req, res) {
  db.collection(SPECIALIZATION_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get specializations.");
    } else {
      res.status(200).json(docs);
    }
  });
}

app.get('/search/courses/', getAllCourses);

function getAllCourses(request, response) {
  db.collection(COURSE_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get courses.");
    } else {
      res.status(200).json(docs);
    }
  });
}

app.get('/search/course/', getCourse);

function getCourse(req, res) {
    db.collection(COURSE_COLLECTION).findOne({name: req.query.name}, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to get course.");
        return;
      } else {
        res.status(200).json(doc);
      }
    });
}

app.get('/search/department/', getDepartment);

function getDepartment(req, res) {
    db.collection(DEPARTMENT_COLLECTION).findOne({name: req.query.name}, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to get department.");
        return;
      } else {
        res.status(200).json(doc);
      }
    });
}

app.get('/search/specialization/', getSpecialization);

function getSpecialization(req, res) {
    db.collection(SPECIALIZATION_COLLECTION).findOne({name: req.query.name}, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to get specialization.");
        return;
      } else {
        res.status(200).json(doc);
      }
    });
}

app.post('/insert/department/', insertDepartment);

function insertDepartment(req, res) {
  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  } else {
    var department = {
      "name" : req.body.name,
      "specializations": []
    };

    db.collection(DEPARTMENT_COLLECTION).insertOne(department, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new department.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
}

app.post('/insert/specialization/', insertSpecialization);

function insertSpecialization(req, res) {
  var department;
  if (!req.body.name || !req.body.department ) {
    handleError(res, "Invalid user input", "Must provide a specialization name and department.", 400);
  } else {

    // Get department collection
    db.collection(DEPARTMENT_COLLECTION).findOne({name: req.body.department}, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to get department.");
        return;
      } else {
        department = doc;
      }
    });

    var specialization = {
      "name" : req.body.name,
      "courses": []
    };

    db.collection(SPECIALIZATION_COLLECTION).insertOne(specialization, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new specialization.");
      } else {
        department.specializations.push(doc.ops[0]._id);
        db.collection(DEPARTMENT_COLLECTION).updateOne(
          { '_id' : department._id },
          { $set: { "specializations" : department.specializations } }
        );
        console.log(department)
        res.status(201).json(doc.ops[0]);
      }
    });
  }
}

app.post('/insert/course/', insertCourse);

function insertCourse(req, res) {
  var test;
  var specs = req.body.specializations
  if (!req.body.name || specs.length <= 0 ) {
    handleError(res, "Invalid user input", "Must provide a course name and specializations.", 400);
  } else {
    console.log(specs);
    // Get specializations
    db.collection(SPECIALIZATION_COLLECTION).find({ name : { "$in" : specs } }).toArray(function(err, docs) {
      if (err) {
        handleError(res, err.message, "Failed to get specializations.");
      } else {
        specs = docs;
        test = docs;
      }
    });

    console.log(test);

    // var specialization = {
    //   "name" : req.body.name,
    //   "courses": []
    // };

    // db.collection(SPECIALIZATION_COLLECTION).insertOne(specialization, function(err, doc) {
    //   if (err) {
    //     handleError(res, err.message, "Failed to create new specialization.");
    //   } else {
    //     department.specializations.push(doc.ops[0]._id);
    //     db.collection(DEPARTMENT_COLLECTION).updateOne(
    //       { '_id' : department._id },
    //       { $set: { "specializations" : department.specializations } }
    //     );
    //     console.log(department)
    //     res.status(201).json(doc.ops[0]);
    //   }
    // });
  }
}
