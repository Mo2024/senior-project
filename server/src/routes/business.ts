import express from 'express';
import * as BusinessContoller from "../controllers/business";

const router = express.Router();

router.get('/', BusinessContoller.getBusinesses);
router.get('/branches', BusinessContoller.getBranches);
router.post('/create', BusinessContoller.createBusiness);
router.post('/create/branch', BusinessContoller.createBranch);
router.delete('/delete', BusinessContoller.deleteBusiness);
router.delete('/delete/branch', BusinessContoller.deleteBranch);
router.patch('/edit', BusinessContoller.editBusiness);
router.patch('/edit/branch', BusinessContoller.editBranch);


export default router;