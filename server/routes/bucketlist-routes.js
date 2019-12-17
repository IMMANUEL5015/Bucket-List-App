const express = require('express');
const bucketlistController = require('../controllers/bucketlist.controller');

const router = express.Router();

router.post('/', bucketlistController.createBucketList);
router.get('/', bucketlistController.getBucketlists);
router.put('/:id', bucketlistController.updateBucketList);
router.get('/:id', bucketlistController.getSpecificBucketlist);
router.delete('/:id', bucketlistController.deleteBucketlist);
module.exports = router;