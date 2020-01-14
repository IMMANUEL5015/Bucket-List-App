const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/users', authController.protect, authController.authorize('admin'), userController.getAllUsers);

module.exports = router;