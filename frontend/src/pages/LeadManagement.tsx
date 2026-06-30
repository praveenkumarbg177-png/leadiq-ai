import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, MoreVertical, LayoutGrid, List, Flame, Thermometer, Snowflake, X, CheckCircle } from 'lucide-react';
import { formatCurrency, formatRelativeTime, getStatusLabel, getSourceLabel } from '../utils/formatters';
import FilterPanel from '../components/FilterPanel';
import type { Lead } from '../types';
import { api } from '../services/api';

const SOURCES = ['Website', 'Referral', 'Social Media', 'Walk-in', 'Cold Call', 'Advertisement', 'Email Campaign', 'Partner'];
const PROPERTY_TYPES = ['1BHK Apartment', '2BHK Apartment', '3BHK Apartment', '4BHK Apartment', 'Villa', 'Plot', 'Penthouse', 'Commercial'];
const TIMELINES = [
  { value: 'immediate', label: 'Immediately (< 1 month)' },
  { value: '1-3months', label: '1–3 Months' },
  { value: '3-6months', label: '3–6 Months' },
  { value: '6-12months', label: '6–12 Months' },
  { value: '1year+', label: 'More than 1 Year' },
];

export default function LeadManagement() {
  const navigate = useNavigate();
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [scoreFilter, setScoreFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterBudgetMin, setFilterBudgetMin] = useState('');
  const [filterBudgetMax, setFilterBudgetMax] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads');
      setLeads(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      lead.name.toLowerCase().includes(q) ||
      lead.company?.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.phone?.toLowerCase().includes(q);
    const matchesStatus = filterStatus.length === 0 || filterStatus.includes(lead.status);
    const matchesScore = scoreFilter === 'all' || lead.scoreCategory === scoreFilter;
    const matchesBudget = (
      (filterBudgetMin === '' || lead.budget >= parseFloat(filterBudgetMin)) &&
      (filterBudgetMax === '' || lead.budget <= parseFloat(filterBudgetMax))
    );
    const matchesSource = filterSource === '' || lead.source?.toLowerCase().includes(filterSource.toLowerCase());
    return matchesSearch && matchesStatus && matchesScore && matchesBudget && matchesSource;
  });

  const getScoreBadge = (score: number, category: string) => {
    let className = 'badge ';
    if (category === 'hot') className += 'badge-hot';
    else if (category === 'warm') className += 'badge-warm';
    else className += 'badge-cold';
    return <span className={className}>{score} • {category.toUpperCase()}</span>;
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      new: { bg: 'var(--color-brand-100)', color: 'var(--color-brand-600)' },
      contacted: { bg: 'rgba(6,182,212,0.15)', color: '#0891b2' },
      qualified: { bg: 'var(--color-success-bg)', color: 'var(--color-success)' },
      proposal: { bg: 'rgba(245,158,11,0.15)', color: '#d97706' },
      converted: { bg: 'var(--color-success)', color: 'white' },
      lost: { bg: 'var(--color-danger-bg)', color: 'var(--color-danger)' },
      'follow-up pending': { bg: 'rgba(139,92,246,0.15)', color: '#7c3aed' },
      'site visit scheduled': { bg: 'rgba(16,185,129,0.15)', color: '#059669' },
      negotiation: { bg: 'rgba(245,158,11,0.15)', color: '#b45309' },
      booked: { bg: 'var(--color-success)', color: 'white' },
    };
    const style = map[status] || { bg: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' };
    return <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: style.bg, color: style.color }}>{getStatusLabel(status)}</span>;
  };

  const handleAddLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Record<string, any> = Object.fromEntries(formData.entries());
    try {
      const res = await api.post('/leads', {
        ...data,
        budget: parseFloat(data.budget),
        urgency: data.buying_timeline === 'immediate' ? 1 : data.buying_timeline === '1-3months' ? 1 : 0,
        site_visit_interest: data.site_visit_interest === 'on' ? 1 : 0,
        questions_asked: parseInt(data.questions_asked || '0'),
      });
      setSuccessMsg(`✅ Lead created! Score: ${res.score}/100 — ${res.category?.toUpperCase()}`);
      setShowAddModal(false);
      form.reset();
      fetchLeads();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Failed to save lead: ${err?.message || 'Network error. Check if backend is reachable.'}`);
      setTimeout(() => setErrorMsg(''), 6000);
    } finally {
      setSubmitting(false);
    }
  };

  const scoreTabs = [
    { key: 'all', label: 'All', icon: null },
    { key: 'hot', label: '🔥 Hot', icon: Flame },
    { key: 'warm', label: '🌤️ Warm', icon: Thermometer },
    { key: 'cold', label: '❄️ Cold', icon: Snowflake },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      {/* Success Toast */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: 'fixed', top: 24, right: 24, zIndex: 999, background: 'var(--color-success)', color: 'white', padding: '12px 20px', borderRadius: 12, fontWeight: 600, fontSize: 14, boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <CheckCircle size={18} /> {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: '#ef4444', color: 'white', padding: '12px 20px', borderRadius: 12, fontWeight: 600, fontSize: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 8, maxWidth: 440 }}
          >
            <X size={18} /> {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--color-text-primary)' }}>Lead Management</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>Manage, track, and score your real estate leads. ({filteredLeads.length} leads)</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 300 }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--color-text-tertiary)' }} />
            <input type="text" placeholder="Search by name, phone, email..." className="input-field" style={{ paddingLeft: 40 }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <button className="btn btn-secondary" onClick={() => setShowFilter(!showFilter)}><Filter size={18} /> Filters</button>
          <div style={{ display: 'flex', background: 'var(--color-bg-secondary)', padding: 4, borderRadius: 'var(--radius-md)' }}>
            <button onClick={() => setView(view === 'table' ? 'kanban' : 'table')} style={{ padding: '6px 10px', borderRadius: 6, border: 'none', background: view === 'table' ? 'var(--color-bg-card-solid)' : 'transparent', color: view === 'table' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', cursor: 'pointer', boxShadow: view === 'table' ? 'var(--shadow-sm)' : 'none' }}><List size={18} /></button>
            <button onClick={() => setView(view === 'kanban' ? 'table' : 'kanban')} style={{ padding: '6px 10px', borderRadius: 6, border: 'none', background: view === 'kanban' ? 'var(--color-bg-card-solid)' : 'transparent', color: view === 'kanban' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', cursor: 'pointer', boxShadow: view === 'kanban' ? 'var(--shadow-sm)' : 'none' }}><LayoutGrid size={18} /></button>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><Plus size={18} /> Add Lead</button>
        </div>
      </div>

      {/* Score Category Filter Chips */}
      <div style={{ display: 'flex', gap: 8 }}>
        {scoreTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setScoreFilter(tab.key as any)}
            style={{
              padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: scoreFilter === tab.key ? 'var(--color-brand-500)' : 'var(--color-bg-secondary)',
              color: scoreFilter === tab.key ? 'white' : 'var(--color-text-secondary)',
              transition: 'all 0.2s',
            }}
          >
            {tab.label} {tab.key !== 'all' && `(${leads.filter(l => l.scoreCategory === tab.key).length})`}
          </button>
        ))}
      </div>

      {/* Filter Panel */}
      <FilterPanel isOpen={showFilter} onClose={() => setShowFilter(false)} title="Lead Filters">
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Status</label>
          <select multiple value={filterStatus} onChange={e => setFilterStatus(Array.from(e.target.selectedOptions, o => o.value))} className="input-field" style={{ width: '100%', height: 120 }}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Min Budget (₹)</label>
            <input type="number" value={filterBudgetMin} onChange={e => setFilterBudgetMin(e.target.value)} className="input-field" placeholder="0" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Max Budget (₹)</label>
            <input type="number" value={filterBudgetMax} onChange={e => setFilterBudgetMax(e.target.value)} className="input-field" placeholder="∞" />
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Source</label>
          <select value={filterSource} onChange={e => setFilterSource(e.target.value)} className="input-field" style={{ width: '100%' }}>
            <option value="">All Sources</option>
            {SOURCES.map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}
          </select>
        </div>
        <button className="btn btn-secondary" style={{ width: '100%', marginTop: 8 }} onClick={() => { setFilterStatus([]); setFilterBudgetMin(''); setFilterBudgetMax(''); setFilterSource(''); }}>Clear Filters</button>
      </FilterPanel>

      {/* Content Area */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {view === 'table' ? (
          <div style={{ overflow: 'auto', flex: 1 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Lead Name</th>
                  <th>Contact Info</th>
                  <th>Property</th>
                  <th>Status</th>
                  <th>AI Score</th>
                  <th>Budget</th>
                  <th>Assigned To</th>
                  <th>Last Active</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length === 0 && (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: 48, color: 'var(--color-text-tertiary)' }}>No leads found. Add your first lead!</td></tr>
                )}
                {filteredLeads.map((lead: Lead) => (
                  <tr key={lead.id} onClick={() => navigate(`/leads/${lead.id}`)} style={{ cursor: 'pointer' }} className="hover-bg">
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>{lead.name}</div>
                      {lead.company && <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{lead.company}</div>}
                    </td>
                    <td>
                      <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 2 }}>{lead.email}</div>
                      <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{lead.phone}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.propertyInterest || '—'}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{lead.propertyType || ''}</div>
                    </td>
                    <td>{getStatusBadge(lead.status)}</td>
                    <td>{getScoreBadge(lead.score, lead.scoreCategory)}</td>
                    <td style={{ fontWeight: 500 }}>{formatCurrency(lead.budget)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="avatar" style={{ width: 24, height: 24, fontSize: 10 }}>{lead.assignedTo.name.split(' ').map(n => n[0]).join('')}</div>
                        <span style={{ fontSize: 13 }}>{lead.assignedTo.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      {lead.lastContactedAt ? formatRelativeTime(lead.lastContactedAt) : 'Never'}
                    </td>
                    <td>
                      <button className="btn-ghost btn-icon" style={{ borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer' }}><MoreVertical size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 16, padding: 24, overflow: 'auto', flex: 1, alignItems: 'flex-start' }}>
            {['new', 'contacted', 'qualified', 'proposal', 'converted'].map(status => {
              const statusLeads = filteredLeads.filter(l => l.status === status);
              return (
                <div key={status} style={{ width: 300, flexShrink: 0, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>{getStatusLabel(status)}</h3>
                    <span style={{ background: 'var(--color-bg-tertiary)', padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{statusLeads.length}</span>
                  </div>
                  {statusLeads.map((lead: Lead) => (
                    <div key={lead.id} onClick={() => navigate(`/leads/${lead.id}`)} className="card-solid hover-bg" style={{ padding: 16, cursor: 'pointer', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        {getScoreBadge(lead.score, lead.scoreCategory)}
                        <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{formatRelativeTime(lead.createdAt)}</span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{lead.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 10 }}>{lead.propertyInterest || lead.location}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--color-border)' }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{formatCurrency(lead.budget)}</span>
                        <div className="avatar" style={{ width: 24, height: 24, fontSize: 10 }} title={lead.assignedTo.name}>{lead.assignedTo.name.split(' ').map(n => n[0]).join('')}</div>
                      </div>
                    </div>
                  ))}
                  {statusLeads.length === 0 && (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 13, border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>No leads</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}
            onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="card" style={{ width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
              onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-secondary)' }}><X size={20} /></button>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Add New Lead</h2>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24 }}>Fill in the customer details. Score is calculated automatically.</p>

              <form onSubmit={handleAddLead} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Section: Personal Info */}
                <div style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-brand-500)', marginBottom: -8 }}>Customer Information</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="input-label">Full Name *</label>
                    <input name="name" required className="input-field" placeholder="e.g. Rajesh Sharma" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label className="input-label">Mobile Number *</label>
                    <input name="phone" required className="input-field" placeholder="+91 98765 43210" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label className="input-label">Email Address *</label>
                    <input name="email" type="email" required className="input-field" placeholder="customer@email.com" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label className="input-label">Company (optional)</label>
                    <input name="company" className="input-field" placeholder="Company name" style={{ width: '100%' }} />
                  </div>
                </div>

                {/* Section: Property */}
                <div style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-brand-500)', marginBottom: -8, marginTop: 8 }}>Property Requirements</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="input-label">Property Interested In *</label>
                    <input name="property_interest" required className="input-field" placeholder="e.g. 3BHK in Andheri West" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label className="input-label">Property Type *</label>
                    <select name="property_type" required className="input-field" style={{ width: '100%' }}>
                      <option value="">Select Type</option>
                      {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Preferred Location *</label>
                    <input name="location" required className="input-field" placeholder="e.g. Mumbai, Maharashtra" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label className="input-label">Budget (₹) *</label>
                    <input name="budget" type="number" required className="input-field" placeholder="e.g. 3500000" style={{ width: '100%' }} />
                  </div>
                </div>

                {/* Section: Scoring Factors */}
                <div style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-brand-500)', marginBottom: -8, marginTop: 8 }}>Scoring Factors</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="input-label">Buying Timeline *</label>
                    <select name="buying_timeline" required className="input-field" style={{ width: '100%' }}>
                      <option value="">Select Timeline</option>
                      {TIMELINES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Lead Source *</label>
                    <select name="source" required className="input-field" style={{ width: '100%' }}>
                      <option value="">Select Source</option>
                      {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Questions Asked</label>
                    <input name="questions_asked" type="number" min="0" max="20" defaultValue="0" className="input-field" style={{ width: '100%' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 24 }}>
                    <input type="checkbox" name="site_visit_interest" id="site_visit" style={{ width: 18, height: 18 }} />
                    <label htmlFor="site_visit" style={{ fontWeight: 600, cursor: 'pointer' }}>Wants Site Visit</label>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="input-label">Additional Notes / Questions from Customer</label>
                  <textarea name="notes" className="input-field" placeholder="Any additional information or specific questions asked by the customer..." style={{ width: '100%', minHeight: 80, resize: 'vertical' }} />
                </div>

                {/* AI Score Preview */}
                <div style={{ background: 'var(--gradient-brand-subtle)', borderRadius: 'var(--radius-md)', padding: 16, border: '1px solid var(--color-brand-200)' }}>
                  <p style={{ fontSize: 13, color: 'var(--color-brand-700)', margin: 0 }}>
                    🤖 <strong>AI Scoring:</strong> Score will be calculated automatically based on budget, buying timeline, site visit interest, and engagement level.
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : '✨ Save & Score Lead'}
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
