import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Bell, Shield, Palette } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('Profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSave = () => {
    alert(`Settings saved successfully for ${activeTab}!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1000 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--color-text-primary)' }}>Settings</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>Manage your account preferences and application settings.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32, alignItems: 'start' }}>
        
        {/* Settings Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button className={`sidebar-link ${activeTab === 'Profile' ? 'active' : ''}`} onClick={() => setActiveTab('Profile')} style={{ border: 'none', width: '100%', textAlign: 'left', background: activeTab === 'Profile' ? 'var(--color-bg-card-solid)' : 'transparent', boxShadow: activeTab === 'Profile' ? 'var(--shadow-sm)' : 'none' }}>
            <User size={18} /> Profile
          </button>
          <button className={`sidebar-link ${activeTab === 'Notifications' ? 'active' : ''}`} onClick={() => setActiveTab('Notifications')} style={{ border: 'none', width: '100%', textAlign: 'left', background: activeTab === 'Notifications' ? 'var(--color-bg-card-solid)' : 'transparent', boxShadow: activeTab === 'Notifications' ? 'var(--shadow-sm)' : 'none' }}>
            <Bell size={18} /> Notifications
          </button>
          <button className={`sidebar-link ${activeTab === 'Appearance' ? 'active' : ''}`} onClick={() => setActiveTab('Appearance')} style={{ border: 'none', width: '100%', textAlign: 'left', background: activeTab === 'Appearance' ? 'var(--color-bg-card-solid)' : 'transparent', boxShadow: activeTab === 'Appearance' ? 'var(--shadow-sm)' : 'none' }}>
            <Palette size={18} /> Appearance
          </button>
          {user?.role === 'admin' && (
            <button className={`sidebar-link ${activeTab === 'Security' ? 'active' : ''}`} onClick={() => setActiveTab('Security')} style={{ border: 'none', width: '100%', textAlign: 'left', background: activeTab === 'Security' ? 'var(--color-bg-card-solid)' : 'transparent', boxShadow: activeTab === 'Security' ? 'var(--shadow-sm)' : 'none' }}>
              <Shield size={18} /> Security
            </button>
          )}
        </div>

        {/* Settings Content Area */}
        <div className="card">
          {activeTab === 'Profile' && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--color-border)' }}>Profile Information</h2>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
                <div className="avatar avatar-xl" style={{ fontSize: 24 }}>
                  {profileData.name.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-secondary">Upload New</button>
                  <button className="btn btn-ghost" style={{ color: 'var(--color-danger)' }}>Remove</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <label className="input-label">Full Name</label>
                  <input type="text" className="input-field" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} />
                </div>
                <div>
                  <label className="input-label">Email Address</label>
                  <input type="email" className="input-field" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} />
                </div>
                <div>
                  <label className="input-label">Phone Number</label>
                  <input type="text" className="input-field" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} placeholder="+91..." />
                </div>
                <div>
                  <label className="input-label">Role</label>
                  <input type="text" className="input-field" value={user?.role.replace('_', ' ').toUpperCase()} disabled style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-tertiary)' }} />
                </div>
              </div>
            </>
          )}

          {activeTab === 'Notifications' && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--color-border)' }}>Notification Preferences</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>Enable Notifications</h3>
                  <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Receive alerts for new leads and tasks.</p>
                </div>
                <button className={`btn ${notificationsEnabled ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
                  {notificationsEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </>
          )}

          {activeTab === 'Appearance' && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--color-border)' }}>Appearance Settings</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>Dark Mode</h3>
                  <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Toggle dark mode theme.</p>
                </div>
                <button className="btn btn-secondary" onClick={toggleTheme}>
                  {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                </button>
              </div>
            </>
          )}

          {activeTab === 'Security' && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--color-border)' }}>Security Settings</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>Change Password</h3>
                  <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Update your account password.</p>
                </div>
                <button className="btn btn-secondary" onClick={() => alert('Change password modal placeholder')}>
                  Change Password
                </button>
              </div>
            </>
          )}

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button className="btn btn-secondary">Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
