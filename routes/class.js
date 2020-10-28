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
var table = "classes";

var params = {
  TableName: table
};
// Get all
router.get('/classes', (req, res) => {
  docClient.scan(params, function(err, data) {
    if (err) {
        res.status(500).send(err)
    } else {
        res.send(data.Items);
    }
  });
})


// Get user by ma_lop
router.get('/classes/:id', (req, res) => {
  const ma_lop = req.params.id;
  const options = {
    ...params,
    Key: {
      'ma_lop': ma_lop
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

// create new class
router.post('/classes', (req, res) => {
  const options = {
    ...params,
    Item: {
      id: uuid.v1(),
      ma_lop: req.body.ma_lop,
      ten: req.body.ten
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


// update class by ma_lop
router.put('/classes/:id', (req, res) => {
  const options = {...params,
    Key: {
      ma_lop: req.params.id
    },
    UpdateExpression: "set ten = :name",
    ExpressionAttributeValues:{
        ":name": req.body.ten,
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

// delete class by ma_lop
router.delete('/classes/:id', (req, res) => {
  const options = {
    ...params,
    Key:{
     'ma_lop': req.params.id
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
