import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    required: true,
    trim: true,
  })
  description!: string;

  @Prop({
    required: true,
    min: 0,
  })
  price!: number;

  @Prop({
    required: true,
    trim: true,
  })
  category!: string;

  @Prop({
    required: true,
    min: 0,
    default: 0,
  })
  stock!: number;

  @Prop({
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  })
  sku!: string;

  @Prop({
    required: false,
    trim: true,
  })
  imageUrl?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
