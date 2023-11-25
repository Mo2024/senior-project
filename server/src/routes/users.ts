import express from 'express';
import * as UserContoller from "../controllers/users";
import { isAttendanceUser, isOwner, requiresAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', requiresAuth, UserContoller.getAuthenticatedUser);
//this should go to the customer route ig
router.get('/allBusinesses', requiresAuth, UserContoller.getAllBusinesses);
router.get('/getUserInfo', requiresAuth, UserContoller.getUserInfo);
router.post('/signup', UserContoller.signUpOwner);
router.post('/login', UserContoller.login);
router.post('/login', UserContoller.login);
router.post('/logout', UserContoller.logout);
router.patch('/update', requiresAuth, UserContoller.updateUserInfo);
router.patch('/updatePassword', requiresAuth, UserContoller.updatePassword);
router.post('/forgotPasswordEmail', UserContoller.forgotPasswordEmail);
router.patch('/forgotPasswordCode', UserContoller.forgotPasswordCode);


router.get('/QrCode', isAttendanceUser, UserContoller.getQrCode);
router.get('/branches/generateVCode', isOwner, UserContoller.generateVerificationCode);
router.post('/branches/updateUserPwd', isOwner, UserContoller.updateAttendanceUserPassword);
router.post('/payment-sheet', UserContoller.paymentIntent);


export default router;