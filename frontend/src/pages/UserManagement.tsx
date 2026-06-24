import React, { useState } from 'react';
import { UserPlus, MoreVertical, Shield, Mail, Calendar, X, Phone, Briefcase, Activity } from 'lucide-react';
import { mockUsers } from '../data/mockData';
import { formatDateTime } from '../utils/formatters';
import type { User } from '../types';
import { useNotifications } from '../context/NotificationContext';

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { addNotification } = useNotifications();

  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--color-text-primary)' }}>Team Management</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>Manage your team's access, roles, and performance.</p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <input 
            type="text" 
            placeholder="Search team members..." 
            className="input-field" 
            style={{ width: 250 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => setIsInviteModalOpen(true)}>
            <UserPlus size={18} /> Invite Member
          </button>
        </div>
      </div>

      <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role & Dept</th>
                <th>Performance</th>
                <th>Status</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} onClick={() => setSelectedUser(user)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{user.name}</div>
                        <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={12}/> {user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Shield size={14} style={{ color: user.role === 'admin' ? 'var(--color-hot)' : 'var(--color-brand-500)' }} />
                      <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{user.role.replace('_', ' ')}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{user.department}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>
                      <span style={{ fontWeight: 600 }}>{user.leadsConverted}</span> / {user.leadsAssigned} Leads Converted
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                      {user.leadsAssigned > 0 ? ((user.leadsConverted / user.leadsAssigned) * 100).toFixed(1) : 0}% Win Rate
                    </div>
                  </td>
                  <td>
                    {user.isActive ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-cold" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}>Inactive</span>
                    )}
                    <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 4 }}>
                      Last seen {formatDateTime(user.lastActive)}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      <Calendar size={14} /> {new Date(user.joinedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <button className="btn-ghost btn-icon" style={{ borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: 500, padding: 24, position: 'relative', backgroundColor: 'var(--color-bg-primary)', borderRadius: 12 }}>
            <button 
              onClick={() => setSelectedUser(null)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={24} style={{ color: 'var(--color-text-secondary)' }} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div className="avatar" style={{ width: 64, height: 64, fontSize: 24 }}>
                {selectedUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>{selectedUser.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <Shield size={16} style={{ color: selectedUser.role === 'admin' ? 'var(--color-hot)' : 'var(--color-brand-500)' }} />
                  <span style={{ fontSize: 14, fontWeight: 600, textTransform: 'capitalize', color: 'var(--color-text-primary)' }}>{selectedUser.role.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Mail size={18} style={{ color: 'var(--color-text-secondary)' }} />
                <span style={{ color: 'var(--color-text-primary)' }}>{selectedUser.email}</span>
              </div>
              {selectedUser.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Phone size={18} style={{ color: 'var(--color-text-secondary)' }} />
                  <span style={{ color: 'var(--color-text-primary)' }}>{selectedUser.phone}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Briefcase size={18} style={{ color: 'var(--color-text-secondary)' }} />
                <span style={{ color: 'var(--color-text-primary)' }}>{selectedUser.department}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Calendar size={18} style={{ color: 'var(--color-text-secondary)' }} />
                <span style={{ color: 'var(--color-text-primary)' }}>Joined {new Date(selectedUser.joinedAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Activity size={18} style={{ color: 'var(--color-text-secondary)' }} />
                <span style={{ color: 'var(--color-text-primary)' }}>Last active: {formatDateTime(selectedUser.lastActive)}</span>
              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: 'var(--color-text-primary)' }}>Performance</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ padding: 16, backgroundColor: 'var(--color-bg-secondary)', borderRadius: 8 }}>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Leads Assigned</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>{selectedUser.leadsAssigned}</div>
                </div>
                <div style={{ padding: 16, backgroundColor: 'var(--color-bg-secondary)', borderRadius: 8 }}>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Leads Converted</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>{selectedUser.leadsConverted}</div>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Win Rate</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-hot)' }}>
                  {selectedUser.leadsAssigned > 0 ? ((selectedUser.leadsConverted / selectedUser.leadsAssigned) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isInviteModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: 450, padding: 24, position: 'relative', backgroundColor: 'var(--color-bg-primary)', borderRadius: 12 }}>
            <button 
              onClick={() => setIsInviteModalOpen(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={24} style={{ color: 'var(--color-text-secondary)' }} />
            </button>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: 'var(--color-text-primary)' }}>Invite Team Member</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              addNotification({
                userId: 'u1',
                title: 'Invitation Sent',
                message: 'An invitation has been sent to the new team member.',
                type: 'success',
                read: false,
              });
              setIsInviteModalOpen(false);
            }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--color-text-primary)' }}>Email Address</label>
                <input type="email" required placeholder="member@leadiq.ai" className="input-field" style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--color-text-primary)' }}>Role</label>
                <select className="input-field" style={{ width: '100%', boxSizing: 'border-box' }}>
                  <option value="sales_agent">Sales Agent</option>
                  <option value="sales_manager">Sales Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--color-text-primary)' }}>Department</label>
                <select className="input-field" style={{ width: '100%', boxSizing: 'border-box' }}>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Management">Management</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setIsInviteModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
