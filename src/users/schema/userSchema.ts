import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  //Timestamps le indica a mongoose que asigne los campos createdAt y updatedAt
  timestamps: true,
})
export class User {
  //Nombre del usuario
  @Prop({ required: true })
  name: string;

  //Email del usuario
  @Prop({ required: true })
  email: string;

  //Contraseña del usuario
  @Prop({ required: true })
  password: string;

  //Carrito del usuario
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true })
  cart: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
