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

// Employees
router.route('/employee')
    .post(BusinessController.createEmployee)
    .delete(BusinessController.deleteEmployee)

router.get('/employees/:branchId', BusinessController.getEmployees);
router.patch('/employee/transferBranch', BusinessController.editEmployeeBranch);

// Admins
router.get('/admin/:businessId', BusinessController.getAdmins);
router.route('/admin')
    .post(BusinessController.createAdmin)
    .delete(BusinessController.deleteAdmin);

export default router;
