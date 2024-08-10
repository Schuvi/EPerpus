const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determine the destination based on the fieldname or any other criteria
        let destPath;
        if (file.fieldname === 'gambar_buku') {
            destPath = path.join(__dirname, '../../ePerpus/public/buku');
        } else if (file.fieldname === 'gambar_profil') {
            destPath = path.join(__dirname, '../../ePerpus/public/user');
        } else {
            return cb(new Error('Unknown file fieldname'), false);
        }
        cb(null, destPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Initialize upload variable
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Error: Images Only!"));
        }
    }
}).fields([
    { name: 'gambar_buku', maxCount: 1 },
    { name: 'gambar_profil', maxCount: 1 }
]);

module.exports = upload;
