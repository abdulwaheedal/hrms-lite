import { useState, useEffect } from "react";
import axios from "axios"; // For isAxiosError check
import { attendanceAPI } from "../services/api";
import type { Employee, AttendanceCreate } from "../types";

interface AttendanceFormProps {
  employees: Employee[];
  onMark: () => void;
}

const AttendanceForm = ({ employees, onMark }: AttendanceFormProps) => {
  // 1. Safe Local Date: en-CA locale always produces YYYY-MM-DD
  const getLocalDate = () => new Date().toLocaleDateString("en-CA");

  const [formData, setFormData] = useState<AttendanceCreate>({
    employee_id: "",
    date: getLocalDate(),
    status: "Present",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 4. Cleanup Success Message: Automatically hide after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.employee_id) return; // Prevent submission without ID

    setIsSubmitting(true);

    try {
      await attendanceAPI.mark(formData);
      setSuccess("Attendance marked successfully!");
      onMark();

      // 2. Functional State Update: Safely clear ID without losing other fields
      setFormData((prev) => ({ ...prev, employee_id: "" }));
    } catch (err: unknown) {
      // 5. Robust Error Handling: Use axios-specific type guard
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.detail ||
            "Failed to mark attendance. It might be a duplicate.",
        );
      } else {
        setError("An unexpected error occurred.");
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
        Mark Attendance
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Employee
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white"
            value={formData.employee_id}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, employee_id: e.target.value }))
            }
          >
            <option value="">-- Select --</option>
            {employees.map((emp) => (
              <option key={emp.employee_id} value={emp.employee_id}>
                {emp.full_name} ({emp.employee_id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            value={formData.date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <div className="mt-2 flex space-x-4">
            {(["Present", "Absent"] as const).map((status) => (
              <label key={status} className="inline-flex items-center">
                <input
                  type="radio"
                  className={`form-radio ${status === "Present" ? "text-blue-600" : "text-red-600"}`}
                  name="status"
                  value={status}
                  checked={formData.status === status}
                  onChange={() => setFormData((prev) => ({ ...prev, status }))}
                />
                <span className="ml-2">{status}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          // 3. Selection Feedback: Disable if no employee selected
          disabled={isSubmitting || !formData.employee_id}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Marking..." : "Mark Attendance"}
        </button>
      </div>
    </form>
  );
};

export default AttendanceForm;
