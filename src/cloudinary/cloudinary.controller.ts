import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  Delete,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from './cloudinary.service';

//Creamos un nuevo storage para mandar la imagen a Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
});

@Controller('images')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  //Interceptor de archivo que se encarga de subir la imagen a Cloudinary
  @UseInterceptors(FileInterceptor('image', { storage }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      //mandamos el file a la funcion de subida de imagen en cloudinaryService
      const result = await this.cloudinaryService.uploadImage(file.path);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('all')
  async getAllImages() {
    const result = await this.cloudinaryService.getAllImages();
    //Mapeamos cada imagen a su URL
    const data = result.resources.map((resource) => resource.url);
    return data;
  }
}
