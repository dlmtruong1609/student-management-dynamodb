/**
 * @author Đặng Lê Minh Trường (dlmtruong1609@gmail.com)
 * @description Render UI CRUD Students
 */
var express = require('express');
var router = express.Router();
const request = require('request');
const util = require('util')
var uuid = require('node-uuid');
var AWS = require("aws-sdk");
const { parse } = require('path');
require('dotenv').config()
AWS.config.update({
  region: "us-west-2",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

var docClient = new AWS.DynamoDB.DocumentClient();


/* GET home page. */
router.get('/', async (req, res) => {
  var params = {
    TableName: 'students'
  };
  let students = await []
  await docClient.scan(params, async function(err, data) {
    if (err) {
        res.status(500).send(err)
    } else {
      students = await data.Items
      docClient.scan({
        TableName: 'classes'
      }, function(err, data) {
        if (err) {
            res.status(500).send(err)
        } else {
          res.render('index', { students: students, classes: data.Items });
        }
      });
    }
  });
});

// render student not api
router.get('/students/delete/:id', async (req, res) => {
  const options = {
    TableName: 'students',
    Key:{
     'ma_sinhvien': req.params.id
    },
  }
  docClient.delete(options, function(err, data) {
    if (err) {
        res.status(500).send(err)
    } else {
      res.redirect('/')
    }
  })
});

router.post('/students/add', (req, res) => {
  const options = {
    TableName: 'students',
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
        res.redirect("/")
    }
  });
})

router.get('/students/update/form/:id', (req, res) => {
  const ma_sinhvien = req.params.id;
  const options = {
    TableName: 'students',
    Key: {
      'ma_sinhvien': ma_sinhvien
    }
  }
  docClient.get(options, function(err, data) {
    if (err) {
        res.status(500).send(err)
    } else {
      res.render('StudentFormUpdate', {
        student: data.Item
      })
    }
  })
})

router.post('/students/update/:id', (req, res) => {
  const options = {
    TableName: 'students',
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
        res.redirect('/')
    }
  });
})
// end render students 

// render classes not api

router.get('/classes/delete/:id', async (req, res) => {
  const options = {
    TableName: 'classes',
    Key:{
     'ma_lop': req.params.id
    },
  }
  docClient.delete(options, function(err, data) {
    if (err) {
        res.status(500).send(err)
    } else {
      res.redirect('/')
    }
  })
});

router.post('/classes/add', (req, res) => {
  const options = {
    TableName: 'classes',
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
        res.redirect("/")
    }
  });
})

router.get('/classes/update/form/:id', (req, res) => {
  const ma_lop = req.params.id;
  const options = {
    TableName: 'classes',
    Key: {
      'ma_lop': ma_lop
    }
  }
  docClient.get(options, function(err, data) {
    if (err) {
        res.status(500).send(err)
    } else {
      console.log(data);
      res.render('ClassFormUpdate', {
        classItem: data.Item
      })
    }
  })
})

router.post('/classes/update/:id', (req, res) => {
  const options = {
    TableName: 'classes',
    Key: {
      ma_lop: req.params.id
    },
    UpdateExpression: "set ten = :name",
    ExpressionAttributeValues:{
        ":name": req.body.ten
    },
    ReturnValues:"UPDATED_NEW"
  }
  docClient.update(options, function(err, data) {
    if (err) {
        res.status(500).send(err)
    } else {
        res.redirect('/')
    }
  });
})
module.exports = router;
