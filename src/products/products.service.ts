import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/productSchema';

@Injectable()
//Clase que contiene todas las funciones de la API de productos
export class ProductsService {
  constructor(
    //Inyectamos el modelo de la base de datos
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  // Create el producto nuevo guardandolo en la base de datos con sus datos
  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const newProduct = await this.productModel.create(createProductDto);
      return newProduct.save();
    } catch (err) {
      if (err instanceof Error)
        //Si da error, lanzamos una excepcion con el mensaje de error y el codigo de error
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Busca todos los productos y los devuelve
  async findAll(): Promise<Product[]> {
    try {
      const products = await this.productModel.find();
      return products;
    } catch (err) {
      if (err instanceof Error)
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  // Busca por ID el producto y lo devuelve
  async findOne(id: number): Promise<Product> {
    try {
      const product = await this.productModel.findById(id);
      return product;
    } catch (err) {
      if (err instanceof Error)
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  // Por ID actualizamos el producto y lo devuelve
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

  //Eliminamos el producto con ID
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
