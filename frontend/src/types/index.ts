// ═══════════════════════════════════════════════════════════════
// LeadIQ AI — TypeScript Type Definitions
// ═══════════════════════════════════════════════════════════════

export type UserRole = 'admin' | 'sales_manager' | 'sales_agent';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'converted' | 'lost';

export type LeadScoreCategory = 'hot' | 'warm' | 'cold';

export type LeadSource = 'website' | 'referral' | 'social_media' | 'walk_in' | 'cold_call' | 'advertisement' | 'email_campaign' | 'partner';

export type FollowUpStatus = 'pending' | 'completed' | 'missed';

export type NotificationType = 'info' | 'warning' | 'success' | 'alert';

export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'status_change' | 'site_visit' | 'proposal_sent' | 'follow_up';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  department?: string;
  joinedAt: string;
  isActive: boolean;
  lastActive: string;
  leadsAssigned: number;
  leadsConverted: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  location: string;
  budget: number;
  source: LeadSource;
  status: LeadStatus;
  score: number;
  scoreCategory: LeadScoreCategory;
  urgency: number; // 1-10
  siteVisitInterest: number; // 1-10
  questionsAsked: number;
  followUpHistory: number;
  propertyInterest: string;
  propertyType: string;
  assignedTo: User;
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
  notes?: string;
  tags: string[];
  activities: Activity[];
  followUps: FollowUp[];
  aiSummary?: string;
  aiNextActions?: string[];
}

export interface Activity {
  id: string;
  leadId: string;
  userId: string;
  userName: string;
  type: ActivityType;
  description: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface FollowUp {
  id: string;
  leadId: string;
  leadName: string;
  userId: string;
  userName: string;
  scheduledAt: string;
  completedAt?: string;
  type: string;
  notes?: string;
  status: FollowUpStatus;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface DashboardMetrics {
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  conversionRate: number;
  revenueForecast: number;
  newLeadsThisMonth: number;
  followUpsPending: number;
  avgResponseTime: string;
}

export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  target: number;
  deals: number;
}

export interface LeadFunnelData {
  stage: string;
  count: number;
  percentage: number;
  color: string;
}

export interface AgentPerformance {
  name: string;
  avatar?: string;
  leadsAssigned: number;
  leadsConverted: number;
  conversionRate: number;
  revenue: number;
  avgResponseTime: string;
}

export interface FilterState {
  status: LeadStatus | 'all';
  scoreCategory: LeadScoreCategory | 'all';
  agent: string;
  dateRange: { start: string; end: string } | null;
  budgetMin: number | null;
  budgetMax: number | null;
  location: string;
  source: LeadSource | 'all';
  search: string;
}

export interface PricingTier {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}
