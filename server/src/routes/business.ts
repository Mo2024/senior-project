import express from 'express';
import * as BusinessContoller from "../controllers/business";

const router = express.Router();

router.get('/', BusinessContoller.getBusinesses);
router.post('/create', BusinessContoller.createBusiness);
router.delete('/delete', BusinessContoller.deleteBusiness);
router.post('/create/branch', BusinessContoller.createBranch);
router.delete('/delete/branch', BusinessContoller.deleteBranch);


export default router;