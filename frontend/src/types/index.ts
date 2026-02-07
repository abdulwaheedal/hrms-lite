// File: frontend/src/types/index.ts
// Purpose: Shared TypeScript interfaces

export interface Employee {
  _id: string;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
}

export interface EmployeeCreate {
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
}

export interface Attendance {
  _id: string;
  employee_id: string;
  date: string;
  status: "Present" | "Absent";
  employee_name?: string; // Optional field for display
}

export interface AttendanceCreate {
  employee_id: string;
  date: string;
  status: "Present" | "Absent";
}

export interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
}
