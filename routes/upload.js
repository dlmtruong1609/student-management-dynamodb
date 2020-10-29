var express = require('express');
var router = express.Router();
const studentsDao = require('../daos/students.dao')
// upload avatar
router.post('/students/avatar', async (req, res) => {
    let files = req.files;
    let avatar = await files.avatar;
    const uploadS3 = await studentsDao.uploadAvatar(avatar);
    res.send(uploadS3)
  })

module.exports = router;