/* Plugins. */
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');

/* Multer storage configuration. */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join("uploads", req.body?.type);
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        let sanitizedFilename = file.originalname.toLowerCase().replace(/\s+/g, '');
        let filename = crypto.randomBytes(16).toString('hex') + path.extname(sanitizedFilename);
        cb(null, filename);
    }
});

/* Multer configuration. */
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: (req, file, cb) => {
        let mimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        let extensions = ['.jpeg', '.jpg', '.png'];
        if (mimeTypes.includes(file.mimetype) && extensions.includes(path.extname(file.originalname).toLowerCase())) {
            return cb(null, true);
        } else {
            return cb(new Error('Error: Incoming data is not in the required format! Allowed types: ' + extensions.join(', ')));
        }
    }
});

module.exports = upload;