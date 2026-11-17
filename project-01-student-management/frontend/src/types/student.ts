export interface Student {
  _id: string;
  name: string;
  email: string;
  age: number;
  course: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFormData {
  name: string;
  email: string;
  age: number;
  course: string;
}
