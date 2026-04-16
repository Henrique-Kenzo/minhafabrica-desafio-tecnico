import multer from 'multer';

// memoryStorage: o arquivo fica no buffer em memória, NUNCA salva em disco
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
