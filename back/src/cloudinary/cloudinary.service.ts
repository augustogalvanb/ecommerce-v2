import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'ecommerce-products',
          resource_type: 'image',
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            reject(new BadRequestException('Error al subir la imagen'));
          }
          resolve(result.secure_url);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const urlParts = imageUrl.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = `ecommerce-products/${publicIdWithExtension.split('.')[0]}`;

      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error al eliminar imagen de Cloudinary:', error);
      throw new BadRequestException('Error al eliminar la imagen');
    }
  }

  async deleteMultipleImages(imageUrls: string[]): Promise<void> {
    const deletePromises = imageUrls.map((url) => this.deleteImage(url));
    await Promise.all(deletePromises);
  }
}