const express = require('express');
const bucketlistController = require('../controllers/bucketlist.controller');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/:userid/bucketlists/', authController.protect, authController.authorize("admin", "regular"), bucketlistController.createBucketList);
router.get('/:userid/bucketlists/', authController.protect, authController.authorize("admin", "regular"), bucketlistController.getBucketlists);
router.put('/:userid/bucketlists/:id', authController.protect, authController.authorize("admin", "regular"), bucketlistController.updateBucketList);
router.get('/:userid/bucketlists/:id', authController.protect, authController.authorize("admin", "regular"), bucketlistController.getSpecificBucketlist);
router.delete('/:userid/bucketlists/:id', authController.protect, authController.authorize("admin", "regular"), bucketlistController.deleteBucketlist);

module.exports = router;