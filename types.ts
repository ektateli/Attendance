
export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student'
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
}

export interface Class {
  id: number;
  name: string;
  teacher_id: number;
  teacher_name?: string;
  student_count?: number;
}

export interface AttendanceRecord {
  id: number;
  class_id: number;
  student_id: number;
  student_name?: string;
  date: string;
  status: 'present' | 'absent';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}
