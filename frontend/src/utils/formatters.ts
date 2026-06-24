import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM dd, yyyy');
}

export function formatDateTime(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM dd, yyyy • h:mm a');
}

export function formatRelativeTime(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-IN');
}

export function formatPercentage(num: number): string {
  return `${num.toFixed(1)}%`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    new: 'New Lead',
    contacted: 'Contacted',
    qualified: 'Qualified',
    proposal: 'Proposal Sent',
    converted: 'Converted',
    lost: 'Lost',
    negotiation: 'Negotiation',
    site_visit_scheduled: 'Site Visit Scheduled',
    follow_up_pending: 'Follow-Up Pending',
    booked: 'Booked',
  };
  return labels[status.toLowerCase()] || status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export function getSourceLabel(source: string): string {
  const labels: Record<string, string> = {
    website: 'Website',
    referral: 'Referral',
    social_media: 'Social Media',
    walk_in: 'Walk-in',
    cold_call: 'Cold Call',
    advertisement: 'Advertisement',
    email_campaign: 'Email Campaign',
    partner: 'Partner',
  };
  return labels[source] || source;
}

export function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    call: '📞',
    email: '✉️',
    meeting: '🤝',
    note: '📝',
    status_change: '🔄',
    site_visit: '🏠',
    proposal_sent: '📋',
    follow_up: '🔔',
  };
  return icons[type] || '📌';
}
