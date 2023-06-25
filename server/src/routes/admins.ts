import express from 'express';
import * as AdminContoller from "../controllers/admins";

const router = express.Router();

// Coupons
router.route('/coupon')
    .get(AdminContoller.getCoupons)
    .post(AdminContoller.createCoupon)
    .delete(AdminContoller.deleteCoupon)
    .patch(AdminContoller.editCoupon);


//Categories
router.route('/category')
    .get(AdminContoller.getCategories)
    .post(AdminContoller.createCategory)
    .delete(AdminContoller.deleteCategory)
    .patch(AdminContoller.editCategory);

//items
router.route('/item')
    .get(AdminContoller.getItems)
    .post(AdminContoller.createItem)
    .delete(AdminContoller.deleteItem)
    .patch(AdminContoller.editItem);
export default router;