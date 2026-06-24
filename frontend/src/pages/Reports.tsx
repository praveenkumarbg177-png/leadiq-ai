import React, { useState } from 'react';
import { Download, FileText, Calendar, X, BarChart3, Users, TrendingUp, Clock } from 'lucide-react';
import { mockAgentPerformance, mockLeads } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const REPORT_TABS = ['Daily', 'Weekly', 'Monthly', 'Agent Performance'];

function downloadCSV(filename: string, rows: string[][]): void {
  const content = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = filename;
  document.body.appendChild(link); link.click();
  document.body.removeChild(link); URL.revokeObjectURL(url);
}

function exportLeadsPDF() {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.setTextColor(99, 102, 241);
  doc.text('Lohitha Dharma Projects Pvt. Ltd', 14, 18);
  doc.setFontSize(13);
  doc.setTextColor(60, 60, 60);
  doc.text('Lead Report', 14, 27);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, 14, 34);
  // Divider line
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.5);
  doc.line(14, 37, 196, 37);

  autoTable(doc, {
    startY: 38,
    head: [['Name', 'Phone', 'Location', 'Budget', 'Score', 'Category', 'Status']],
    body: mockLeads.map(l => [
      l.name,
      l.phone,
      l.location,
      `₹${(l.budget / 100000).toFixed(1)}L`,
      String(l.score),
      l.scoreCategory.toUpperCase(),
      l.status.toUpperCase(),
    ]),
    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 255] },
    styles: { fontSize: 9, cellPadding: 4 },
  });

  doc.save('leadiq_leads_report.pdf');
}

function exportAgentPDF() {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.setTextColor(99, 102, 241);
  doc.text('Lohitha Dharma Projects Pvt. Ltd', 14, 18);
  doc.setFontSize(13);
  doc.setTextColor(60, 60, 60);
  doc.text('Agent Performance Report', 14, 27);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 34);
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.5);
  doc.line(14, 37, 196, 37);

  autoTable(doc, {
    startY: 38,
    head: [['Agent', 'Assigned', 'Converted', 'Rate (%)', 'Revenue', 'Avg Response']],
    body: mockAgentPerformance.map((a, i) => [
      `${i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : i === 2 ? '🥉 ' : ''}${a.name}`,
      String(a.leadsAssigned),
      String(a.leadsConverted),
      `${a.conversionRate.toFixed(1)}%`,
      formatCurrency(a.revenue),
      a.avgResponseTime,
    ]),
    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 255] },
    styles: { fontSize: 10, cellPadding: 4 },
  });

  doc.save('leadiq_agent_performance.pdf');
}

