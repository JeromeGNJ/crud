const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
var fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
mongoose.set('useFindAndModify', false);
const empmodel = require('../models/employee.model');

router.get('/', (req, res) => {
    res.render("employee/addOrEdit", {
        viewTitle: "Create Employee",
        bttn: 'Create',
        del: 'hidden'
    });
});

router.post('/file_upload', upload.single('file'), (req, res, next) => {
    console.log(req.file);
    fs.readFile(req.file.path, (err, data) => {
        if (err) throw err;
        data.toString('base64');
    });
    // const encoded = req.file.buffer.toString('base64');
    //console.log(encoded);
})

router.post('/', upload.single('file'), (req, res, next) => {

    if (req.body.info == 'Create') {
        if (req.file) {
            fs.readFile(req.file.path, (err, data) => {
                if (err) throw err;
                let picData = data.toString('base64');
                insertRecord(req, res, picData);
            });
        } else { insertRecord(req, res); }
    } else {
        if (req.file) {
            fs.readFile(req.file.path, (err, data) => {
                if (err) throw err;
                let picData = data.toString('base64');
                updateRecord(req, res, picData);

            });
        } else { updateRecord(req, res); }
    }
});


function insertRecord(req, res, picData) {
    //   console.log('insert', req.body);
    //   var base64str = base64_encode(req.body.photo);
    console.log(req.body);
    var employee = new Employee();
    skillData =
    {
        python: req.body.python || 'hidden',
        NodeJS: req.body.NodeJS || 'hidden',
        Angular: req.body.Angular || 'hidden',
        R: req.body.R || 'hidden',
        Javascript: req.body.Javascript || 'hidden',
        HTML: req.body.HTML || 'hidden',
        CSS: req.body.CSS || 'hidden',
        Java: req.body.Java || 'hidden',
        React: req.body.React || 'hidden',
        Kotlin: req.body.Kotlin || 'hidden'
    };

    employee.fullName = req.body.fullName;
    employee.id = req.body.id;
    if (picData) {
        employee.photo = picData;
    }
    employee.dob = req.body.dob;
    employee.salary = req.body.salary;
    employee.skills = skillData;
    employee.save((err, doc) => {
        if (!err) {
            console.log('doc', doc);
            res.redirect('employee/list');
        } else {
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

function updateRecord(req, res, picData) {
    console.log('update', req.body);
    skillData =
    {
        python: req.body.python || 'hidden',
        NodeJS: req.body.NodeJS || 'hidden',
        Angular: req.body.Angular || 'hidden',
        R: req.body.R || 'hidden',
        Javascript: req.body.Javascript || 'hidden',
        HTML: req.body.HTML || 'hidden',
        CSS: req.body.CSS || 'hidden',
        Java: req.body.Java || 'hidden',
        React: req.body.React || 'hidden',
        Kotlin: req.body.Kotlin || 'hidden'
    };

    if (req.body.photo) {
        if (req.body.photo.length > 0) {
            data = {
                dob: req.body.dob,
                fullName: req.body.fullName,
                salary: req.body.salary,
                skills: skillData
            }
        }
        if (picData) {
            data.photo = picData;
        }
    } else {
        data = {
            dob: req.body.dob,
            fullName: req.body.fullName,
            salary: req.body.salary,
            skills: skillData
        }
        if (picData) {
            data.photo = picData;
        }
    }
    console.log(data);
    Employee.updateOne({
        _id: req.body._id
    },
        data,
        (err, doc) => {
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
    //  console.log(req.body);
    if (req.body.info) {
        Employee.find((err, docs) => {
            //; console.log('db', docs);
            if (!err) {
                const pageCount = Math.ceil(docs.length / 10);
                let page = parseInt(req.body.info);
                if (!page) { page = 1; }
                if (page > pageCount) {
                    page = pageCount
                }
                pages = [];
                for (let index = 1; index <= pageCount; index++) {
                    pages.push({ item: index });
                }
                //   console.log(page, pageCount, pages);
                res.render("employee/list", {
                    list: docs.slice(page * 10 - 10, page * 10),
                    pages: pages,
                    page: page
                });
            }
            else {
                console.log('Error in retrieving employee list :' + err);
            }
        });
    }
    if (req.body.search) {
        empmodel.searchName(req.body.search).then(function (secret) {
            if (secret) {
                res.render("employee/list", {
                    list: secret
                });
            }
        });
    } else {
        Employee.find((err, docs) => {
            //; console.log('db', docs);
            if (!err) {
                const pageCount = Math.ceil(docs.length / 10);
                let page = parseInt(1);
                if (!page) { page = 1; }
                if (page > pageCount) {
                    page = pageCount
                }
                pages = [];
                for (let index = 1; index <= pageCount; index++) {
                    pages.push({ item: index });
                }
                console.log(page, pageCount, pages);
                res.render("employee/list", {
                    list: docs.slice(page * 10 - 10, page * 10),
                    pages: pages,
                    page: page
                });
            }
            else {
                console.log('Error in retrieving employee list :' + err);
            }
        });
    }
})


router.get('/list', (req, res) => {
    Employee.find((err, docs) => {
        //; console.log('db', docs);
        if (!err) {
            const pageCount = Math.ceil(docs.length / 10);
            let page = parseInt(1);
            if (!page) { page = 1; }
            if (page > pageCount) {
                page = pageCount
            }
            pages = [];
            for (let index = 1; index <= pageCount; index++) {
                pages.push({ item: index });
            }
            console.log(page, pageCount, pages);
            res.render("employee/list", {
                list: docs.slice(page * 10 - 10, page * 10),
                pages: pages,
                page: page
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
            res.json({
                error: err
            });
        }
    });
});

router.get('/api/create/:name&:salary&:dob&:skills', (req, res) => {
    // res.json({result: req.params});
    var employee = new Employee();
    skillset = JSON.stringify(req.params.skills);
    skillset = skillset.slice(2, skillset.length - 2);
    skillList = skillset.split(',');
    skillDataRaw = {};
    for (let index = 0; index < skillList.length; index++) {
        const element = skillList[index];
        k = element.split(':')[0];
        v = element.split(':')[1];
        v = v.slice(1, v.length - 1)
        skillDataRaw[k] = v;
    }
    //  console.log(skillData);
    skillData =
    {
        python: skillDataRaw.python || 'hidden',
        NodeJS: skillDataRaw.NodeJS || 'hidden',
        Angular: skillDataRaw.Angular || 'hidden',
        R: skillDataRaw.R || 'hidden',
        Javascript: skillDataRaw.Javascript || 'hidden',
        HTML: skillDataRaw.HTML || 'hidden',
        CSS: skillDataRaw.CSS || 'hidden',
        Java: skillDataRaw.Java || 'hidden',
        React: skillDataRaw.React || 'hidden',
        Kotlin: skillDataRaw.Kotlin || 'hidden'
    };

    employee.fullName = req.params.name.slice(1, req.params.name.length - 1);
    employee.dob = req.params.dob.slice(1, req.params.dob.length - 1);
    employee.salary = req.params.salary;
    employee.skills = skillData;
    employee.save((err, doc) => {
        if (!err) {
            console.log('doc', doc);
            res.json({ result: 'success' });
        } else {
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
                res.json({ error: err });
        }
    });
});

router.get('/api/update/:id&:name&:salary&:dob&:skills', (req, res) => {
    skillset = JSON.stringify(req.params.skills);
    skillset = skillset.slice(2, skillset.length - 2);
    skillList = skillset.split(',');
    skillDataRaw = {};
    for (let index = 0; index < skillList.length; index++) {
        const element = skillList[index];
        k = element.split(':')[0];
        v = element.split(':')[1];
        v = v.slice(1, v.length - 1)
        skillDataRaw[k] = v;
    }
    //  console.log(skillData);
    skillData =
    {
        python: skillDataRaw.python || 'hidden',
        NodeJS: skillDataRaw.NodeJS || 'hidden',
        Angular: skillDataRaw.Angular || 'hidden',
        R: skillDataRaw.R || 'hidden',
        Javascript: skillDataRaw.Javascript || 'hidden',
        HTML: skillDataRaw.HTML || 'hidden',
        CSS: skillDataRaw.CSS || 'hidden',
        Java: skillDataRaw.Java || 'hidden',
        React: skillDataRaw.React || 'hidden',
        Kotlin: skillDataRaw.Kotlin || 'hidden'
    };
    data = {
        dob: req.params.dob.slice(1, req.params.dob.length - 1),
        fullName: req.params.name.slice(1, req.params.name.length - 1),
        salary: req.params.salary,
        skills: skillData
    }
    Employee.updateOne({
        _id: req.pram.id
    },
        data,
        (err, doc) => {
            if (!err) { res.json({ result: 'success' }); }
            else {
                if (err.name == 'ValidationError') {
                    handleValidationError(err, req.body);
                    res.json({ error: err });
                }
                else
                    console.log('Error during record update : ' + err);
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

router.get('/api/get_user/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.json({
                list: doc
            });
        } else {
            res.json({
                error: err
            });
        }
    });
});

router.get('/api/create/:name&:salary', (req, res) => {
    var employee = new Employee();
    employee.fullName = req.params.name
    employee.salary = req.params.salary;
    employee.save((err, doc) => {
        if (!err) {
            res.json({
                result: 'successfully added.'
            })
        } else {
            res.json({
                error: err
            });
        }
    });
});


router.get('/api/search/:name', (req, res) => {
    empmodel.searchName(req.params.name).then(function (secret) {
        res.json({
            list: secret
        });
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

router.get('/api/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.json({
                Delete: 'Success'
            });
        }
        else {
            res.json({
                error: err
            });
        }
    });
});

module.exports = router;