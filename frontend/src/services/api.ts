// File: frontend/src/services/api.ts
// Purpose: Centralized API service using Axios

import axios from "axios";
import type {
  Employee,
  EmployeeCreate,
  Attendance,
  AttendanceCreate,
  ApiResponse,
} from "../types";

// Use environment variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const employeeAPI = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Employee[]>>("/employees/");
    return response.data;
  },
  create: async (data: EmployeeCreate) => {
    const response = await api.post<ApiResponse<Employee>>("/employees/", data);
    return response.data;
  },
  delete: async (id: string) => {
    // We use the employee_id (e.g., EMP001), not the Mongo _id
    const response = await api.delete<ApiResponse<string>>(`/employees/${id}`);
    return response.data;
  },
};

export const attendanceAPI = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Attendance[]>>("/attendance/");
    return response.data;
  },
  getByEmployee: async (employeeId: string) => {
    const response = await api.get<ApiResponse<Attendance[]>>(
      `/attendance/employee/${employeeId}`,
    );
    return response.data;
  },
  mark: async (data: AttendanceCreate) => {
    const response = await api.post<ApiResponse<Attendance>>(
      "/attendance/",
      data,
    );
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<string>>(`/attendance/${id}`);
    return response.data;
  },
};

export default api;
