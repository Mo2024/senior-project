import express from 'express';
import * as UserContoller from "../controllers/users";
import { isCustomer, requiresAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', requiresAuth, UserContoller.getAuthenticatedUser);
//this should go to the customer route ig
router.get('/allBusinesses', UserContoller.getAllBusinesses);
router.post('/signup/owner', UserContoller.signUpOwner);
router.post('/signup/customer', UserContoller.signUpCustomer);
router.post('/login', UserContoller.login);
router.post('/logout', UserContoller.logout);
router.patch('/update', requiresAuth, UserContoller.updateUserInfo);

//will have its own section in react native
router.route('/address')
    .post(requiresAuth, isCustomer, UserContoller.createAddress)
    .patch(requiresAuth, isCustomer, UserContoller.updateAddress)
    .delete(requiresAuth, isCustomer, UserContoller.deleteAddress);

export default router;