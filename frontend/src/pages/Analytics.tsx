import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, ComposedChart, Area, FunnelChart, Funnel, LabelList, Cell
} from 'recharts';
import { Download, Calendar, Filter, Medal, TrendingUp, Users, Target, Trophy } from 'lucide-react';
import { mockLeadTrend, mockConversionTrend, mockLeadSourceData, mockFunnelData, mockAgentPerformance } from '../data/mockData';
import FilterPanel from '../components/FilterPanel';
import { exportElementToPDF } from '../utils/pdfUtils';
import { formatCurrency, formatPercentage } from '../utils/formatters';

const FUNNEL_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#f59e0b', '#10b981'];

const MEDAL_COLORS = ['#f59e0b', '#94a3b8', '#b45309'];

export default function Analytics() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--color-text-primary)' }}>Analytics & Insights</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>Deep dive into your sales performance and lead metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={() => { setStartDate(''); setEndDate(''); }}>
            <Calendar size={18} /> Last 30 Days
          </button>
          <button className="btn btn-secondary" onClick={() => setShowFilter(!showFilter)}>
            <Filter size={18} /> Filters
          </button>
          <button className="btn btn-primary" onClick={() => exportElementToPDF('analytics-content', 'analytics.pdf')}>
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      <div id="analytics-content" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Row 1: Conversion Trend + Lead Quality */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24 }}>
          
          {/* Conversion Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="card" style={{ gridColumn: 'span 8' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Conversion Trend</h2>
                <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Total leads vs converted leads</div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--color-border)' }} />
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Total Leads</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--color-success)' }} />
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Converted</span>
                </div>
              </div>
            </div>
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer>
                <ComposedChart data={mockConversionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }} />
                  <RechartsTooltip contentStyle={{ background: 'var(--color-bg-card-solid)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }} />
                  <Bar dataKey="leads" fill="var(--color-bg-tertiary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Line type="monotone" dataKey="value" stroke="var(--color-success)" strokeWidth={3} dot={{ r: 4, fill: 'var(--color-success)', strokeWidth: 0 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Lead Quality */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="card" style={{ gridColumn: 'span 4' }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Lead Quality Trend</h2>
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer>
                <BarChart data={mockLeadTrend} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} width={36} />
                  <RechartsTooltip contentStyle={{ background: 'var(--color-bg-card-solid)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }} />
                  <Bar dataKey="hot" stackId="a" fill="var(--color-hot)" />
                  <Bar dataKey="warm" stackId="a" fill="var(--color-warm)" />
                  <Bar dataKey="cold" stackId="a" fill="var(--color-cold)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16 }}>
              {[['🔥', 'Hot', 'var(--color-hot)'], ['🌤️', 'Warm', 'var(--color-warm)'], ['❄️', 'Cold', 'var(--color-cold)']].map(([emoji, label, color]) => (
                <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: color as string }} />
                  <span style={{ fontSize: 12 }}>{emoji} {label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Row 2: Lead Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
          className="card"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Lead Conversion Funnel</h2>
              <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>How leads progress through your sales pipeline</div>
            </div>
            <div style={{ padding: '6px 14px', background: 'var(--color-success-bg)', borderRadius: 20, fontSize: 13, fontWeight: 600, color: 'var(--color-success)' }}>
              17% Overall Conversion
            </div>
          </div>
          <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
            {mockFunnelData.map((stage, i) => (
              <div key={stage.stage} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {/* Funnel Bar */}
                <div style={{
                  width: `${90 - i * 12}%`,
                  background: FUNNEL_COLORS[i],
                  borderRadius: i === 0 ? '8px 8px 0 0' : i === mockFunnelData.length - 1 ? '0 0 8px 8px' : 0,
                  transition: 'all 0.3s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '20px 0',
                  position: 'relative',
                }}>
                  <div style={{ textAlign: 'center', color: 'white' }}>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>{stage.count}</div>
                    <div style={{ fontSize: 11, opacity: 0.9 }}>{stage.percentage}%</div>
                  </div>
                </div>
                <div style={{ marginTop: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{stage.stage}</div>
                  {i < mockFunnelData.length - 1 && (
                    <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                      → {Math.round((mockFunnelData[i + 1].count / stage.count) * 100)}% advance
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Row 3: Agent Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
          className="card"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>🏆 Agent Performance Leaderboard</h2>
              <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Ranked by conversion rate this month</div>
            </div>
            <Trophy size={24} style={{ color: '#f59e0b' }} />
          </div>

          {/* Top 3 Podium */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
            {mockAgentPerformance.slice(0, 3).map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                style={{
                  textAlign: 'center', padding: 20,
                  background: i === 0 ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))' : 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  border: i === 0 ? '1px solid rgba(245,158,11,0.3)' : '1px solid var(--color-border)',
                  order: i === 0 ? 0 : i === 1 ? -1 : 1,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                </div>
                <div className="avatar" style={{ width: 48, height: 48, fontSize: 18, margin: '0 auto 12px' }}>
                  {agent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{agent.name}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: MEDAL_COLORS[i], margin: '8px 0 4px' }}>
                  {agent.conversionRate.toFixed(1)}%
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Conversion Rate</div>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 16, fontSize: 12 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700 }}>{agent.leadsConverted}</div>
                    <div style={{ color: 'var(--color-text-tertiary)' }}>Converted</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700 }}>{formatCurrency(agent.revenue)}</div>
                    <div style={{ color: 'var(--color-text-tertiary)' }}>Revenue</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Full Table */}
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Agent</th>
                <th>Leads Assigned</th>
                <th>Converted</th>
                <th>Conversion Rate</th>
                <th>Revenue Generated</th>
                <th>Avg Response Time</th>
              </tr>
            </thead>
            <tbody>
              {mockAgentPerformance.map((agent, i) => (
                <tr key={agent.name}>
                  <td>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span style={{ fontWeight: 600 }}>{agent.name}</span>
                    </div>
                  </td>
                  <td>{agent.leadsAssigned}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>{agent.leadsConverted}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="progress-bar" style={{ width: 80 }}>
                        <div className="progress-bar-fill" style={{ width: `${agent.conversionRate}%` }} />
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--color-brand-500)' }}>{agent.conversionRate.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(agent.revenue)}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{agent.avgResponseTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* Filter Panel */}
      <FilterPanel isOpen={showFilter} onClose={() => setShowFilter(false)} title="Analytics Filters">
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Start Date</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-field" style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>End Date</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input-field" style={{ width: '100%' }} />
        </div>
        <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => { setStartDate(''); setEndDate(''); setShowFilter(false); }}>Reset</button>
      </FilterPanel>
    </div>
  );
}
