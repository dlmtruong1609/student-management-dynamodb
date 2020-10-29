var AWS = require("aws-sdk");
const BUCKET_NAME = 'minhtruong';
require('dotenv').config()
AWS.config.update({
  region: "us-west-2",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

var docClient = new AWS.DynamoDB.DocumentClient();

const table = 'students'
const getAll = async () => {
    var params = {
        TableName: table
      };
    return await (await docClient.scan(params).promise()).Items
}

const getSingleById = async (ma_sinhvien) => {
  const options = {
    TableName: table,
    Key: {
      'ma_sinhvien': ma_sinhvien
    }
  }
  return await (await docClient.get(options).promise()).Item
}

const add = async (student) => {
  const options = {
    TableName: table,
    Item: student
  }
  return await docClient.put(options).promise().catch((err) => {
    console.log(err);
    return null
  })
}

const update = async (student) => {
  const options = {
    TableName: table,
    Key: {
      ma_sinhvien: student.ma_sinhvien
    },
    UpdateExpression: "set ten_sinhvien = :name, namsinh=:birthday, avatar=:avatar, id_lop=:class",
    ExpressionAttributeValues:{
        ":name": student.ten_sinhvien,
        ":birthday": student.namsinh,
        ":avatar": student.avatar,
        ":class": student.id_lop
    },
    ReturnValues:"UPDATED_NEW"
  }
  return await docClient.update(options).promise().catch((err) => {
    console.log(err);
    return null;
  })
}

const deleteById = async (ma_sinhvien) => {
  const options = {
    TableName: table,
    Key:{
     'ma_sinhvien': ma_sinhvien
    },
  }
  return await docClient.delete(options).promise().catch((err) => {
    console.log(err);
    return null;
  })
}



const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});
const uploadAvatar = async (avatar) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: avatar.name, // File name you want to save as in S3
    Body: avatar.data,
    ACL: "public-read",
  };
  return await (await s3.upload(params).promise()).Location
}
module.exports ={
    getAll: getAll,
    getSingleById: getSingleById,
    add: add,
    update: update,
    delete: deleteById,
    uploadAvatar: uploadAvatar
}