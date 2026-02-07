// File: frontend/src/components/EmployeeForm.tsx
import { useState } from "react";
import type { EmployeeCreate } from "../types";
import { employeeAPI } from "../services/api";
import type { AxiosError } from "axios";

interface EmployeeFormProps {
  onAdd: () => void; // Changed to simple void as we handle API logic here usually, or pass it up
}

const DEPARTMENTS = [
  "Engineering",
  "HR",
  "Sales",
  "Marketing",
  "Finance",
  "Operations",
];

const EmployeeForm = ({ onAdd }: EmployeeFormProps) => {
  const [formData, setFormData] = useState<EmployeeCreate>({
    employee_id: "",
    full_name: "",
    email: "",
    department: DEPARTMENTS[0], // Default to first department
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await employeeAPI.create(formData);
      setSuccess("Employee added successfully!");
      onAdd(); // Refresh the list
      // Reset form
      setFormData({
        employee_id: "",
        full_name: "",
        email: "",
        department: DEPARTMENTS[0],
      });
    } catch (err: unknown) {
      const error = err as AxiosError<{
        detail: string | Array<{ msg: string }>;
      }>;
      console.error(error);
      // Try to extract the specific error message from backend
      if (error.response && error.response.data && error.response.data.detail) {
        // If detail is an array (Pydantic validation error)
        if (Array.isArray(error.response.data.detail)) {
          setError(error.response.data.detail[0].msg);
        } else {
          setError(error.response.data.detail);
        }
      } else {
        setError("Failed to add employee. Check inputs.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-6 mb-6"
    >
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
        Add New Employee
      </h3>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Employee ID
          </label>
          <input
            type="text"
            required
            pattern="^[a-zA-Z0-9]+$"
            title="Alphanumeric only (e.g., EMP001)"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            value={formData.employee_id}
            onChange={(e) =>
              setFormData({ ...formData, employee_id: e.target.value })
            }
            placeholder="EMP001"
          />
          <p className="text-xs text-gray-500 mt-1">
            Letters and numbers only.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            required
            pattern="^[a-zA-Z\s]+$"
            title="Letters and spaces only"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white"
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {isSubmitting ? "Adding..." : "Add Employee"}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
