const express=require('express');
const bcrypt= require('bcryptjs')
const jwt=require('jsonwebtoken')
const validators = require('../middleware/validator.middleware')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth.middleware')


const router= express.Router();

router.post('/register',validators.registerUserValidations,authController.registerUser)

router.post('/login',validators.loginUserValidation,authController.loginUser)

router.get('/me',authMiddleware.authentication,authController.getCurrentUser)

router.get("/logout",authController.logout)

router.get('/user/me/addresses',authMiddleware.authentication,authController.getUserAddresses)

router.post('/user/me/addresses',validators.addressValidation,authMiddleware.authentication,authController.addUseraddress)

router.post('/user/me/addresses/:addressid',authMiddleware.authentication,authController.deleteUseraddress)

module.exports=router;


