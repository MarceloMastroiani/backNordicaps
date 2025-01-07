import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ProductsService } from 'src/products/products.service';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schema/cartSchema';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private productsService: ProductsService,
  ) {}

  //CREA EL CARRITO NUEVO Y LO GUARDA EN LA BASE DE DATOS
  create(createCartDto: CreateCartDto) {
    return this.cartModel.create(createCartDto);
  }

  //AGREGA EL PRODUCTO A UN CARRITO
  async addProduct(cartId: string, productId: string): Promise<Cart> {
    //Obtenemos el carrito y el producto por id
    const cart = await this.findOne(cartId);
    const product = await this.productsService.findOne(productId);

    console.log('cartService1', cart);
    console.log('cartService2', { product });

    //Si no existe el carrito, lanzamos una excepcion
    if (!cart) {
      throw new Error('Cart not found');
    }

    //Si no existe el producto, lanzamos una excepcion
    if (!product) {
      throw new Error('Product not found');
    }
    //Si existe el producto, lo agregamos al carrito
    else {
      cart.products.push({ product: product, quantity: 1 });
      await cart.save();
    }

    //Devolvemos el carrito con los productos
    return cart;
  }

  findAll() {
    return `This action returns all carts`;
  }

  //BUSCA UN CARRITO POR ID Y LO DEVUELVE
  findOne(id: string) {
    return this.cartModel.findById(id);
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
