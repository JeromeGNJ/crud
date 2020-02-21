const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

router.get('/', (req, res) => {
    res.render("employee/addOrEdit", {
        viewTitle: "Create Employee",
        bttn: 'Create'
    });
});

router.post('/', (req, res) => {
    if (req.body)
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function counter(fullName) {
    var ret = Employee.findOneAndUpdate({query:{id:fullName}, update:{$inc : {next:1}}, "new":true, upsert:true});
    // ret == { “_id” : “users”, “next” : 1 }
    return ret.next;
    }


function insertRecord(req, res) {
    console.log('insert', req.body);
    var employee = new Employee();
    employee.fullName = req.body.fullName;
    employee.id = 333;
 //   employee.photo = req.body.photo;
    employee.dob = req.body.dob;
    employee.salary = req.body.salary;
 //   employee.skills = req.body.skills;


    employee.save((err, doc) => {
        if (!err) {
            console.log(doc);
            res.redirect('employee/list');
          }  else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Create Employee",
                    employee: req.body,
                    bttn: 'Create'

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
                    bttn: 'Update'
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            res.render("employee/list", {
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
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            case 'mobile':
                body['mobileError'] = err.errors[field].message;
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
                bttn: 'Update'

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