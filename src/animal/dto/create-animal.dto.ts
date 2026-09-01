import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAnimalDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  especie: string;

  @IsString()
  @IsOptional()
  raza?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  edad: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  peso: number;
}
