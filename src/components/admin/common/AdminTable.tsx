import React from 'react';
import { Link } from 'react-router-dom';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
  baseEditUrl?: string;
}

function AdminTable<T>({
  data,
  columns,
  keyField,
  onEdit,
  onDelete,
  loading = false,
  baseEditUrl
}: AdminTableProps<T>) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
            {(onEdit || onDelete || baseEditUrl) && (
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={String(item[keyField])} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}>
                  {typeof column.accessor === 'function'
                    ? column.accessor(item)
                    : String(item[column.accessor] || '')}
                </td>
              ))}
              {(onEdit || onDelete || baseEditUrl) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {baseEditUrl && (
                    <Link
                      to={`${baseEditUrl}/${item[keyField]}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </Link>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable; 