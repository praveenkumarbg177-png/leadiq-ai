import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, Target, Zap, Snowflake, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, Plus, CalendarDays, TrendingUp, AlertTriangle, PhoneCall } from 'lucide-react';
import { mockRevenueData, mockLeadSourceData, mockAgentPerformance, mockAllFollowUps } from '../data/mockData';
import { formatCurrency, formatNumber, formatPercentage, formatRelativeTime } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0,
    convertedLeads: 0,
    totalRevenue: 0,
    revenueForecast: 15000000,
    todayLeads: 0,
    monthlyLeads: 0,
    followUpsPending: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        if (res.metrics) {
          setMetrics(prev => ({ ...prev, ...res.metrics }));
        }
      } catch (e) {
        console.error('Failed to load dashboard metrics', e);
      }
    };
    fetchMetrics();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const kpis = [
    { label: 'Total Leads', value: formatNumber(metrics.totalLeads), change: '+12%', isPositive: true, icon: Users, color: 'var(--color-brand-500)', bg: 'rgba(99,102,241,0.1)' },
    { label: '🔥 Hot Leads', value: formatNumber(metrics.hotLeads), change: '+24%', isPositive: true, icon: Zap, color: 'var(--color-hot)', bg: 'var(--color-hot-bg)' },
    { label: '🌤️ Warm Leads', value: formatNumber(metrics.warmLeads), change: '-5%', isPositive: false, icon: Target, color: 'var(--color-warm)', bg: 'var(--color-warm-bg)' },
    { label: '❄️ Cold Leads', value: formatNumber(metrics.coldLeads), change: '+2%', isPositive: true, icon: Snowflake, color: 'var(--color-cold)', bg: 'var(--color-cold-bg)' },
  ];

  const extraKpis = [
    { label: "Today's Leads", value: formatNumber(metrics.todayLeads), icon: CalendarDays, color: '#0891b2', bg: 'rgba(8,145,178,0.1)' },
    { label: 'Monthly Leads', value: formatNumber(metrics.monthlyLeads), icon: TrendingUp, color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
    { label: 'Conversion Rate', value: `${metrics.conversionRate}%`, icon: ArrowUpRight, color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
    { label: 'Follow-ups Pending', value: formatNumber(metrics.followUpsPending), icon: Clock, color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--color-text-primary)' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>Welcome back! Here's what's happening today.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/leads')}>
          <Plus size={18} /> New Lead
        </button>
      </div>

      {/* Hot Lead Alert Banner */}
      {metrics.hotLeads > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
            padding: '14px 20px', borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(245,158,11,0.1))',
            border: '1px solid rgba(239,68,68,0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertTriangle size={20} style={{ color: 'var(--color-hot)' }} />
            <div>
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-hot)' }}>🔥 {metrics.hotLeads} Hot Lead{metrics.hotLeads !== 1 ? 's' : ''} Need Immediate Attention!</span>
              <span style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginLeft: 8 }}>These customers are ready to buy — contact them now.</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/leads')} style={{ background: 'var(--color-hot)', border: 'none' }}>
            <PhoneCall size={16} /> View Hot Leads
          </button>
        </motion.div>
      )}

      {/* Primary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}
            className="kpi-card"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: kpi.bg, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon size={24} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: kpi.isPositive ? 'var(--color-success-bg)' : 'var(--color-danger-bg)', color: kpi.isPositive ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {kpi.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {kpi.change}
              </div>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 14, fontWeight: 500 }}>{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Secondary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {extraKpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 + i * 0.08 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
              background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 10, background: kpi.bg, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <kpi.icon size={20} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>{kpi.value}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 500 }}>{kpi.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24 }}>

        {/* Revenue Forecast Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}
          className="card" style={{ gridColumn: 'span 8' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Revenue Forecast</h2>
              <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Actual vs Target Revenue</div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-brand-500)' }}>
              {formatCurrency(metrics.revenueForecast)}
            </div>
          </div>
          <div style={{ height: 280, width: '100%' }}>
            <ResponsiveContainer>
              <AreaChart data={mockRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-brand-500)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-brand-500)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }} tickFormatter={(val) => `₹${val / 1000000}M`} dx={-10} />
                <RechartsTooltip
                  contentStyle={{ background: 'var(--color-bg-card-solid)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-brand-500)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="target" stroke="var(--color-text-tertiary)" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Lead Sources Donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}
          className="card" style={{ gridColumn: 'span 4' }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Lead Sources</h2>
          <div style={{ height: 240, width: '100%' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={mockLeadSourceData} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {mockLeadSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color as string} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ background: 'var(--color-bg-card-solid)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }} />
                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Upcoming Follow-ups */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }}
          className="card" style={{ gridColumn: 'span 6' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Upcoming Follow-ups</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/calendar')}>View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mockAllFollowUps.slice(0, 5).map(fu => (
              <div key={fu.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${fu.status === 'completed' ? 'var(--color-success)' : fu.status === 'missed' ? 'var(--color-danger)' : 'var(--color-brand-500)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: fu.status === 'completed' ? 'var(--color-success-bg)' : fu.status === 'missed' ? 'var(--color-danger-bg)' : 'var(--color-brand-100)', color: fu.status === 'completed' ? 'var(--color-success)' : fu.status === 'missed' ? 'var(--color-danger)' : 'var(--color-brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {fu.status === 'completed' ? <CheckCircle size={16} /> : <Clock size={16} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{fu.leadName}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{fu.type} • {fu.notes}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-tertiary)' }}>
                  {formatRelativeTime(fu.scheduledAt)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Agents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.7 }}
          className="card" style={{ gridColumn: 'span 6' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>🏆 Top Agents</h2>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>By Conversion Rate</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mockAgentPerformance.slice(0, 5).map((agent, index) => (
              <div key={agent.name} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 28, fontSize: 16, fontWeight: 700, color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div className="avatar" style={{ width: 36, height: 36, fontSize: 13, flexShrink: 0 }}>
                  {agent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{agent.name}</span>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-brand-500)' }}>{agent.conversionRate.toFixed(1)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${agent.conversionRate}%` }} />
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 11, color: 'var(--color-text-tertiary)' }}>
                    <span>{agent.leadsConverted}/{agent.leadsAssigned} leads</span>
                    <span>• {formatCurrency(agent.revenue)}</span>
                    <span>• {agent.avgResponseTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
