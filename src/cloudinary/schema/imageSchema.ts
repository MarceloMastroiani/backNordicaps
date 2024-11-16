import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  //Timestamps le indica a mongoose que asigne los campos createdAt y updatedAt
  timestamps: true,
})
export class Image {
  //Imagen del producto
  @Prop({ require: true })
  image: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
