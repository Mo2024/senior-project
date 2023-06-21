import express from 'express';
import * as BusinessContoller from "../controllers/business";

const router = express.Router();

router.get('/', BusinessContoller.getBusinesses);
router.get('/branches', BusinessContoller.getBranches);
router.get('/coupons', BusinessContoller.getCoupons);

router.post('/create', BusinessContoller.createBusiness);
router.post('/create/branch', BusinessContoller.createBranch);
router.post('/create/coupon', BusinessContoller.createCoupon);

router.delete('/delete', BusinessContoller.deleteBusiness);
router.delete('/delete/branch', BusinessContoller.deleteBranch);
router.delete('/delete/coupon', BusinessContoller.deleteCoupon);

router.patch('/edit', BusinessContoller.editBusiness);
router.patch('/edit/branch', BusinessContoller.editBranch);
router.patch('/edit/coupon', BusinessContoller.editCoupon);


export default router;