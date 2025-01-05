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
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { multerConfig } from './multer.provider';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs-extra';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //CREAR UN PRODUCTO CON SU IMAGEN
  @Post('create')
  @UseInterceptors(FileInterceptor('file', multerConfig))
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

      //obtenemos el secure_url y el public_id desestructurados del fileUrl
      const { secure_url, public_id } = fileUrl.result;

      //borramos el archivo temporal para evitar que se llene de archivos, ya que el archivo se subio a cloudinary
      await fs.emptyDir('./uploads');

      //se crea el producto con la imagen subida
      const product = await this.productsService.create(
        body,
        secure_url,
        public_id,
      );
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
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

  //ACTUALIZAMOS UN PRODUCTO POR SU ID
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto);
  }

  //ELIMINAMOS UN PRODUCTO POR SU ID
  @Delete('remove/:id')
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(id);
  }
}
