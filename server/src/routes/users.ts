import express from 'express';
import * as UserContoller from "../controllers/users";
import { requiresAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', requiresAuth, UserContoller.getAuthenticatedUser);
router.post('/signup/owner', UserContoller.signUpClient);
router.post('/login', UserContoller.login);
// router.post('/logout', UserContoller.logout);

export default router;