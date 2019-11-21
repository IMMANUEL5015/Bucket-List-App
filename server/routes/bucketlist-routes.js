const express = require('express');
const bucketlistController = require('../controllers/bucketlist.controller');

const router = express.Router();

router.post('/', bucketlistController.createBucketList);

module.exports = router;