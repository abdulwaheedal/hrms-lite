// File: frontend/src/pages/Employees.tsx
import { useState, useEffect } from "react";
import { employeeAPI } from "../services/api";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";
import type { Employee } from "../types";

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeAPI.getAll();
      if (data?.data) {
        const result = Array.isArray(data.data[0]) ? data.data[0] : data.data;
        setEmployees(result as Employee[]);
      }
    } catch (err) {
      setError("Failed to fetch employees.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async () => {
    await fetchEmployees();
  };

  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeAPI.delete(id);
        setEmployees(employees.filter((emp) => emp.employee_id !== id));
      } catch (err) {
        alert("Failed to delete employee");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        Employee Management
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form Section - Stacks on top */}
        <div className="xl:col-span-1">
          <EmployeeForm onAdd={handleAddEmployee} />
        </div>

        {/* List Section - Takes more space on desktop */}
        <div className="xl:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4 xl:hidden">
            Employee List
          </h2>
          <EmployeeList
            employees={employees}
            onDelete={handleDeleteEmployee}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Employees;
