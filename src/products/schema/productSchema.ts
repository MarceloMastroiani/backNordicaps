import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  //Timestamps le indica a mongoose que asigne los campos createdAt y updatedAt
  timestamps: true,
})
export class Product {
  //Nombre del producto
  @Prop({ require: true })
  name: string;

  @Prop()
  //Descripcion del producto
  description: string;

  //Precio del producto
  @Prop({ require: true })
  price: number;

  //imagen del producto
  @Prop({ required: true })
  fileUrl: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
