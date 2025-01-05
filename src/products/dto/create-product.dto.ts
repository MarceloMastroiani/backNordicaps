import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  MinLength,
  IsOptional,
} from 'class-validator';

// Capa de abtraccion adicional de datos para crear un producto, y utilizamos class-validator para validar los datos
export class CreateProductDto {
  //Validamos que el name no sea vacio
  @IsNotEmpty()
  //validamos que el name sea un string
  @IsString()
  //validamos que el name sea mayor a 3 caracteres
  @MinLength(3)
  name: string;

  //Validamos que el description puede ser opcional
  @IsOptional()
  @IsString()
  @MinLength(5)
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price: number;
}
