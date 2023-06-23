import express from 'express';
import * as EmployeesContoller from "../controllers/employees";

const router = express.Router();

router.post('/attendance', EmployeesContoller.attendance);

export default router;