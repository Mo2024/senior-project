import express from 'express';
import * as AdminContoller from "../controllers/admins";

const router = express.Router();
// Coupons
router.route('/coupon')
    .post(AdminContoller.createCoupon)
    .delete(AdminContoller.deleteCoupon)
    .patch(AdminContoller.editCoupon);

router.get('/coupons/:businessId', AdminContoller.getCoupons);

export default router;