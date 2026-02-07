// File: frontend/src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { employeeAPI, attendanceAPI } from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    employeeCount: 0,
    attendanceCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch both lists in parallel
        const [empRes, attRes] = await Promise.all([
          employeeAPI.getAll(),
          attendanceAPI.getAll(),
        ]);

        // Calculate counts carefully handling the data structure
        let empCount = 0;
        if (empRes && empRes.data) {
          const list = Array.isArray(empRes.data[0])
            ? empRes.data[0]
            : empRes.data;
          empCount = Array.isArray(list) ? list.length : 0;
        }

        let attCount = 0;
        if (attRes && attRes.data) {
          const list = Array.isArray(attRes.data[0])
            ? attRes.data[0]
            : attRes.data;
          attCount = Array.isArray(list) ? list.length : 0;
        }

        setStats({
          employeeCount: empCount,
          attendanceCount: attCount,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome to HRMS Lite. Here is what is happening today.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading statistics...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Employee Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    {/* Simple SVG User Icon */}
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Employees
                      </dt>
                      <dd className="text-3xl font-semibold text-gray-900">
                        {stats.employeeCount}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    to="/employees"
                    className="font-medium text-blue-700 hover:text-blue-900"
                  >
                    Manage Employees &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Attendance Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    {/* Simple SVG Calendar/Check Icon */}
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Attendance Records
                      </dt>
                      <dd className="text-3xl font-semibold text-gray-900">
                        {stats.attendanceCount}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    to="/attendance"
                    className="font-medium text-green-700 hover:text-green-900"
                  >
                    Mark Attendance &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            to="/employees"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
          >
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">
                Add New Employee
              </p>
              <p className="text-sm text-gray-500 truncate">
                Register a new staff member
              </p>
            </div>
          </Link>

          <Link
            to="/attendance"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
          >
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">
                Mark Today's Attendance
              </p>
              <p className="text-sm text-gray-500 truncate">
                Log presence for staff
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
