import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import fs from 'fs';

// Monta o caminho absoluto da pasta uploads/, na raiz do projeto
const UPLOAD_ROOT = path.join(process.cwd(), 'uploads');

// fonte da verdade de pastas permitidas (hardcoded pra não deixar usuario definir isso.)
const ALLOWED_CONTEXTS = ['games', 'categories', 'studios'] as const;
type UploadContext = typeof ALLOWED_CONTEXTS[number];

// checa se o context bate com o array do ALLOWED_CONTEXTS
function isValidContext(value: string): value is UploadContext {
  return (ALLOWED_CONTEXTS as readonly string[]).includes(value);
}

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    const context = req.params.context!;

    if (!isValidContext(context)) return cb(new Error('Contexto de upload inválido'), '');

    const directory = path.join(UPLOAD_ROOT, context);
    if(!fs.existsSync(directory)) fs.mkdirSync(directory, {recursive: true})

    cb(null, directory)
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  }

});

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];

const fileFilter: multer.Options['fileFilter'] = (req, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de arquivo não permitido. Apenas JPEG, PNG, GIF, AVIF ou WebP. Recebido: ${file.mimetype}`));
  }
};

export const multerUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }
});
