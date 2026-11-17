import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsEmail()
  @MaxLength(150)
  email!: string;

  @IsInt()
  @Min(1)
  @Max(120)
  age!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  course!: string;
}
