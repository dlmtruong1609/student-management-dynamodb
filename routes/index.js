/**
 * @author Đặng Lê Minh Trường (dlmtruong1609@gmail.com)
 * @description CRUD Students
 */
var express = require('express');
var router = express.Router();
require('dotenv').config()
var AWS = require("aws-sdk");
require('dotenv').config()
AWS.config.update({
  region: "us-west-2",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});


var docClient = new AWS.DynamoDB.DocumentClient();
var table = "students";

var params = {
  TableName: table
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Get all
router.get('/students', (req, res) => {
  docClient.scan(params, function(err, data) {
    if (err) {
        res.status(500).send(err)
    } else {
        res.send(data.Items);
    }
});
})


// Get user by ma_sinhvien
router.get('/students/:id', (req, res) => {
  const ma_sinhvien = req.params.id;
  console.log(ma_sinhvien);
  params.Key = {
    'ma_sinhvien': ma_sinhvien
  }
  docClient.get(params, function(err, data) {
    if (err) {
        res.status(500).send(err)
    } else {
        res.send(data);
    }
  })
})

// create new user
router.post('/students', (req, res) => {
  params.Item = {
    id: req.body.id,
    ma_sinhvien: req.body.ma_sinhvien,
    ten_sinhvien: req.body.ten_sinhvien,
    namsinh: req.body.namsinh,
    id_lop: req.body.id_lop,
    avatar: req.body.avatar
  }
  docClient.put(params, function(err, data) {
    if (err) {
        res.status(500).send(err)
    } else {
        res.send("Create Success")
    }
});
})


// update user by ma_sinhvien
router.put('/students', (req, res) => {
  params.Item = {...params,
    Key: {
      ma_sinhvien: req.params.id
    },
    UpdateExpression: "set ten_sinhvien = :name, namsinh=:birthday, avatar=:avatar, id_lop=:class",
    ExpressionAttributeValues:{
        ":name": req.body.ten_sinhvien,
        ":birthday": req.body.namsinh,
        ":avatar": req.body.avatar,
        "class": req.body.id_lop
    },
    ReturnValues:"UPDATED_NEW"
  }
  docClient.put(params, function(err, data) {
    if (err) {
        res.status(500).send(err)
    } else {
        res.send("Updated Success")
    }
});
})

// delete user by ma_sinhvien
router.delete('/students/:id', (req, res) => {
  params = {
    ...params,
    Key:{
     'ma_sinhvien': req.params.id
    },
  }
  docClient.delete(params, function(err, data) {
    if (err) {
        res.status(500).send(err)
    } else {
        res.send("Deleted Success")
    }
  })
})
module.exports = router;
