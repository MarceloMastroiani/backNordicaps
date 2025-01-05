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
  async uploadImage(file): Promise<any> {
    try {
      const filePath = file.path;
      //options de la imagen
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      };
      //Subimos la imagen a cloudinary
      const result = await cloudinary.uploader.upload(filePath, options);

      //Si no da error, devolvemos el secure_url
      return { result };
    } catch (err) {
      if (err instanceof Error)
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //CREA EL PRODUCTO NUEVO Y LO GUARDA EN LA BASE DE DATOS CON SUS DATOS
  async create(
    body: CreateProductDto,
    secure_url,
    public_id,
  ): Promise<Product> {
    try {
      console.log(secure_url);
      console.log(public_id);
      const { name, description, price } = body;
      //Creamos el nuevo producto
      const product = new this.productModel({
        name,
        description,
        price: Number(price),
        secure_url,
        public_id,
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
  async findOne(id: string): Promise<Product> {
    try {
      return await this.productModel.findById(id);
    } catch (err) {
      if (err instanceof Error)
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  //ACTUALIZAMOS EL PRODUCTO CON ID Y LO GUARDAMOS EN LA BASE DE DATOS
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      return this.productModel.findByIdAndUpdate(id, updateProductDto, {
        new: true,
      });
    } catch (err) {
      if (err instanceof Error)
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //ELIMINAMOS EL PRODUCTO CON ID
  async remove(id: string): Promise<Product> {
    try {
      const removeProduct = await this.productModel.findByIdAndDelete(id);
      return removeProduct;
    } catch (err) {
      if (err instanceof Error)
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
