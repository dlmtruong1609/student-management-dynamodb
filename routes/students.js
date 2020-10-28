/**
 * @author Đặng Lê Minh Trường (dlmtruong1609@gmail.com)
 * @description API CRUD Students
 */
var express = require('express');
var uuid = require('node-uuid');
var router = express.Router();
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
  const options = {
    ...params,
    Key: {
      'ma_sinhvien': ma_sinhvien
    }
  }
  docClient.get(options, function(err, data) {
    if (err) {
        res.status(500).send(err)
    } else {
        res.send(data.Item);
    }
  })
})

// create new user
router.post('/students', (req, res) => {
  const options = {
    ...params,
    Item: {
      id: uuid.v1(),
      ma_sinhvien: req.body.ma_sinhvien,
      ten_sinhvien: req.body.ten_sinhvien,
      namsinh: req.body.namsinh,
      id_lop: req.body.id_lop,
      avatar: req.body.avatar
    }
  }
  docClient.put(options, function(err, data) {
    if (err) {
        res.status(500).send(err)
    } else {
        res.send("Create Success")
    }
});
})


// update user by ma_sinhvien
router.put('/students/:id', (req, res) => {
  const options = {...params,
    Key: {
      ma_sinhvien: req.params.id
    },
    UpdateExpression: "set ten_sinhvien = :name, namsinh=:birthday, avatar=:avatar, id_lop=:class",
    ExpressionAttributeValues:{
        ":name": req.body.ten_sinhvien,
        ":birthday": req.body.namsinh,
        ":avatar": req.body.avatar,
        ":class": req.body.id_lop
    },
    ReturnValues:"UPDATED_NEW"
  }
  docClient.update(options, function(err, data) {
    if (err) {
        res.status(500).send(err)
    } else {
        res.send("Updated Success")
    }
});
})

// delete user by ma_sinhvien
router.delete('/students/:id', (req, res) => {
  const options = {
    ...params,
    Key:{
     'ma_sinhvien': req.params.id
    },
  }
  docClient.delete(options, function(err, data) {
    if (err) {
        res.status(500).send(err)
    } else {
        res.send("Deleted Success")
    }
  })
})
module.exports = router;
