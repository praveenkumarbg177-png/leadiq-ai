import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, MapPin, Building, Briefcase, MessageSquare, Plus,
  Clock, ArrowLeft, ArrowRight, CheckCircle, Calendar as CalendarIcon,
  FileText, Upload, X, ChevronDown, AlertCircle, PhoneCall, Edit
} from 'lucide-react';
import { formatCurrency, formatDateTime, formatRelativeTime, getStatusLabel } from '../utils/formatters';
import { api } from '../services/api';

const STATUSES = [
  { value: 'new', label: 'New Lead', color: 'var(--color-brand-500)' },
  { value: 'contacted', label: 'Contacted', color: '#0891b2' },
  { value: 'qualified', label: 'Qualified', color: 'var(--color-success)' },
  { value: 'proposal', label: 'Proposal Sent', color: '#d97706' },
  { value: 'negotiation', label: 'Negotiation', color: '#9333ea' },
  { value: 'site_visit_scheduled', label: 'Site Visit Scheduled', color: '#059669' },
  { value: 'follow_up_pending', label: 'Follow-Up Pending', color: '#7c3aed' },
  { value: 'booked', label: 'Booked', color: 'var(--color-success)' },
  { value: 'converted', label: 'Converted ✓', color: 'var(--color-success)' },
  { value: 'lost', label: 'Lost', color: 'var(--color-danger)' },
];

