import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { v2 as cloudinary } from 'cloudinary';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/productSchema';

@Injectable()

//CLASE QUE CONTIENE TODAS LAS FUNCIONES DE LA API DE PRODUCTOS
export class ProductsService {
  constructor(
    //Inyectamos el modelo de la base de datos
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  //SUBIMOS LA IMAGEN A CLOUDINARY Y OBTENEMOS EL SECURE_URL
  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      //options de la imagen
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      };
      //Subimos la imagen a cloudinary
      const result = await cloudinary.uploader.upload(file.path, options);
      //Si no da error, devolvemos el secure_url
      return result.secure_url;
    } catch (err) {
      if (err instanceof Error)
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //CREA EL PRODUCTO NUEVO Y LO GUARDA EN LA BASE DE DATOS CON SUS DATOS
  async create(body: CreateProductDto, fileUrl: string): Promise<Product> {
    try {
      const { name, description, price } = body;
      //Creamos el nuevo producto
      const product = new this.productModel({
        name,
        description,
        price: Number(price),
        fileUrl,
      });

      const newProduct = await this.productModel.create(product);
      //Subimos la data a mongoDB
      return newProduct.save();
      //error
    } catch (err) {
      if (err instanceof Error)
        //Si da error, lanzamos una excepcion con el mensaje de error y el codigo de error
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //BUSCA TODOS LOS PRODUCTOS EN LA DB Y LO DEVUELVE
  async findAll(): Promise<Product[]> {
    try {
      const products = await this.productModel.find();
      return products;
    } catch (err) {
      if (err instanceof Error)
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  //BUSCA UN PRODUCTO POR ID Y LO DEVUELVE
  async findOne(id: number): Promise<Product> {
    try {
      const product = await this.productModel.findById(id);
      return product;
    } catch (err) {
      if (err instanceof Error)
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  //ACTUALIZAMOS EL PRODUCTO CON ID Y LO GUARDAMOS EN LA BASE DE DATOS
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const updateProduct = await this.productModel.findByIdAndUpdate(
        id,
        updateProductDto,
      );
      return updateProduct;
    } catch (err) {
      if (err instanceof Error)
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //ELIMINAMOS EL PRODUCTO CON ID
  async remove(id: number): Promise<Product> {
    try {
      const removeProduct = await this.productModel.findByIdAndDelete(id);
      return removeProduct;
    } catch (err) {
      if (err instanceof Error)
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
