import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, X } from 'lucide-react';

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState([
    { name: 'Alice Johnson', role: 'Agent', email: 'alice@leadiq.com' },
    { name: 'Bob Patel', role: 'Agent', email: 'bob@leadiq.com' },
    { name: 'Carol Smith', role: 'Manager', email: 'carol@leadiq.com' },
  ]);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Agent');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail) {
      setTeamMembers([...teamMembers, { name: inviteEmail.split('@')[0], role: inviteRole, email: inviteEmail }]);
      setInviteEmail('');
      setInviteRole('Agent');
      setIsInviteModalOpen(false);
    }
  };

  return (
    <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--color-text-primary)' }}>Team Management</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>Manage team members and roles.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsInviteModalOpen(true)}>
          <UserPlus size={18} /> Invite Member
        </button>
      </div>
      <table className="data-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {teamMembers.map((m, i) => (
            <tr key={i} className="hover-bg" style={{ cursor: 'pointer' }}>
              <td>{m.name}</td>
              <td>{m.role}</td>
              <td>{m.email}</td>
            </tr>
          ))}
        </tbody>


      </table>

      {isInviteModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: 'var(--color-bg-card-solid)', padding: 24, borderRadius: 8, width: 400,
            position: 'relative'
          }}>
            <button onClick={() => setIsInviteModalOpen(false)} style={{
              position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)'
            }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Invite Team Member</h3>
            <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="input-label" style={{ display: 'block', marginBottom: 8 }}>Email Address</label>
                <input 
                  type="email" 
                  className="input-field" 
                  value={inviteEmail} 
                  onChange={(e) => setInviteEmail(e.target.value)} 
                  required 
                  placeholder="colleague@leadiq.com"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label className="input-label" style={{ display: 'block', marginBottom: 8 }}>Role</label>
                <select 
                  className="input-field" 
                  value={inviteRole} 
                  onChange={(e) => setInviteRole(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="Agent">Agent</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsInviteModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
