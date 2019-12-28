const express = require('express');
const bucketlistController = require('../controllers/bucketlist.controller');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/:userid/bucketlists/', authController.protect, bucketlistController.createBucketList);
router.get('/:userid/bucketlists/', authController.protect, bucketlistController.getBucketlists);
router.put('/:userid/bucketlists/:id', authController.protect, bucketlistController.updateBucketList);
router.get('/:userid/bucketlists/:id', authController.protect, bucketlistController.getSpecificBucketlist);
router.delete('/:userid/bucketlists/:id', authController.protect, bucketlistController.deleteBucketlist);

module.exports = router;