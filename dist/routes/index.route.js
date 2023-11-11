"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const photo_model_1 = require("../models/photo.model");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
//add multer middleware
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/assets/uploads');
    },
    filename: (req, file, cb) => {
        // cb(null, file.originalname)
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
//give multer the storage configuration
const upload = (0, multer_1.default)({ storage });
router.get('/', async (req, res, next) => {
    try {
        const photos = await photo_model_1.Photo.find();
        /** @TODO Render Existing Photos in index.ejs */
        res.render('index', { photos });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});
router.post(
/** @TODO Add multer middleware */
//upload single file with name 'image'
'/', upload.single('image'), async (req, res, next) => {
    try {
        const { title } = req.body;
        const image = req.file;
        const photo = new photo_model_1.Photo({ title, image });
        /** @TODO Save Photo in database */
        await photo.save();
        res.redirect('/');
        res.status(200).json({ message: 'photo and title saved successfully' });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});
exports.default = router;
