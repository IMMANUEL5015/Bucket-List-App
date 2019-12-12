const express = require('express');
const bucketlistController = require('../controllers/bucketlist.controller');

const router = express.Router();

router.post('/', bucketlistController.createBucketList);
router.get('/', bucketlistController.getBucketlists);

module.exports = router;