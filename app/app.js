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

function getAllCourses(req, res) {
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
    var ObjectID = require('mongodb').ObjectID;
    var objId = new ObjectID(req.query._id);
    db.collection(COURSE_COLLECTION).findOne({_id: objId}, function(err, doc) {
      if (err) {
        console.log('failed id');
        handleError(res, err.message, "Failed to get id");
        return;
      } else {
        if (doc != null){
          console.log('success id');
          res.status(200).json(doc);
        }
        else{
          console.log('failed id');
          db.collection(COURSE_COLLECTION).findOne({abbr: req.query.abbr}, function(err1, doc1) {
            if (err1) {
              console.log('failed abbr');
              handleError(res, err.message, "Failed to get abbr. ");
              return;
            }
            else{
              if("doc1 != null"){
                console.log('success abbr');
                res.status(200).json(doc1);
              }
              else{
                console.log('failed abbr');
                // res.status(404).json(doc1);
              }
            }
          });
        }

      }
    });
}

app.get('/search/department/', getDepartment);

function getDepartment(req, res) {
  var ObjectID = require('mongodb').ObjectID;
  var objId = new ObjectID(req.query._id);
  db.collection(DEPARTMENT_COLLECTION).findOne({_id: objId}, function(err, doc) {
    if (err) {
      console.log('error id');
      handleError(res, err.message, "Error to get id");
      return;
    } else {
      if (doc != null){
        console.log('success id');
        res.status(200).json(doc);
      }
      else{
        console.log('failed id');
        db.collection(DEPARTMENT_COLLECTION).findOne({name: req.query.name}, function(err1, doc1) {
          if (err1) {
            console.log('failed name');
            handleError(res, err.message, "Error to get name. ");
            return;
          }
          else{
            if("doc1 != null"){
              console.log('success name');
              res.status(200).json(doc1);
            }
            else{
              console.log('failed name');
              // res.status(404).json(doc1);
            }
          }
        });
      }

    }
  });
}

app.get('/search/specialization/', getSpecialization);

function getSpecialization(req, res) {
  var ObjectID = require('mongodb').ObjectID;
  var objId = new ObjectID(req.query._id);
  db.collection(SPECIALIZATION_COLLECTION).findOne({_id: objId}, function(err, doc) {
    if (err) {
      console.log('error id');
      handleError(res, err.message, "Error to get id");
      return;
    } else {
      if (doc != null){
        console.log('success id');
        res.status(200).json(doc);
      }
      else{
        console.log('failed id');
        db.collection(SPECIALIZATION_COLLECTION).findOne({name: req.query.name}, function(err1, doc1) {
          if (err1) {
            console.log('failed name');
            handleError(res, err.message, "Error to get name. ");
            return;
          }
          else{
            if("doc1 != null"){
              console.log('success name');
              res.status(200).json(doc1);
            }
            else{
              console.log('failed name');
              // res.status(404).json(doc1);
            }
          }
        });
      }

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
  var specializations;
  var specs = req.body.specializations
  if (!req.body.abbr || specs.length <= 0 ) {
    handleError(res, "Invalid user input", "Must provide a course abbr and specializations.", 400);
  } else {
    console.log("specs");
    console.log(specs);
    // Get specializations
    db.collection(SPECIALIZATION_COLLECTION).find({ name : { $in : specs } }).toArray(function(err, docs) {
      if (err) {
        handleError(res, err.message, "Failed to get specializations.");
      } else {
        specializations = docs;
        console.log(specializations);
      }
    });

    var course = {
      "abbr" : req.body.abbr,
      "name" : req.body.name,
      "description" : req.body.description,
      "prerequisites" : req.body.prerequisites
    };

    db.collection(COURSE_COLLECTION).insertOne(course, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new course.");
      } else {
        for (var i = 0; i < specializations.length; i++) {
          console.log(i);
          specializations[i].courses.push(doc.ops[0]._id);
          console.log(specializations[i].courses);
          db.collection(SPECIALIZATION_COLLECTION).updateOne(
            { '_id' : specializations[i]._id },
            { $set: { "courses" : specializations[i].courses } }
          );
        }
        res.status(201).json(doc.ops[0]);
      }
    });
  }
}
