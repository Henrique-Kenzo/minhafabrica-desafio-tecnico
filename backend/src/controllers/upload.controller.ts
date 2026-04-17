import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../utils/AppError';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const getUploadSignature = (req: Request, res: Response) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  if (!process.env.CLOUDINARY_API_SECRET) {
    throw new AppError('Cloudinary não configurado no servidor.', 500);
  }

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder: 'minhafabrica_uploads'
    },
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({ 
    signature, 
    timestamp, 
    cloudName: process.env.CLOUDINARY_CLOUD_NAME, 
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder: 'minhafabrica_uploads'
  });
};
