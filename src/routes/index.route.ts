import { Router } from 'express';
import { Photo } from '../models/photo.model';
import multer from 'multer';

const router = Router();

//add multer middleware
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/assets/uploads')
    },
    filename: (req, file, cb) => {
        // cb(null, file.originalname)
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})
//give multer the storage configuration
const upload = multer({ storage })

router.get('/', async (req, res, next) => {
    try {
        const photos = await Photo.find();
    
        /** @TODO Render Existing Photos in index.ejs */
        res.render('index', { photos });
    } catch (err) {
        console.error(err);
        next(err)
    }
})

router.post(
    /** @TODO Add multer middleware */
    //upload single file with name 'image'
    '/', upload.single('image'),
    async (req, res, next) => {
        try {
            const { title } = req.body;
            const filename = req.file?.filename;
            const path = `/${filename}`;
            const photo = new Photo({ title, path });

            /** @TODO Save Photo in database */
            await photo.save();
            res.redirect('/');
            res.status(200).json({ message: 'photo and title saved successfully' });

        } catch (err) {
            console.error(err);
            next(err)
        }
    }
)

export default router;