// File: frontend/src/pages/Attendance.tsx
import { useState, useEffect, useMemo } from "react";
import { attendanceAPI, employeeAPI } from "../services/api";
import AttendanceList from "../components/AttendanceList";
import type { Attendance, Employee } from "../types";

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-gray-200 h-16 w-full"></div>
      <div className="p-6 space-y-6">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
    <div className="space-y-4">
      <div className="h-10 bg-gray-200 rounded w-full md:w-1/3"></div>
      <div className="h-64 bg-white rounded shadow-sm"></div>
    </div>
  </div>
);

const AttendancePage = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [markDate, setMarkDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [batchStatus, setBatchStatus] = useState<{
    [key: string]: "Present" | "Absent";
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filters
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      const initialStatus: { [key: string]: "Present" | "Absent" } = {};
      employees.forEach((emp) => {
        initialStatus[emp.employee_id] = "Present";
      });
      setBatchStatus(initialStatus);
    }
  }, [employees]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [attendanceRes, employeesRes] = await Promise.all([
        attendanceAPI.getAll(),
        employeeAPI.getAll(),
      ]);

      if (attendanceRes?.data) {
        const result = Array.isArray(attendanceRes.data[0])
          ? attendanceRes.data[0]
          : attendanceRes.data;
        setAttendance(result as Attendance[]);
      }
      if (employeesRes?.data) {
        const result = Array.isArray(employeesRes.data[0])
          ? employeesRes.data[0]
          : employeesRes.data;
        setEmployees(result as Employee[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (employeeId: string) => {
    setBatchStatus((prev) => ({
      ...prev,
      [employeeId]: prev[employeeId] === "Present" ? "Absent" : "Present",
    }));
  };

  const handleBatchSubmit = async () => {
    setIsSubmitting(true);
    setSubmitMessage(null);
    try {
      const promises = employees.map((emp) => {
        return attendanceAPI
          .mark({
            employee_id: emp.employee_id,
            date: markDate,
            status: batchStatus[emp.employee_id],
          })
          .catch(() => null);
      });
      await Promise.all(promises);
      setSubmitMessage({
        type: "success",
        text: `Attendance for ${markDate} submitted successfully!`,
      });
      await fetchData();
    } catch (err) {
      setSubmitMessage({ type: "error", text: "An error occurred." });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this record?")) {
      try {
        setDeletingId(id);
        await attendanceAPI.delete(id);
        setAttendance((prev) => prev.filter((r) => r._id !== id));
      } catch (err) {
        alert("Failed to delete");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredAttendance = useMemo(() => {
    return attendance.filter((record) => {
      if (selectedEmployeeId && record.employee_id !== selectedEmployeeId)
        return false;
      if (startDate && record.date < startDate) return false;
      if (endDate && record.date > endDate) return false;
      return true;
    });
  }, [attendance, selectedEmployeeId, startDate, endDate]);

  const stats = useMemo(() => {
    if (!selectedEmployeeId && !startDate && !endDate) return null;
    const total = filteredAttendance.length;
    const present = filteredAttendance.filter(
      (r) => r.status === "Present",
    ).length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent: total - present, percentage };
  }, [filteredAttendance, selectedEmployeeId, startDate, endDate]);

  if (loading)
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <LoadingSkeleton />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        Attendance Management
      </h1>

      {/* Batch Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-lg font-medium text-white flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            Mark Daily Attendance
          </h2>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-6 w-full sm:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={markDate}
              onChange={(e) => setMarkDate(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-white"
            />
          </div>

          {employees.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No employees found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {employees.map((emp) => {
                const isPresent = batchStatus[emp.employee_id] === "Present";
                return (
                  <div
                    key={emp.employee_id}
                    onClick={() => toggleStatus(emp.employee_id)}
                    className={`cursor-pointer border rounded-lg p-4 flex items-center justify-between transition-all select-none ${isPresent ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} active:scale-95 touch-manipulation`}
                  >
                    <div className="overflow-hidden">
                      <p className="font-medium text-gray-900 line-clamp-2">
                        {emp.full_name}
                      </p>
                      <p className="text-xs text-gray-500">{emp.employee_id}</p>
                    </div>
                    <div
                      className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border transition-colors ${isPresent ? "bg-green-500 border-green-600" : "bg-white border-gray-300"}`}
                    >
                      {isPresent && (
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between border-t pt-4 gap-4">
            <div className="text-sm text-gray-500 hidden sm:block">
              Tap cards to toggle Present/Absent
            </div>
            <button
              onClick={handleBatchSubmit}
              disabled={isSubmitting || employees.length === 0}
              className={`w-full sm:w-auto inline-flex items-center justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white transition-all ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {isSubmitting ? "Processing..." : "Submit Attendance"}
            </button>
          </div>

          {submitMessage && (
            <div
              className={`mt-4 p-3 rounded-md text-sm ${submitMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
            >
              {submitMessage.text}
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex flex-col gap-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            History & Filters
          </h2>

          <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-white"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Employee
              </label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-white"
              >
                <option value="">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
              <p className="text-xs text-blue-600 uppercase font-bold">Total</p>
              <p className="text-xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100">
              <p className="text-xs text-green-600 uppercase font-bold">
                Present
              </p>
              <p className="text-xl font-bold text-green-700">
                {stats.present}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg text-center border border-red-100">
              <p className="text-xs text-red-600 uppercase font-bold">Absent</p>
              <p className="text-xl font-bold text-red-700">{stats.absent}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center border border-purple-100">
              <p className="text-xs text-purple-600 uppercase font-bold">
                Rate
              </p>
              <p className="text-xl font-bold text-purple-700">
                {stats.percentage}%
              </p>
            </div>
          </div>
        )}

        <AttendanceList
          attendance={filteredAttendance}
          isLoading={false}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      </div>
    </div>
  );
};

export default AttendancePage;
