const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const express = require('express');
var router = express.Router();
const uri = "mongodb+srv://user:creative@cluster0-3fbmr.gcp.mongodb.net/test?retryWrites=true&w=majority";
autoIncrement = require('mongoose-auto-increment');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
var mongoose_fuzzy_searching = require("mongoose-fuzzy-searching-v2");

var connection = mongoose.createConnection(uri);
autoIncrement.initialize(connection);

var skill = new mongoose.Schema({ name: String });

var employeeSchema = new mongoose.Schema({
    id: {
        type: Schema.Types.ObjectId
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
    },
    skills: {
        type: Array,
        required:  'Required.'
        }
});

employeeSchema.plugin(mongoose_fuzzy_searching, {
    fields: ["fullName"]
  });

employeeSchema.plugin(aggregatePaginate);

employeeSchema.plugin(autoIncrement.plugin, {
    model: 'Employee',
    startAt: 1  
});

var employees = mongoose.model('Employee', employeeSchema);

emp = new employees();
connection.collection('employees').count().then((count) => {
    console.log('No of documents:', count);
    if (count == 0) {
        // resets employee id when database is cleared 
        emp.resetCount(function(err, data) {});
    }
});

module.exports = {
 searchName: function(word) {
    var result = '';
    return new Promise(function(resolve, reject) {
        employees.fuzzySearch(word, (err, users) => {
            result = users;
            resolve(result);});
            
    });
} 
}