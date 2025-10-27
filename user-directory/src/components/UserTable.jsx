import React from 'react'

export default function UserTable({ users = [] }) {
  return (
    <div className="table-wrap">
      <table className="user-table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>No users</td>
            </tr>
          ) : (
            users.map(u => (
              <tr key={u.id}>
                <td className="avatar-cell"><img src={u.avatar} alt={`${u.first_name} avatar`} /></td>
                <td>{u.first_name}</td>
                <td>{u.last_name}</td>
                <td><a href={`mailto:${u.email}`}>{u.email}</a></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
