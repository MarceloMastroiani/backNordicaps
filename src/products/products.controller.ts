import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
});

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //CREAR UN PRODUCTO CON SU IMAGEN
  @Post('create')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async create(
    //obtenemos los datos del producto atraves del body
    //EL DTO MUESTRA LOS ERRORES DE VALIDACION PERO LA IMAGEN SE SUBE A CLOUDINARY
    @Body() body: CreateProductDto,
    //obtenemos la imagen subida atraves del file
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      //subimos la imagen a cloudinary y obtenemos el secure_url
      const fileUrl = await this.productsService.uploadImage(file);
      console.log('Controller: Image uploaded URL', fileUrl);

      //se crea el producto
      const product = await this.productsService.create(body, fileUrl);
      return product;
    } catch (err) {
      console.log(err);
    }
  }

  //OBTENEMOS TODOS LOS PRODUCTOS
  @Get('/')
  async findAll() {
    return await this.productsService.findAll();
  }

  //OBTENEMOS UN PRODUCTO POR SU ID
  @Get('product/:id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(+id);
  }

  //ACTUALIZAMOS UN PRODUCTO POR SU ID
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(+id, updateProductDto);
  }

  //ELIMINAMOS UN PRODUCTO POR SU ID
  @Delete('remove/:id')
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(+id);
  }
}
