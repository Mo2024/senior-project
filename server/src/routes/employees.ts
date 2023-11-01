import express from 'express';
import * as EmployeesContoller from "../controllers/employees";

const router = express.Router();

router.post('/attendance', EmployeesContoller.attendance);
router.get('/items', EmployeesContoller.getItems);

router.route('/category')
    .get(EmployeesContoller.getCategories)

router.route('/stock')
    .get(EmployeesContoller.getStocks)
    .post(EmployeesContoller.addStock)
    .patch(EmployeesContoller.updateStock)
    .delete(EmployeesContoller.deleteStock);
export default router;