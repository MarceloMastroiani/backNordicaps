import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/productSchema';
import { CloudinaryProvider } from '../cloudinary.provider';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
  ],

  controllers: [ProductsController],
  providers: [ProductsService, CloudinaryProvider],
  exports: [ProductsService],
})
export class ProductsModule {}
