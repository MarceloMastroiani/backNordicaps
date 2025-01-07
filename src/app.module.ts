import { Module } from '@nestjs/common';

import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthsModule } from './auths/auths.module';

@Module({
  imports: [
    //Se importa el modulo de configuracion para poder usar las variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //Se importa el modulo de mongoose para poder usar la base de datos con la variable de entorno
    MongooseModule.forRoot(process.env.MONGO_URL),
    ProductsModule,
    CartsModule,
    UsersModule,
    AuthsModule,
  ],

  //Controllers de APP
  controllers: [],
  providers: [],
})
export class AppModule {}
