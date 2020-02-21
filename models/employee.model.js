const mongoose = require('mongoose');


var employeeSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    fullName: {
        type: String,
        required: 'Name is required.'
    },
    dob: {
        type: String,
        required:  'DOB is required.'
    },
    salary: {
        type: Number,
        required:  'Salary is required.'
    },
    photo: {
        type: String
    }
});

mongoose.model('Employee', employeeSchema);