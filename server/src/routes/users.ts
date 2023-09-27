import express from 'express';
import * as UserContoller from "../controllers/users";
import { requiresAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', requiresAuth, UserContoller.getAuthenticatedUser);
//this should go to the customer route ig
router.get('/allBusinesses', UserContoller.getAllBusinesses);
router.post('/signup/owner', UserContoller.signUpOwner);
router.post('/login', UserContoller.login);
router.post('/logout', UserContoller.logout);
router.patch('/update', requiresAuth, UserContoller.updateUserInfo);


export default router;