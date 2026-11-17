import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, isObjectIdOrHexString } from 'mongoose';

import { Student, StudentDocument } from './schemas/student.schema.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  // Create a student
  async create(createStudentDto: CreateStudentDto) {
    try {
      return await this.studentModel.create(createStudentDto);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // Retrieve all students
  async findAll() {
    return this.studentModel.find().sort({ createdAt: -1 }).exec();
  }

  // Retrieve one student
  async findOne(id: string) {
    this.validateId(id);

    const student = await this.studentModel.findById(id).exec();

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} was not found`);
    }

    return student;
  }

  // Update a student
  async update(id: string, updateStudentDto: UpdateStudentDto) {
    this.validateId(id);

    try {
      const student = await this.studentModel
        .findByIdAndUpdate(id, updateStudentDto, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!student) {
        throw new NotFoundException(`Student with ID ${id} was not found`);
      }

      return student;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // Delete a student
  async remove(id: string) {
    this.validateId(id);

    const student = await this.studentModel.findByIdAndDelete(id).exec();

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} was not found`);
    }

    return {
      message: 'Student deleted successfully',
      deletedStudent: student,
    };
  }

  // Validate MongoDB ObjectId
  private validateId(id: string): void {
    if (!isObjectIdOrHexString(id)) {
      throw new BadRequestException('Invalid student ID');
    }
  }

  // Handle duplicate email errors
  private handleDatabaseError(error: unknown): never {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      throw new ConflictException('A student with this email already exists');
    }

    throw error;
  }
}
