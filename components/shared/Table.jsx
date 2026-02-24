import React from 'react';

export default function Table({ columns, data, actions, emptyMessage = 'No data available' }) {
  const tableData = Array.isArray(data) ? data : [];

  if (tableData.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 10h18" />
          <path d="M3 14h18" />
          <rect x="3" y="6" width="18" height="12" rx="2" />
        </svg>
        <h4 className="empty-state-title">No Records Found</h4>
        <div className="empty-state-text">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              {actions && (
                <td>
                  <div className="action-btns">{actions(row)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
