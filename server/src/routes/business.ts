import express from 'express';
import * as BusinessContoller from "../controllers/business";
import multer from 'multer';
import { storage } from '../util/multer';

const router = express.Router();


const upload = multer({ storage });

router.get('/', BusinessContoller.getBusinesses);
router.get('/:businessId', BusinessContoller.getBusiness);
router.get('/branches/:businessId', BusinessContoller.getBranches);
router.get('/coupons', BusinessContoller.getCoupons);
router.get('/employees/:branchId', BusinessContoller.getEmployees);

router.post('/create', upload.single('image'), BusinessContoller.createBusiness);
router.post('/create/branch', BusinessContoller.createBranch);
router.post('/create/coupon', BusinessContoller.createCoupon);
router.post('/employees', BusinessContoller.createEmployee);

router.delete('/delete', BusinessContoller.deleteBusiness);
router.delete('/delete/branch', BusinessContoller.deleteBranch);
router.delete('/delete/coupon', BusinessContoller.deleteCoupon);

router.patch('/edit', BusinessContoller.editBusiness);
router.patch('/edit/branch', BusinessContoller.editBranch);
router.patch('/edit/coupon', BusinessContoller.editCoupon);


export default router;