export default function Reports() {
  const [activeTab, setActiveTab] = useState('Monthly');
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [newReportTitle, setNewReportTitle] = useState('');
  const [newReportDesc, setNewReportDesc] = useState('');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleCron, setScheduleCron] = useState('0 0 * * *');
  const [isScheduleEnabled, setIsScheduleEnabled] = useState(false);

  const [reports, setReports] = useState([
    { title: 'Monthly Sales Report', desc: 'Comprehensive overview of sales performance, revenue, and conversion rates.', date: 'Generated 2 days ago', type: 'monthly' },
    { title: 'Agent Performance Report', desc: 'Detailed breakdown of individual agent KPIs, response times, and closed deals.', date: 'Generated 5 days ago', type: 'agent' },
    { title: 'Lead Source ROI', desc: 'Analysis of lead acquisition channels and their respective return on investment.', date: 'Generated 1 week ago', type: 'monthly' },
    { title: 'Pipeline Forecast', desc: 'Predictive modeling of upcoming revenue based on current active proposals.', date: 'Generated 2 weeks ago', type: 'monthly' },
  ]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReportTitle) {
      setReports([{ title: newReportTitle, desc: newReportDesc || 'Custom generated report', date: 'Generated just now', type: 'monthly' }, ...reports]);
      setNewReportTitle(''); setNewReportDesc('');
      setIsGenerateModalOpen(false);
    }
  };

  const handleExportCSV = () => {
    downloadCSV('leadiq_leads_export.csv', [
      ['Lead ID', 'Name', 'Email', 'Phone', 'Location', 'Budget (₹)', 'Score', 'Category', 'Status', 'Source', 'Property Interest'],
      ...mockLeads.map(l => [l.id, l.name, l.email, l.phone, l.location, String(l.budget), String(l.score), l.scoreCategory, l.status, l.source, l.propertyInterest || '']),
    ]);
  };

  const handleExportAgentCSV = () => {
    downloadCSV('leadiq_agent_performance.csv', [
      ['Agent Name', 'Leads Assigned', 'Leads Converted', 'Conversion Rate (%)', 'Revenue (₹)', 'Avg Response Time'],
      ...mockAgentPerformance.map(a => [a.name, String(a.leadsAssigned), String(a.leadsConverted), `${a.conversionRate.toFixed(1)}%`, String(a.revenue), a.avgResponseTime]),
    ]);
  };

  const quickActions = [
    { label: 'Export All Leads (CSV)', icon: Download, color: '#10b981', bg: 'var(--color-success-bg)', action: handleExportCSV },
    { label: 'Export Leads (PDF)', icon: FileText, color: 'var(--color-brand-500)', bg: 'var(--color-brand-100)', action: exportLeadsPDF },
    { label: 'Agent Report (CSV)', icon: Users, color: '#0891b2', bg: 'rgba(8,145,178,0.1)', action: handleExportAgentCSV },
    { label: 'Agent Report (PDF)', icon: BarChart3, color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', action: exportAgentPDF },
  ];

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--color-text-primary)' }}>Reports Hub</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>Generate, download, and schedule automated reports.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => setIsScheduleModalOpen(true)}>
              <Calendar size={18} /> Schedule
            </button>
            <button className="btn btn-primary" onClick={() => setIsGenerateModalOpen(true)}>
              <FileText size={18} /> Generate New
            </button>
          </div>
        </div>

        {/* Quick Export Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {quickActions.map(action => (
            <button key={action.label} onClick={action.action}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: action.bg, borderRadius: 'var(--radius-lg)', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'transform 0.15s', }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <action.icon size={20} style={{ color: action.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: action.color }}>{action.label}</span>
              <Download size={16} style={{ color: action.color, marginLeft: 'auto', opacity: 0.7 }} />
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24 }}>
          <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Report Type Tabs */}
            <div style={{ display: 'flex', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', padding: 4, gap: 4 }}>
              {REPORT_TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ flex: 1, padding: '8px 12px', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    background: activeTab === tab ? 'var(--color-bg-card-solid)' : 'transparent',
                    color: activeTab === tab ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s',
                  }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Reports List */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Recent Reports</h2>
                <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{reports.length} reports</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {reports.map((report, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                      <div style={{ width: 44, height: 44, background: 'var(--color-brand-100)', color: 'var(--color-brand-600)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileText size={22} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{report.title}</h3>
                        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 4 }}>{report.desc}</p>
                        <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{report.date}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setPreviewIndex(i)}>View</button>
                      <button className="btn btn-primary btn-sm" onClick={exportLeadsPDF} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Download size={14} /> PDF
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Download size={14} /> CSV
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Agent Performance Summary */}
            <div className="card">
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Agent Performance</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {mockAgentPerformance.slice(0, 4).map((agent, i) => (
                  <div key={agent.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 14, width: 20 }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                    <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{agent.name.split(' ').map(n => n[0]).join('')}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{agent.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{agent.leadsConverted} converted • {agent.conversionRate.toFixed(1)}%</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-brand-500)' }}>{formatCurrency(agent.revenue)}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button className="btn btn-secondary" style={{ flex: 1, fontSize: 12 }} onClick={handleExportAgentCSV}>CSV</button>
                <button className="btn btn-primary" style={{ flex: 1, fontSize: 12 }} onClick={exportAgentPDF}>PDF</button>
              </div>
            </div>

            {/* Automated Scheduling */}
            <div className="card" style={{ background: 'var(--gradient-brand-subtle)', borderColor: 'var(--color-brand-200)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Clock size={20} style={{ color: 'var(--color-brand-500)' }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-brand-700)' }}>Automated Scheduling</h3>
              </div>
              <p style={{ fontSize: 14, color: 'var(--color-text-primary)', marginBottom: 16, lineHeight: 1.6 }}>
                Configure reports to be automatically generated and emailed to stakeholders on a schedule.
              </p>
              <button className="btn btn-secondary" style={{ width: '100%', background: 'var(--color-bg-card-solid)' }} onClick={() => setIsScheduleModalOpen(true)}>
                Configure Schedule
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewIndex !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 500 }}>
          <div style={{ background: 'var(--color-bg-card-solid)', padding: 32, borderRadius: 16, maxWidth: '80%', width: 600, position: 'relative', maxHeight: '80vh', overflowY: 'auto' }}>
            <button onClick={() => setPreviewIndex(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}><X size={20} /></button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, background: 'var(--color-brand-100)', color: 'var(--color-brand-600)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={24} /></div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700 }}>{reports[previewIndex].title}</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{reports[previewIndex].date}</p>
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24 }}>{reports[previewIndex].desc}</p>
            {/* Summary stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {[['Total Leads', mockLeads.length], ['Hot Leads', mockLeads.filter(l => l.scoreCategory === 'hot').length], ['Converted', mockLeads.filter(l => l.status === 'converted').length], ['Total Revenue', formatCurrency(mockLeads.filter(l => l.status === 'converted').reduce((sum, l) => sum + l.budget, 0))]].map(([label, value]) => (
                <div key={label as string} style={{ padding: 16, background: 'var(--color-bg-secondary)', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{value}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={exportLeadsPDF}><Download size={16} /> Download PDF</button>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleExportCSV}><Download size={16} /> Download CSV</button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Modal */}
      {isGenerateModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--color-bg-card-solid)', padding: 28, borderRadius: 16, width: 420, position: 'relative' }}>
            <button onClick={() => setIsGenerateModalOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}><X size={20} /></button>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Generate New Report</h3>
            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="input-label">Report Title</label>
                <input type="text" className="input-field" value={newReportTitle} onChange={e => setNewReportTitle(e.target.value)} required style={{ width: '100%' }} />
              </div>
              <div>
                <label className="input-label">Description (optional)</label>
                <textarea className="input-field" value={newReportDesc} onChange={e => setNewReportDesc(e.target.value)} style={{ width: '100%', minHeight: 80 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsGenerateModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Generate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--color-bg-card-solid)', padding: 28, borderRadius: 16, width: 420, position: 'relative' }}>
            <button onClick={() => setIsScheduleModalOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}><X size={20} /></button>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Automated Scheduling</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, background: 'var(--color-bg-secondary)', borderRadius: 10 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Enable Auto-Reports</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Auto-generate on schedule</div>
                </div>
                <button className={`btn ${isScheduleEnabled ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setIsScheduleEnabled(!isScheduleEnabled)} style={{ minWidth: 90 }}>
                  {isScheduleEnabled ? '✓ Enabled' : 'Disabled'}
                </button>
              </div>
              {isScheduleEnabled && (
                <>
                  <div>
                    <label className="input-label">Cron Expression</label>
                    <input type="text" className="input-field" value={scheduleCron} onChange={e => setScheduleCron(e.target.value)} style={{ width: '100%' }} />
                    <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 6 }}>
                      Examples: <code>0 9 * * *</code> (daily 9am) • <code>0 9 * * 1</code> (weekly Monday)
                    </p>
                  </div>
                  <div style={{ padding: 14, background: 'var(--color-bg-secondary)', borderRadius: 10 }}>
                    <label className="input-label">Email Recipients</label>
                    <input type="email" className="input-field" placeholder="manager@company.com" style={{ width: '100%' }} />
                  </div>
                </>
              )}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsScheduleModalOpen(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={() => { alert(`Schedule saved! Cron: ${scheduleCron}`); setIsScheduleModalOpen(false); }}>Save Schedule</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
