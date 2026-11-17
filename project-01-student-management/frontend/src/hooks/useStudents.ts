import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createStudent,
  deleteStudent,
  getStudent,
  getStudents,
  updateStudent,
} from "../services/studentService";

import type { StudentFormData } from "../types/student";

export const studentKeys = {
  all: ["students"] as const,
  lists: () => [...studentKeys.all, "list"] as const,
  details: () => [...studentKeys.all, "detail"] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
};

export function useStudents() {
  return useQuery({
    queryKey: studentKeys.lists(),
    queryFn: getStudents,
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: () => getStudent(id),
    enabled: Boolean(id),
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentKeys.lists(),
      });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<StudentFormData>;
    }) => updateStudent(id, data),

    onSuccess: (student) => {
      queryClient.invalidateQueries({
        queryKey: studentKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: studentKeys.detail(student._id),
      });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudent,

    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({
        queryKey: studentKeys.lists(),
      });

      queryClient.removeQueries({
        queryKey: studentKeys.detail(deletedId),
      });
    },
  });
}
