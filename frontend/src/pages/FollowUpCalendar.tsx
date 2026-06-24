import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, List, CalendarDays, Clock, CheckCircle, AlertCircle, Phone, Mail, Users, MapPin } from 'lucide-react';
import { mockAllFollowUps } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  'Call': <Phone size={14} />,
  'Email': <Mail size={14} />,
  'Meeting': <Users size={14} />,
  'Site Visit': <MapPin size={14} />,
  'WhatsApp': <span style={{ fontSize: 12 }}>💬</span>,
  'Video Call': <span style={{ fontSize: 12 }}>📹</span>,
};

function getStatusColor(status: string) {
  if (status === 'completed') return 'var(--color-success)';
  if (status === 'missed') return 'var(--color-danger)';
  return 'var(--color-brand-500)';
}

function getStatusBg(status: string) {
  if (status === 'completed') return 'var(--color-success-bg)';
  if (status === 'missed') return 'var(--color-danger-bg)';
  return 'var(--color-brand-100)';
}

export default function FollowUpCalendar() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // June 2025 to match mock data
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'missed'>('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarDays: { day: number; isCurrentMonth: boolean; date: Date }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({ day: prevMonthDays - i, isCurrentMonth: false, date: new Date(year, month - 1, prevMonthDays - i) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ day: d, isCurrentMonth: true, date: new Date(year, month, d) });
  }
  const remaining = 42 - calendarDays.length;
  for (let d = 1; d <= remaining; d++) {
    calendarDays.push({ day: d, isCurrentMonth: false, date: new Date(year, month + 1, d) });
  }

  const getFollowUpsForDate = (date: Date) => {
    return mockAllFollowUps.filter(fu => {
      const fuDate = new Date(fu.scheduledAt);
      return fuDate.getFullYear() === date.getFullYear() &&
        fuDate.getMonth() === date.getMonth() &&
        fuDate.getDate() === date.getDate();
    });
  };

  const filteredFollowUps = mockAllFollowUps.filter(fu => filterStatus === 'all' || fu.status === filterStatus);

  const selectedFollowUps = selectedDate ? getFollowUpsForDate(selectedDate) : [];

  const stats = {
    total: mockAllFollowUps.length,
    pending: mockAllFollowUps.filter(f => f.status === 'pending').length,
    completed: mockAllFollowUps.filter(f => f.status === 'completed').length,
    missed: mockAllFollowUps.filter(f => f.status === 'missed').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--color-text-primary)' }}>Follow-Up Calendar</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>Track and manage all scheduled follow-ups.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Status Filter */}
          <div style={{ display: 'flex', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', padding: 4, gap: 2 }}>
            {['all', 'pending', 'completed', 'missed'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s as any)}
                style={{ padding: '6px 12px', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  background: filterStatus === s ? 'var(--color-bg-card-solid)' : 'transparent',
                  color: filterStatus === s ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  textTransform: 'capitalize', transition: 'all 0.2s',
                }}>
                {s}
              </button>
            ))}
          </div>
          {/* View Toggle */}
          <div style={{ display: 'flex', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', padding: 4 }}>
            <button onClick={() => setViewMode('calendar')} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: viewMode === 'calendar' ? 'var(--color-bg-card-solid)' : 'transparent', cursor: 'pointer', boxShadow: viewMode === 'calendar' ? 'var(--shadow-sm)' : 'none', color: viewMode === 'calendar' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
              <CalendarDays size={18} />
            </button>
            <button onClick={() => setViewMode('list')} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: viewMode === 'list' ? 'var(--color-bg-card-solid)' : 'transparent', cursor: 'pointer', boxShadow: viewMode === 'list' ? 'var(--shadow-sm)' : 'none', color: viewMode === 'list' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {[
          { label: 'Total Follow-ups', value: stats.total, color: 'var(--color-brand-500)', bg: 'var(--color-brand-100)' },
          { label: 'Pending', value: stats.pending, color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
          { label: 'Completed', value: stats.completed, color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
          { label: 'Missed', value: stats.missed, color: 'var(--color-danger)', bg: 'var(--color-danger-bg)' },
        ].map(stat => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: '14px 18px', background: stat.bg, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: stat.color, lineHeight: 1.3 }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {viewMode === 'calendar' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24, alignItems: 'start' }}>
          {/* Calendar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ gridColumn: 'span 8' }}>
            {/* Month navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                style={{ padding: 8, border: '1px solid var(--color-border)', borderRadius: 8, background: 'transparent', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
                <ChevronLeft size={18} />
              </button>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{MONTHS[month]} {year}</h2>
              <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                style={{ padding: 8, border: '1px solid var(--color-border)', borderRadius: 8, background: 'transparent', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 8 }}>
              {DAYS.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--color-text-tertiary)', padding: '6px 0', textTransform: 'uppercase' }}>{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
              {calendarDays.map((cell, i) => {
                const fus = getFollowUpsForDate(cell.date);
                const isToday = cell.isCurrentMonth && cell.date.toDateString() === new Date().toDateString();
                const isSelected = selectedDate?.toDateString() === cell.date.toDateString();
                return (
                  <button key={i} onClick={() => setSelectedDate(cell.date)}
                    style={{
                      minHeight: 72, padding: '6px 4px', borderRadius: 8, border: isSelected ? '2px solid var(--color-brand-500)' : '1px solid transparent',
                      background: isSelected ? 'var(--color-brand-100)' : isToday ? 'var(--gradient-brand-subtle)' : 'var(--color-bg-secondary)',
                      cursor: 'pointer', textAlign: 'left', verticalAlign: 'top', transition: 'all 0.15s',
                      opacity: cell.isCurrentMonth ? 1 : 0.35,
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--color-bg-hover)'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isToday ? 'var(--gradient-brand-subtle)' : 'var(--color-bg-secondary)'; }}
                  >
                    <div style={{ fontSize: 13, fontWeight: isToday ? 800 : 500, color: isToday ? 'var(--color-brand-500)' : 'var(--color-text-primary)', marginBottom: 4 }}>
                      {cell.day}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {fus.slice(0, 2).map(fu => (
                        <div key={fu.id} style={{
                          fontSize: 10, fontWeight: 600, padding: '2px 5px', borderRadius: 4,
                          background: getStatusColor(fu.status), color: 'white',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {fu.type}: {fu.leadName.split(' ')[0]}
                        </div>
                      ))}
                      {fus.length > 2 && <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', paddingLeft: 4 }}>+{fus.length - 2} more</div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Selected day detail */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ gridColumn: 'span 4' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
              {selectedDate ? selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Select a date'}
            </h2>
            {!selectedDate && <p style={{ fontSize: 14, color: 'var(--color-text-tertiary)' }}>Click on a date in the calendar to view follow-ups.</p>}
            {selectedDate && selectedFollowUps.length === 0 && (
              <div style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-tertiary)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                No follow-ups scheduled for this day.
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selectedFollowUps.map(fu => (
                <div key={fu.id} style={{ padding: 14, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${getStatusColor(fu.status)}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 14 }}>
                      <span style={{ color: getStatusColor(fu.status) }}>{TYPE_ICONS[fu.type] || <Clock size={14} />}</span>
                      {fu.type}
                    </div>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: getStatusBg(fu.status), color: getStatusColor(fu.status), fontWeight: 600, textTransform: 'capitalize' }}>{fu.status}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>{fu.leadName}</div>
                  {fu.notes && <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{fu.notes}</div>}
                  <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 6 }}>
                    {new Date(fu.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        /* List View */
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 0 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>All Follow-ups ({filteredFollowUps.length})</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Type</th>
                  <th>Scheduled</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Agent</th>
                </tr>
              </thead>
              <tbody>
                {filteredFollowUps.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-tertiary)' }}>No follow-ups found.</td></tr>
                )}
                {filteredFollowUps.map(fu => (
                  <tr key={fu.id} style={{ cursor: 'pointer' }} className="hover-bg" onClick={() => navigate(`/leads/${fu.leadId}`)}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{fu.leadName}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: getStatusColor(fu.status) }}>
                        {TYPE_ICONS[fu.type] || <Clock size={14} />}
                        <span style={{ fontSize: 13 }}>{fu.type}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      {new Date(fu.scheduledAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      <br />
                      <span style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>
                        {new Date(fu.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--color-text-secondary)', maxWidth: 200 }}>{fu.notes || '—'}</td>
                    <td>
                      <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: getStatusBg(fu.status), color: getStatusColor(fu.status), textTransform: 'capitalize' }}>
                        {fu.status === 'completed' ? '✓ ' : fu.status === 'missed' ? '✗ ' : '⏳ '}{fu.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 13 }}>{fu.userName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