const FOLLOWUP_TYPES = ['Call', 'Meeting', 'Site Visit', 'Email', 'WhatsApp', 'Video Call'];

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [fuType, setFuType] = useState('Call');
  const [fuNotes, setFuNotes] = useState('');
  const [fuDate, setFuDate] = useState('');
  const [fuTime, setFuTime] = useState('');
  const [savingFu, setSavingFu] = useState(false);
  const [toast, setToast] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatingLead, setUpdatingLead] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleUpdateLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdatingLead(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      await api.put(`/leads/${id}`, {
        ...data,
        budget: parseFloat(data.budget as string || '0')
      });
      showToast('✅ Lead details updated successfully');
      setShowEditModal(false);
      fetchLead();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingLead(false);
    }
  };

  const fetchLead = async () => {
    try {
      const res = await api.get(`/leads/${id}`);
      setLead(res);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (id) fetchLead(); }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true);
    setShowStatusDropdown(false);
    try {
      await api.put(`/leads/${id}`, { status: newStatus });
      setLead((prev: any) => ({ ...prev, status: newStatus }));
      showToast(`✅ Status updated to "${getStatusLabel(newStatus)}"`);
    } catch (e) { console.error(e); }
    finally { setUpdatingStatus(false); }
  };

  const handleMarkContacted = async () => {
    try {
      await api.post(`/leads/${id}/contact`, {});
      showToast('✅ Lead marked as contacted');
      fetchLead();
    } catch (e) { console.error(e); }
  };

  const handleScheduleFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingFu(true);
    try {
      const scheduledAt = fuDate && fuTime ? `${fuDate}T${fuTime}:00` : new Date().toISOString();
      await api.post(`/leads/${id}/followups`, { type: fuType, notes: fuNotes, status: 'pending', scheduled_at: scheduledAt });
      setShowFollowUpModal(false);
      setFuNotes(''); setFuDate(''); setFuTime('');
      showToast('✅ Follow-up scheduled successfully!');
      fetchLead();
    } catch (e) { console.error(e); }
    finally { setSavingFu(false); }
  };

  const handleLogActivity = async () => {
    const notes = window.prompt('Enter activity notes:');
    if (!notes) return;
    try {
      await api.post(`/leads/${id}/followups`, { type: 'NOTE', notes, status: 'completed' });
      showToast('✅ Activity logged');
      fetchLead();
    } catch (e) { console.error(e); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--color-brand-500)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: 'var(--color-text-secondary)' }}>Loading lead details...</p>
    </div>
  );

  if (!lead) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16 }}>
      <AlertCircle size={48} style={{ color: 'var(--color-danger)' }} />
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Lead not found</h2>
      <button className="btn btn-primary" onClick={() => navigate('/leads')}><ArrowLeft size={18} /> Back to Leads</button>
    </div>
  );

  const currentStatus = STATUSES.find(s => s.value === lead.status);
  const getScoreBadge = (score: number, category: string) => {
    let cls = 'badge ';
    if (category === 'hot') cls += 'badge-hot';
    else if (category === 'warm') cls += 'badge-warm';
    else cls += 'badge-cold';
    return <span className={cls}>{score} • {category.toUpperCase()}</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: 'var(--color-success)', color: 'white', padding: '12px 20px', borderRadius: 12, fontWeight: 600, fontSize: 14, boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={18} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back nav */}
      <button className="btn btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={() => navigate('/leads')}>
        <ArrowLeft size={16} /> Back to Leads
      </button>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--gradient-brand)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, flexShrink: 0 }}>
              {lead.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)' }}>{lead.name}</h1>
                {getScoreBadge(lead.score, lead.scoreCategory)}
                {/* Status Badge with Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    style={{ padding: '5px 12px', borderRadius: 20, border: '1px solid var(--color-border)', background: currentStatus ? currentStatus.color + '20' : 'var(--color-bg-secondary)', color: currentStatus?.color || 'var(--color-text-secondary)', fontWeight: 600, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    {updatingStatus ? '...' : (currentStatus?.label || getStatusLabel(lead.status))}
                    <ChevronDown size={14} />
                  </button>
                  <AnimatePresence>
                    {showStatusDropdown && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ position: 'absolute', top: '110%', left: 0, zIndex: 100, background: 'var(--color-bg-card-solid)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 8, minWidth: 200, boxShadow: 'var(--shadow-lg)' }}>
                        {STATUSES.map(s => (
                          <button key={s.value} onClick={() => handleStatusChange(s.value)}
                            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 12px', border: 'none', background: lead.status === s.value ? 'var(--color-bg-hover)' : 'transparent', cursor: 'pointer', borderRadius: 8, fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                            {s.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 20px', color: 'var(--color-text-secondary)', fontSize: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={15} /> {lead.email}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={15} /> {lead.phone}</span>
                {lead.company && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Briefcase size={15} /> {lead.company}</span>}
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={15} /> {lead.location}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={() => setShowEditModal(true)}>
              <Edit size={16} /> Edit Details
            </button>
            <a href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: 'inherit' }}>
              💬 WhatsApp
            </a>
            <button className="btn btn-secondary" onClick={handleMarkContacted}>
              <PhoneCall size={16} /> Mark Contacted
            </button>
            <button className="btn btn-secondary" onClick={handleLogActivity}>
              <MessageSquare size={16} /> Log Activity
            </button>
            <button className="btn btn-primary" onClick={() => setShowFollowUpModal(true)}>
              <CalendarIcon size={16} /> Schedule Follow-up
            </button>
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24, alignItems: 'start' }}>

        {/* Left Column */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* AI Insights */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card" style={{ background: 'var(--gradient-brand-subtle)', borderColor: 'var(--color-brand-200)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 22 }}>🤖</span>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-brand-700)' }}>AI Lead Analysis</h2>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-text-primary)', marginBottom: 20 }}>{lead.aiSummary}</p>
            <div style={{ background: 'var(--color-bg-card-solid)', borderRadius: 'var(--radius-md)', padding: 16 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Recommended Next Actions</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {lead.aiNextActions?.map((action: string, i: number) => (
                  <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14 }}>
                    <ArrowRight size={16} style={{ color: 'var(--color-brand-500)', marginTop: 2, flexShrink: 0 }} />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Follow-Ups */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Follow-Up History</h2>
              <button className="btn btn-primary btn-sm" onClick={() => setShowFollowUpModal(true)}><Plus size={16} /> Schedule</button>
            </div>
            {lead.followUps?.length === 0 && (
              <div style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-tertiary)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>No follow-ups yet. Schedule the first one!</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {lead.followUps?.map((fu: any) => {
                const isCompleted = fu.status === 'completed';
                const isMissed = fu.status === 'missed';
                const isPending = fu.status === 'pending';
                return (
                  <div key={fu.id} style={{ display: 'flex', gap: 14, padding: 14, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${isCompleted ? 'var(--color-success)' : isMissed ? 'var(--color-danger)' : 'var(--color-brand-500)'}` }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: isCompleted ? 'var(--color-success-bg)' : isMissed ? 'var(--color-danger-bg)' : 'var(--color-brand-100)', color: isCompleted ? 'var(--color-success)' : isMissed ? 'var(--color-danger)' : 'var(--color-brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isCompleted ? <CheckCircle size={18} /> : <Clock size={18} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{fu.type}</span>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: isCompleted ? 'var(--color-success-bg)' : isMissed ? 'var(--color-danger-bg)' : 'var(--color-brand-100)', color: isCompleted ? 'var(--color-success)' : isMissed ? 'var(--color-danger)' : 'var(--color-brand-600)', fontWeight: 600 }}>{fu.status.toUpperCase()}</span>
                      </div>
                      {fu.notes && <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 4 }}>{fu.notes}</p>}
                      <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', display: 'flex', gap: 12 }}>
                        {fu.scheduledAt && <span>📅 {formatDateTime(fu.scheduledAt)}</span>}
                        {fu.completedAt && <span>✅ Done: {formatDateTime(fu.completedAt)}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Activity Timeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Activity Timeline</h2>
            <div style={{ position: 'relative', paddingLeft: 24 }}>
              <div style={{ position: 'absolute', top: 12, bottom: 0, left: 11, width: 2, background: 'var(--color-border)' }} />
              {lead.activities?.length === 0 && <p style={{ color: 'var(--color-text-tertiary)', fontSize: 14 }}>No activities recorded yet.</p>}
              {lead.activities?.map((activity: any, i: number) => (
                <div key={activity.id} style={{ position: 'relative', marginBottom: i === lead.activities.length - 1 ? 0 : 28 }}>
                  <div style={{ position: 'absolute', left: -29, top: 4, width: 12, height: 12, borderRadius: '50%', background: 'var(--color-bg-card-solid)', border: '2px solid var(--color-brand-500)' }} />
                  <div style={{ background: 'var(--color-bg-secondary)', padding: 14, borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{activity.type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{formatRelativeTime(activity.createdAt)}</div>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{activity.description}</p>
                    <div style={{ marginTop: 6, fontSize: 12, color: 'var(--color-text-tertiary)' }}>by {activity.userName}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Property Requirements */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Building size={18} style={{ color: 'var(--color-brand-500)' }} /> Property Requirements
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Budget', value: formatCurrency(lead.budget) },
                { label: 'Looking For', value: lead.propertyType || '—' },
                { label: 'Property Interest', value: lead.propertyInterest || '—' },
                { label: 'Location', value: lead.location },
                { label: 'Source', value: lead.source?.replace(/_/g, ' ') || '—' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Lead Score Breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card">
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📊 Score Breakdown</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Urgency', value: lead.urgency, max: 10 },
                { label: 'Site Visit Interest', value: lead.siteVisitInterest, max: 10 },
                { label: 'Questions Asked', value: Math.min(lead.questionsAsked, 10), max: 10 },
                { label: 'Follow-ups', value: Math.min(lead.followUpHistory || 0, 10), max: 10 },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{item.label}</span>
                    <span style={{ fontWeight: 600 }}>{item.value}/{item.max}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${(item.value / item.max) * 100}%` }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 8, padding: 12, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: lead.scoreCategory === 'hot' ? 'var(--color-hot)' : lead.scoreCategory === 'warm' ? 'var(--color-warm)' : 'var(--color-cold)' }}>{lead.score}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Total Score / 100</div>
              </div>
            </div>
          </motion.div>

          {/* Tags & Metadata */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Tags</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {lead.tags?.length ? lead.tags.map((tag: string) => (
                <span key={tag} style={{ padding: '4px 10px', background: 'var(--color-bg-secondary)', borderRadius: 16, fontSize: 12, color: 'var(--color-text-secondary)' }}>#{tag}</span>
              )) : <span style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>No tags</span>}
            </div>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Created', value: formatDateTime(lead.createdAt) },
                { label: 'Last Contacted', value: lead.lastContactedAt ? formatRelativeTime(lead.lastContactedAt) : 'Never' },
                { label: 'Assigned To', value: lead.assignedTo?.name },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{item.label}</span>
                  <span style={{ fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>📎 Documents</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => alert('Document upload coming soon!')}>
                <Upload size={14} /> Upload
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Property Brochure.pdf', 'Payment Plan.xlsx'].map(doc => (
                <div key={doc} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--color-bg-secondary)', borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FileText size={16} style={{ color: 'var(--color-brand-500)' }} />
                    <span style={{ fontSize: 13 }}>{doc}</span>
                  </div>
                  <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, color: 'var(--color-brand-500)', fontWeight: 600 }}>View</button>
                </div>
              ))}
              <div style={{ padding: '12px', textAlign: 'center', border: '1px dashed var(--color-border)', borderRadius: 8, fontSize: 12, color: 'var(--color-text-tertiary)', cursor: 'pointer' }}>+ Add Document</div>
            </div>
          </motion.div>

          {/* Notes */}
          {lead.notes && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card">
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>📝 Notes</h2>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>{lead.notes}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Schedule Follow-Up Modal */}
      <AnimatePresence>
        {showFollowUpModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 16 }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="card" style={{ width: '100%', maxWidth: 460, position: 'relative' }}>
              <button onClick={() => setShowFollowUpModal(false)} style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={20} /></button>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Schedule Follow-Up</h2>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24 }}>for {lead.name}</p>
              <form onSubmit={handleScheduleFollowUp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="input-label">Follow-up Type</label>
                  <select value={fuType} onChange={e => setFuType(e.target.value)} className="input-field" style={{ width: '100%' }}>
                    {FOLLOWUP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="input-label">Date</label>
                    <input type="date" value={fuDate} onChange={e => setFuDate(e.target.value)} className="input-field" required style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label className="input-label">Time</label>
                    <input type="time" value={fuTime} onChange={e => setFuTime(e.target.value)} className="input-field" required style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <label className="input-label">Notes (optional)</label>
                  <textarea value={fuNotes} onChange={e => setFuNotes(e.target.value)} className="input-field" placeholder="What will you discuss?" style={{ width: '100%', minHeight: 80, resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowFollowUpModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={savingFu}>{savingFu ? 'Saving...' : 'Schedule Follow-Up'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Lead Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 16 }}
            onClick={() => setShowEditModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="card" style={{ width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
              onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowEditModal(false)} style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-secondary)' }}><X size={20} /></button>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Edit Lead Details</h2>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24 }}>Update information for {lead.name}</p>

              <form onSubmit={handleUpdateLead} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="input-label">Full Name *</label>
                    <input name="name" required className="input-field" defaultValue={lead.name} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label className="input-label">Mobile Number *</label>
                    <input name="phone" required className="input-field" defaultValue={lead.phone} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label className="input-label">Email Address *</label>
                    <input name="email" type="email" required className="input-field" defaultValue={lead.email} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label className="input-label">Company</label>
                    <input name="company" className="input-field" defaultValue={lead.company} style={{ width: '100%' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="input-label">Property Interested In</label>
                    <input name="property_interest" className="input-field" defaultValue={lead.propertyInterest} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label className="input-label">Property Type</label>
                    <select name="property_type" className="input-field" defaultValue={lead.propertyType || ''} style={{ width: '100%' }}>
                      <option value="">Select Type</option>
                      {['1BHK Apartment', '2BHK Apartment', '3BHK Apartment', '4BHK Apartment', 'Villa', 'Plot', 'Penthouse', 'Commercial'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Location</label>
                    <input name="location" className="input-field" defaultValue={lead.location} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label className="input-label">Budget (₹)</label>
                    <input name="budget" type="number" className="input-field" defaultValue={lead.budget} style={{ width: '100%' }} />
                  </div>
                </div>

                <div>
                  <label className="input-label">Lead Source</label>
                  <select name="source" className="input-field" defaultValue={lead.source} style={{ width: '100%' }}>
                    <option value="">Select Source</option>
                    {['Website', 'Referral', 'Social Media', 'Walk-in', 'Cold Call', 'Advertisement', 'Email Campaign', 'Partner'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={updatingLead}>
                    {updatingLead ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
