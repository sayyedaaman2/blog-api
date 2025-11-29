import express from 'express'
import {logIn, signUp} from '../controllers/user.controller.js'
import {logInValidationSchema, signUpValidationSchema} from '../schema/auth.schema.js'
import validate from '../middlewares/validate.js'
const router = express.Router();

router.post('/signup',validate(signUpValidationSchema),signUp)
router.post('/login',validate(logInValidationSchema),logIn)

export default router;