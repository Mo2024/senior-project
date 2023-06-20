import express from 'express';
import * as BusinessContoller from "../controllers/business";

const router = express.Router();

router.get('/', BusinessContoller.getBusinesses);
router.post('/create', BusinessContoller.createBusiness);


export default router;