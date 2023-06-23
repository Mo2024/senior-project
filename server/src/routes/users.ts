import express from 'express';
import * as UserContoller from "../controllers/users";
import { requiresAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', requiresAuth, UserContoller.getAuthenticatedUser);
router.get('/allBusinesses', UserContoller.getAllBusinesses);
router.post('/signup/owner', UserContoller.signUpOwner);
router.post('/signup/customer', UserContoller.signUpCustomer);
router.post('/login', UserContoller.login);
router.post('/logout', UserContoller.logout);

export default router;