const express = require('express');
const bucketlistController = require('../controllers/bucketlist.controller');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/', authController.protect, bucketlistController.createBucketList);
router.get('/', authController.protect, bucketlistController.getBucketlists);
router.put('/:id', authController.protect, bucketlistController.updateBucketList);
router.get('/:id', authController.protect, bucketlistController.getSpecificBucketlist);
router.delete('/:id', authController.protect, bucketlistController.deleteBucketlist);
module.exports = router;