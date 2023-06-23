import express from 'express';
import * as EmployeesContoller from "../controllers/employees";

const router = express.Router();

router.get('/', EmployeesContoller.getBusinesses);

export default router;