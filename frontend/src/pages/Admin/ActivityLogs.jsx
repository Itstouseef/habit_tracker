import React from 'react';

const ActivityLogs = () => {
  // Mock data for now
  const logs = [
    { id: 1, user: 'admin@test.com', action: 'Login', date: '2026-01-02 14:10' },
    { id: 2, user: 'admin@test.com', action: 'Viewed Admin Users', date: '2026-01-02 14:15' },
  ];

  return (
    <div className="admin-page">
      <h2>Activity Logs</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Action</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.user}</td>
              <td><strong>{log.action}</strong></td>
              <td>{log.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityLogs;