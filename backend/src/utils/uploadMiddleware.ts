import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //guarda los archivos en el directorio que los queremos, y usa path join para garantizar que ande
    //en todas las plataformas
    const uploadPath = path.join(__dirname, '../../public/uploads/profiles');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Genera un nombre de archivo único y resistente a las colisiones y a los guessing-atacks
    const uniqueSuffix = crypto.randomBytes(16).toString('hex'); //genera un número único de 16 bytes hexa
    const ext = path.extname(file.originalname).toLowerCase(); //convierte la extension a minuscujla
    cb(null, `user-${req.params.userId}-${uniqueSuffix}${ext}`);
  },
});

export const uploadProfile = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limita a 5MB el tamaño
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    // Por seguridad solo se dejan estos tipos de imagen
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];

    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(' Solo se permiten JPEG, PNG, y WebP'));
    }
  },
});

/* Esto generalmente se utilizaría en una ruta de express: 
app.post('/users/:userId/profile', uploadProfile.single('profileImage'), (req, res) => {
});
*/
