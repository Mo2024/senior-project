import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import { isImageFile } from "./functions";
import createHttpError from "http-errors";

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {

        if (!isImageFile(file.originalname)) {
            return cb(createHttpError(400, 'File must be an image!'), file.originalname);

        } else {
            const uniqueFilename = `${uuidv4()}.${file.originalname.split('.').pop()}`;
            cb(null, uniqueFilename);
        }


    },
});