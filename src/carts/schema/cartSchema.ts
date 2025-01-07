import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Product } from 'src/products/schema/productSchema';

@Schema({
  // Timestamps le indica a mongoose que asigne los campos createdAt y updatedAt
  timestamps: true,
})
export class Cart {
  // Lista de productos en el carrito
  @Prop({
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // ID del producto
        quantity: { type: Number, required: true, default: 1 }, // Cantidad del producto
      },
    ],
    default: [],
  })
  products: Array<{ product: Product; quantity: number }>;

  //precio total del carrito
  @Prop({ default: 0 })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
