import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, BarChart3, FileText,
  Settings, LogOut, ChevronLeft, ChevronRight, Target,
  Zap, CalendarDays
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/leads', icon: Target, label: 'Lead Management' },
    { path: '/calendar', icon: CalendarDays, label: 'Follow-up Calendar' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    ...(user?.role === 'admin' || user?.role === 'sales_manager' ? [
      { path: '/users', icon: Users, label: 'User Management' },
    ] : []),
    { path: '/team', icon: Users, label: 'Team' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`sidebar ${collapsed ? 'collapsed' : ''} ${isOpen ? 'open' : ''}`}
        style={{
          width: collapsed ? 72 : 260,
          transform: isOpen ? 'translateX(0)' : undefined,
        }}
      >
        {/* Logo */}
        <div className="sidebar-logo" style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <div className="sidebar-logo-icon">
            <Zap size={20} />
          </div>
          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
                LeadIQ
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-brand-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                AI Platform
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
              onClick={() => {
                if (window.innerWidth < 1024) onToggle();
              }}
              style={{
                justifyContent: collapsed ? 'center' : 'flex-start',
                paddingLeft: collapsed ? 0 : 12,
              }}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={20} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div style={{
          padding: collapsed ? '16px 8px' : '16px 12px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          {/* Collapse toggle - desktop only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-link"
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              justifyContent: collapsed ? 'center' : 'flex-start',
              paddingLeft: collapsed ? 0 : 12,
              display: window.innerWidth >= 1024 ? 'flex' : 'none',
            }}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            {!collapsed && <span>Collapse</span>}
          </button>

          {/* User info */}
          {!collapsed && user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg-hover)',
            }}>
              <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', textTransform: 'capitalize' }}>
                  {user.role.replace('_', ' ')}
                </div>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            className="sidebar-link"
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-danger)',
              justifyContent: collapsed ? 'center' : 'flex-start',
              paddingLeft: collapsed ? 0 : 12,
            }}
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
