import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{
        flex: 1,
        marginLeft: window.innerWidth >= 1024 ? 260 : 0,
        transition: 'margin-left var(--transition-base)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        <Topbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main style={{
          flex: 1,
          padding: '24px 28px',
          overflowY: 'auto',
          background: 'var(--color-bg-primary)',
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
