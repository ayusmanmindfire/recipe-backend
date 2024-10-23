//Native imports
import path, {dirname} from "path"
import { fileURLToPath } from 'url';
import fs from 'fs'

//Third party imports
import multer from "multer";

// Get the current file name and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer storage options
let storage = multer.diskStorage({

    // Set destination for uploaded files
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },

    // Set the filename for the uploaded files
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Preserve file extension
    }
});

// Create an instance of multer with the specified storage configuration
let upload = multer({ storage: storage });

export default upload;