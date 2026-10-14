const express = require('express');
const adminRouter = express.Router();
const { adminregister, adminlogin } = require('../controllers/admin.controller');

adminRouter.post('/register', adminregister);
adminRouter.post('/login', adminlogin);

module.exports = adminRouter;