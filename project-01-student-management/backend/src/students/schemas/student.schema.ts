import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StudentDocument = HydratedDocument<Student>;

@Schema({ timestamps: true })
export class Student {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email!: string;

  @Prop({
    required: true,
    min: 1,
    max: 120,
  })
  age!: number;

  @Prop({
    required: true,
    trim: true,
  })
  course!: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
