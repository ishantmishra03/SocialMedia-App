import multer from 'multer';

const storage = multer.memoryStorage();

const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    // Videos
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-ms-wmv',
    'video/webm'
];

const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('only image and video files are allowed!'));
    }
};

const limits = {
    fileSize: 20 * 1024 * 1024, // 20Mb max
};

const upload = multer({
    storage,
    fileFilter,
    limits
});

export default upload;