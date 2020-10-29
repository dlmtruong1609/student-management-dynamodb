/**
 * @author Đặng Lê Minh Trường (dlmtruong1609@gmail.com)
 * @description Render UI CRUD Students
 */
var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
const { parse } = require('path');
require('dotenv').config()


const studentsDao = require('../daos/students.dao')
const classesDao = require('../daos/classes.dao')
/* GET home page. */
router.get('/', async (req, res) => {
  const students = await studentsDao.getAll();
  const classes = await classesDao.getAll();
  console.log(classes);
  res.render('index', { students: students, classes: classes });
});

// render student not api
router.get('/students/delete/:id', async (req, res) => {
  const ma_sinhvien = req.params.id;
  const success = await studentsDao.delete(ma_sinhvien);
  if(success) {
    res.redirect('/')
  } else {
    res.status(500).send(err)
  }
});

router.post('/students/add', async (req, res) => {
  const student = {
    id: uuid.v1(),
    ma_sinhvien: req.body.ma_sinhvien,
    ten_sinhvien: req.body.ten_sinhvien,
    namsinh: req.body.namsinh,
    id_lop: req.body.id_lop,
    avatar: req.body.avatar
  }
  const success = await studentsDao.add(student)
  if(success) {
    res.redirect('/')
  } else {
    res.status(400).send("Invalid")
  }
})

router.get('/students/update/form/:id', async (req, res) => {
  const ma_sinhvien = req.params.id;
  const student = await studentsDao.getSingleById(ma_sinhvien);
  const classes = await classesDao.getAll();
  res.render('StudentFormUpdate', {
    student: student,
    classes: classes
  })
})

router.post('/students/update/:id', async (req, res) => {
  let files = req.files;
  let avatar = await files.avatar;
  const uploadS3 = await studentsDao.uploadAvatar(avatar);
  
  const student = {
    ma_sinhvien: req.params.id,
    ten_sinhvien: req.body.ten_sinhvien,
    namsinh: req.body.namsinh,
    id_lop: req.body.id_lop,
    avatar: uploadS3
  }
  const success = await studentsDao.update(student);
  if(success) {
    res.redirect('/')
  } else {
    res.status(400).send("Invalid")
  }
})
// end render students 

// render classes not api

router.get('/classes/delete/:id', async (req, res) => {
  const ma_lop = req.params.id;
  const success = await classesDao.delete(ma_lop);
  if(success) {
    res.redirect('/')
  } else {
    res.status(400).send("Invalid")
  }
});

router.post('/classes/add', async (req, res) => {
  const classroom = {
    id: uuid.v1(),
    ma_lop: req.body.ma_lop,
    ten: req.body.ten
  }
  const success = await classesDao.add(classroom)
  if(success) {
    res.redirect('/')
  } else {
    res.status(400).send("Invalid")
  }
})

router.get('/classes/update/form/:id', async (req, res) => {
  const ma_lop = req.params.id;
  const classroom = await classesDao.getSingleById(ma_lop);
  res.render('ClassFormUpdate', {
    classItem:classroom
  })
})

router.post('/classes/update/:id', async (req, res) => {
  const classroom = {
    ma_lop: req.params.id,
    ten: req.body.ten,
  }
  const success = await classesDao.update(classroom);
  if(success) {
    res.redirect('/')
  } else {
    res.status(400).send("Invalid")
  }
})
module.exports = router;
