import multer from "multer";
import { v4 as uuidv4 } from 'uuid';

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        const uniqueFilename = `${uuidv4()}.${file.originalname.split('.').pop()}`;
        cb(null, uniqueFilename);
    },
});