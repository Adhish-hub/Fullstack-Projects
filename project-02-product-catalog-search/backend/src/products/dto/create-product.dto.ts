import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description!: string;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(0)
  price!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  category!: string;

  @IsInt()
  @Min(0)
  stock!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sku!: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
