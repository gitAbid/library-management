import multer from "multer";
import {storage} from "../storage/db_storage";

export const upload = multer({storage: storage})

