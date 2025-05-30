'use client';

import RequireAuth from '../components/RequireAuth';

export default function Dashboard() {
  return (
    <RequireAuth>
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem' }}>🎉 Welcome to your Dashboard</h1>
        <p style={{ marginTop: '1rem' }}>
          This is where your PersonaNest experience begins.
        </p>
      </div>
    </RequireAuth>
  );
}
