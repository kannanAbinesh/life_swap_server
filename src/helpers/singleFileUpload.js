/* Plugins. */
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');

/* Multer storage configuration. */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = `uploads/habits`;
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        let sanitizedFilename = file.originalname.toLocaleLowerCase().replace(/\s+/g, '');
        let filename = crypto.randomBytes(16).toString('hex') + path.extname(sanitizedFilename);
        cb(null, filename);
    }
});

/* Multer configuration. */
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: (req, file, cb) => {
        let mimeTypes, extensions;

        mimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        extensions = ['.jpeg', '.jpg', '.png'];

        /* Validate mimeType and Extensions.  */
        if (mimeTypes.includes(file.mimetype) && extensions.includes(path.extname(file.originalname).toLowerCase())) return cb(null, true);
        else return cb(new Error('Error: Incoming data is not in the required format! Allowed types: ' + extensions.join(', ')));
    }
});

module.exports = upload;