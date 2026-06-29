import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Bell, Shield, Palette } from 'lucide-react';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('Profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    photo: user?.avatar || '' // Added photo property
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        photo: prev.photo || user.avatar || ''
      }));
    }
  }, [user]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Create an image element to resize the base64 string
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 256;
          const MAX_HEIGHT = 256;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setProfileData(prev => ({ ...prev, photo: dataUrl }));
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (activeTab === 'Profile') {
      updateProfile({
        name: profileData.name,
        phone: profileData.phone,
        avatar: profileData.photo
      });
    }
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
                <div className="avatar avatar-xl" style={{ fontSize: 24, position: 'relative', overflow: 'hidden' }}>
                  {profileData.photo ? (
                    <img src={profileData.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    profileData.name.split(' ').map(n => n[0]).join('') || 'U'
                  )}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <label className="btn btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                    Upload New
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                  </label>
                  <button className="btn btn-ghost" style={{ color: 'var(--color-danger)' }} onClick={() => setProfileData(prev => ({ ...prev, photo: '' }))}>Remove</button>
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
