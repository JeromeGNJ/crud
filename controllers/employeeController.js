const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
var pic = {link: ''};
var path = require('path');
var fs = require('fs');
const fileUpload = require('express-fileupload');
const app = express();
mongoose.set('useFindAndModify', false);
const empmodel = require('../models/employee.model');
const paginate = require('express-paginate');
app.use(paginate.middleware(10, 50));

router.get('/', (req, res) => {

    res.render("employee/addOrEdit", {
        viewTitle: "Create Employee",
        bttn: 'Create',
        del: 'hidden'
    });
});


router.post('/', (req, res) => {
    console.log(req.body);
    if (req.body.info == 'Create')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

function base64_encode(file) {
    // read binary data
    console.log(File);
    var bitmap = fs.readlinkSync(file,'buffer');
    console.log(bitmap);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
   }


function insertRecord(req, res) {
 //   console.log('insert', req.body);
 //   var base64str = base64_encode(req.body.photo);
    console.log(req.body);
    var employee = new Employee();
    employee.fullName = req.body.fullName;
    employee.id = req.body.id;
    if (req.body.photo) { employee.photo = req.body.photo; }
    employee.dob = req.body.dob;
    employee.salary = req.body.salary;
    employee.skills = req.body.skills;


    employee.save((err, doc) => {
        if (!err) {
            console.log('doc', doc);
            res.redirect('employee/list');
          }  else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Create Employee",
                    employee: req.body,
                    bttn: 'Create',
                    del: 'hidden'

                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    console.log('update', req.body);
    
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('employee/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: 'Edit Employee',
                    employee: req.body,
                    bttn: 'Update',
                    del: false
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.post('/list', (req, res) => {
    empmodel.searchName(req.body.search).then(function(secret) {
        console.log(secret);
        res.render("employee/list", {
            list: secret
        });
    });
    console.log(req.body, 'btn');
})

router.get('/list', (req, res) => {
    Employee.find((err, docs) => {
        console.log('db', docs);
        if (!err) {
            const pageCount = Math.ceil(docs.length / 10);
            let page = parseInt(2);
            if (!page) { page = 1;}
            if (page > pageCount) {
                page = pageCount
            }
            pages = [...Array(pageCount).keys()];
            console.log(page, pageCount, pages);
            res.render("employee/list", {
                list: docs.slice(page * 10 - 10, page * 10)
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});

router.get('/api/list', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            res.json({
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'salary':
                body['salaryError'] = err.errors[field].message;
                break;
            case 'dob':
                body['dobError'] = err.errors[field].message;
                break;
            case 'skills':
                body['skillsError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("employee/addOrEdit", {
                viewTitle: "Update Employee",
                employee: doc,
                bttn: 'Update',
                del: false

            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee/list');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});

module.exports = router;