/**
 * @author Đặng Lê Minh Trường (dlmtruong1609@gmail.com)
 * @description API CRUD Students
 */
var express = require('express');
var uuid = require('node-uuid');
const classesDao = require('../daos/classes.dao');
var router = express.Router();
// Get all
router.get('/classes', async (req, res) => {
  const classes = await classesDao.getAll();
  res.send(classes);
})


// Get user by ma_lop
router.get('/classes/:id', async (req, res) => {
  const ma_lop = req.params.id;
  const classroom = await classesDao.getSingleById(ma_lop);
  res.send(classroom);
})

// create new class
router.post('/classes', async (req, res) => {
  const classroom = {
    id: uuid.v1(),
    ma_lop: req.body.ma_lop,
    ten: req.body.ten
  }
  const success = await classesDao.add(classroom)
  if(success) {
    res.send('Create Success');
  } else {
    res.status(400).send("Invalid")
  }
})


// update class by ma_lop
router.put('/classes/:id', async (req, res) => {
  const classroom = {
    ma_lop: req.params.id,
    ten: req.body.ten,
  }
  const success = await classesDao.update(classroom);
  if(success) {
    res.send('Update Success');
  } else {
    res.status(400).send("Invalid")
  }
})

// delete class by ma_lop
router.delete('/classes/:id', async (req, res) => {
  const ma_lop = req.params.id;
  const success = await classesDao.delete(ma_lop);
  if(success) {
    res.send('Delete Success');
  } else {
    res.status(400).send("Invalid")
  }
})
module.exports = router;
