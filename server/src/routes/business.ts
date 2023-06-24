import express from 'express';
import multer from 'multer';
import * as BusinessController from '../controllers/business';
import { storage } from '../util/multer';

const router = express.Router();
const upload = multer({ storage });

// Businesses
router.route('/')
    .get(BusinessController.getBusinesses)
    .post(upload.single('image'), BusinessController.createBusiness)
    .delete(BusinessController.deleteBusiness)
    .patch(BusinessController.editBusiness);

router.get('/:businessId', BusinessController.getBusiness);

// Branches
router.route('/branch')
    .post(BusinessController.createBranch)
    .delete(BusinessController.deleteBranch)
    .patch(BusinessController.editBranch);

router.get('/branches/:businessId', BusinessController.getBranches);

// Coupons
router.route('/coupon')
    .post(BusinessController.createCoupon)
    .delete(BusinessController.deleteCoupon)
    .patch(BusinessController.editCoupon);

router.get('/coupons', BusinessController.getCoupons);

// Employees
router.get('/employees/:branchId', BusinessController.getEmployees);
router.post('/employees', BusinessController.createEmployee);
router.patch('/employees/transferBranch', BusinessController.editEmployeeBranch);

// Admins
router.get('/admin/:businessId', BusinessController.getAdmins);
router.route('/admin')
    .post(BusinessController.createAdmin)
    .delete(BusinessController.deleteAdmin);

export default router;
