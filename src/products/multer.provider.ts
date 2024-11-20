import { diskStorage } from 'multer';

// Configuración de almacenamiento local para Multer
export const multerConfig = {
  storage: diskStorage({
    destination: './uploads', // Carpeta donde se guardarán temporalmente los archivos
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName); // Nombre único para evitar conflictos
    },
  }),
};
