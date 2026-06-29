import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { formatRelativeTime } from '../../utils/formatters';
import {
  Search, Bell, Sun, Moon, Menu, X, ChevronDown,
  Settings, LogOut, User
} from 'lucide-react';

interface TopbarProps {
  onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const notifColors: Record<string, string> = {
    alert: 'var(--color-hot)',
    warning: 'var(--color-warm)',
    success: 'var(--color-success)',
    info: 'var(--color-brand-500)',
  };

  return (
    <header className="topbar">
      {/* Left: Menu button + Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
        <button
          onClick={onMenuToggle}
          className="btn-ghost btn-icon"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)', background: 'transparent' }}
          id="menu-toggle"
        >
          <Menu size={20} />
        </button>

        <div style={{
          position: 'relative',
          maxWidth: 400,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
        }}>
          <Search size={16} style={{ position: 'absolute', left: 12, color: 'var(--color-text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search leads, contacts, or reports..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: 38, fontSize: 13, height: 38 }}
            id="global-search"
          />
          <kbd style={{
            position: 'absolute', right: 10, fontSize: 10, padding: '2px 6px',
            background: 'var(--color-bg-secondary)', borderRadius: 4, color: 'var(--color-text-tertiary)',
            border: '1px solid var(--color-border)', fontFamily: 'monospace',
          }}>⌘K</kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn-ghost btn-icon"
          style={{
            border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-full)',
            background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, color: 'var(--color-text-secondary)',
            transition: 'all var(--transition-base)',
          }}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          id="theme-toggle"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
            style={{
              position: 'relative', border: 'none', cursor: 'pointer',
              borderRadius: 'var(--radius-full)', background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, color: 'var(--color-text-secondary)',
              transition: 'all var(--transition-base)',
            }}
            id="notifications-btn"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 4, width: 16, height: 16,
                background: 'var(--color-hot)', borderRadius: '50%', fontSize: 10,
                fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center',
                justifyContent: 'center', border: '2px solid var(--color-bg-card-solid)',
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8,
              width: 380, maxHeight: 480, overflow: 'auto',
              background: 'var(--color-bg-card-solid)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)',
              animation: 'fadeInDown 0.2s ease-out', zIndex: 100,
            }}>
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid var(--color-border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>Notifications</h3>
                <button
                  onClick={markAllAsRead}
                  style={{
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    fontSize: 12, color: 'var(--color-brand-500)', fontWeight: 600,
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  Mark all read
                </button>
              </div>
              {notifications.slice(0, 8).map(n => (
                <div
                  key={n.id}
                  onClick={() => {
                    markAsRead(n.id);
                    if (n.actionUrl) navigate(n.actionUrl);
                    setShowNotifs(false);
                  }}
                  style={{
                    padding: '14px 20px', cursor: 'pointer',
                    borderBottom: '1px solid var(--color-border)',
                    background: n.read ? 'transparent' : 'var(--color-bg-hover)',
                    transition: 'background var(--transition-fast)',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                  }}
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', marginTop: 6, flexShrink: 0,
                    background: n.read ? 'var(--color-border)' : notifColors[n.type],
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 2 }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.4, marginBottom: 4 }}>
                      {n.message}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
                      {formatRelativeTime(n.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              border: 'none', background: 'transparent', padding: '4px 8px',
              borderRadius: 'var(--radius-md)', transition: 'background var(--transition-fast)',
            }}
            id="profile-btn"
          >
            <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, position: 'relative', overflow: 'hidden' }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user?.name.split(' ').map(n => n[0]).join('') || 'U'
              )}
            </div>
            <ChevronDown size={14} style={{ color: 'var(--color-text-tertiary)' }} />
          </button>

          {showProfile && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8,
              width: 220, background: 'var(--color-bg-card-solid)',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)', animation: 'fadeInDown 0.2s ease-out',
              overflow: 'hidden', zIndex: 100,
            }}>
              <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{user?.name}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', textTransform: 'capitalize' }}>
                  {user?.role.replace('_', ' ')}
                </div>
              </div>
              <div style={{ padding: '4px' }}>
                <button
                  onClick={() => { navigate('/settings'); setShowProfile(false); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', border: 'none', background: 'transparent',
                    cursor: 'pointer', borderRadius: 'var(--radius-sm)', fontSize: 13,
                    color: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <User size={16} /> Profile
                </button>
                <button
                  onClick={() => { navigate('/settings'); setShowProfile(false); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', border: 'none', background: 'transparent',
                    cursor: 'pointer', borderRadius: 'var(--radius-sm)', fontSize: 13,
                    color: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <Settings size={16} /> Settings
                </button>
                <button
                  onClick={() => { logout(); setShowProfile(false); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', border: 'none', background: 'transparent',
                    cursor: 'pointer', borderRadius: 'var(--radius-sm)', fontSize: 13,
                    color: 'var(--color-danger)', fontFamily: 'var(--font-sans)',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-danger-bg)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
