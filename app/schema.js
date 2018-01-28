const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Course = new Schema({
  name: {
    type: String,
    required: [true, "Course name is required"]
  },
  abbreviation: {
    type: String,
    required: [true, "Course abbreviation is required"]
  },
  description: {
    type: String
  },
  prerequisites: {
    type: [String]
  }
}):

const Specialization = new Schema({
  name: {
    type: String,
    required: [true, "Specialization name is required"]
  },
  courses: {
    type: [Course]
  }
});

const Department = new Schema({
  name: {
    type: String,
    required: [true, "Department name is required"]
  },
  specialization: {
    type: [Specialization]
  }
});

// Models
var CourseModel = mongoose.model('Course', Course);
var SpecializationModel = mongoose.model('Specialization', Specialization);
var DepartmentModel = mongoose.model('Department', Department);
