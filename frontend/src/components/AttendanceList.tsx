// File: frontend/src/components/AttendanceList.tsx
import type { Attendance } from "../types";

interface AttendanceListProps {
  attendance: Attendance[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  deletingId?: string | null;
}

const AttendanceList = ({
  attendance,
  isLoading,
  onDelete,
  deletingId,
}: AttendanceListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading attendance records...
      </div>
    );
  }

  if (attendance.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center border border-gray-100">
        <p className="text-gray-500 text-lg">No attendance records found.</p>
        <p className="text-sm text-gray-400 mt-1">
          Try adjusting filters or mark new attendance.
        </p>
      </div>
    );
  }

  const sortedAttendance = [...attendance].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                Employee Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAttendance.map((record) => (
              <tr
                key={record._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {record.employee_name || "Unknown Employee"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.status === "Present"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onDelete(record._id)}
                    disabled={deletingId === record._id}
                    className={`
                                            font-semibold text-red-600 hover:text-red-900 px-3 py-1 rounded
                                            ${deletingId === record._id ? "opacity-50 cursor-not-allowed" : "hover:bg-red-50"}
                                        `}
                  >
                    {deletingId === record._id ? (
                      <span className="flex items-center justify-end">
                        <svg
                          className="animate-spin h-4 w-4 mr-1"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;
