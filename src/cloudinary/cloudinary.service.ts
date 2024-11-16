import { Injectable, Inject } from '@nestjs/common';
import { HttpStatus, HttpException } from '@nestjs/common';
import { CreateCloudinaryDto } from './dto/create-cloudinary.dto';
import { UpdateCloudinaryDto } from './dto/update-cloudinary.dto';
import { ConfigService } from '@nestjs/config';

import { v2 as cloudinary, UploadApiResponse, v2 } from 'cloudinary';
import { url } from 'inspector';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(filePath: string): Promise<UploadApiResponse> {
    //Upload image
    //Opciones de subida de imagen
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(filePath, options, (error, result) => {
        if (error) {
          return reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  async getImageId(publicId: string): Promise<string> {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result.url;
    } catch (error) {}
  }

  async getAllImages(): Promise<any> {
    try {
      const result = await cloudinary.api.resources();
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
