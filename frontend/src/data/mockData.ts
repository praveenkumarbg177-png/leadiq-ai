// ═══════════════════════════════════════════════════════════════
// LeadIQ AI — Comprehensive Mock Data
// ═══════════════════════════════════════════════════════════════

import type {
  User, Lead, Activity, FollowUp, Notification,
  DashboardMetrics, RevenueDataPoint, AgentPerformance,
  LeadFunnelData, PricingTier, ChartDataPoint
} from '../types';

// ─── Team Members ─────────────────────────────────────────────
export const mockUsers: User[] = [
  { id: 'u1', name: 'Arjun Mehta', email: 'arjun@leadiq.ai', role: 'admin', phone: '+91 98765 43210', department: 'Management', joinedAt: '2024-01-15', isActive: true, lastActive: '2025-06-15T09:30:00', leadsAssigned: 0, leadsConverted: 0 },
  { id: 'u2', name: 'Priya Sharma', email: 'priya@leadiq.ai', role: 'sales_manager', phone: '+91 98765 43211', department: 'Sales', joinedAt: '2024-02-01', isActive: true, lastActive: '2025-06-15T08:45:00', leadsAssigned: 45, leadsConverted: 18 },
  { id: 'u3', name: 'Rahul Kapoor', email: 'rahul@leadiq.ai', role: 'sales_agent', phone: '+91 98765 43212', department: 'Sales', joinedAt: '2024-03-10', isActive: true, lastActive: '2025-06-15T09:15:00', leadsAssigned: 32, leadsConverted: 12 },
  { id: 'u4', name: 'Sneha Patel', email: 'sneha@leadiq.ai', role: 'sales_agent', phone: '+91 98765 43213', department: 'Sales', joinedAt: '2024-04-01', isActive: true, lastActive: '2025-06-15T07:50:00', leadsAssigned: 28, leadsConverted: 10 },
  { id: 'u5', name: 'Vikram Desai', email: 'vikram@leadiq.ai', role: 'sales_agent', phone: '+91 98765 43214', department: 'Sales', joinedAt: '2024-05-15', isActive: true, lastActive: '2025-06-14T18:20:00', leadsAssigned: 25, leadsConverted: 8 },
  { id: 'u6', name: 'Neha Reddy', email: 'neha@leadiq.ai', role: 'sales_agent', phone: '+91 98765 43215', department: 'Sales', joinedAt: '2024-06-01', isActive: true, lastActive: '2025-06-15T09:00:00', leadsAssigned: 22, leadsConverted: 9 },
  { id: 'u7', name: 'Amit Kumar', email: 'amit@leadiq.ai', role: 'sales_agent', phone: '+91 98765 43216', department: 'Sales', joinedAt: '2024-07-20', isActive: false, lastActive: '2025-06-10T14:30:00', leadsAssigned: 15, leadsConverted: 5 },
  { id: 'u8', name: 'Kavya Nair', email: 'kavya@leadiq.ai', role: 'sales_manager', phone: '+91 98765 43217', department: 'Sales', joinedAt: '2024-03-15', isActive: true, lastActive: '2025-06-15T08:00:00', leadsAssigned: 38, leadsConverted: 15 },
];

// ─── Mock Leads ─────────────────────────────────────────────
function makeActivities(leadId: string): Activity[] {
  return [
    { id: `a${leadId}-1`, leadId, userId: 'u3', userName: 'Rahul Kapoor', type: 'call', description: 'Initial discovery call - discussed requirements', createdAt: '2025-06-01T10:00:00' },
    { id: `a${leadId}-2`, leadId, userId: 'u3', userName: 'Rahul Kapoor', type: 'email', description: 'Sent property brochure and pricing details', createdAt: '2025-06-03T14:30:00' },
    { id: `a${leadId}-3`, leadId, userId: 'u3', userName: 'Rahul Kapoor', type: 'site_visit', description: 'Scheduled site visit for next week', createdAt: '2025-06-07T11:00:00' },
    { id: `a${leadId}-4`, leadId, userId: 'u2', userName: 'Priya Sharma', type: 'meeting', description: 'Virtual walkthrough of 3BHK units', createdAt: '2025-06-10T15:00:00' },
    { id: `a${leadId}-5`, leadId, userId: 'u3', userName: 'Rahul Kapoor', type: 'note', description: 'Client interested in east-facing units with garden view', createdAt: '2025-06-12T09:15:00' },
  ];
}

function makeFollowUps(leadId: string, leadName: string): FollowUp[] {
  return [
    { id: `f${leadId}-1`, leadId, leadName, userId: 'u3', userName: 'Rahul Kapoor', scheduledAt: '2025-06-16T10:00:00', type: 'Call', notes: 'Discuss pricing options', status: 'pending' },
    { id: `f${leadId}-2`, leadId, leadName, userId: 'u3', userName: 'Rahul Kapoor', scheduledAt: '2025-06-12T14:00:00', completedAt: '2025-06-12T14:30:00', type: 'Email', notes: 'Send updated floor plans', status: 'completed' },
    { id: `f${leadId}-3`, leadId, leadName, userId: 'u2', userName: 'Priya Sharma', scheduledAt: '2025-06-10T11:00:00', type: 'Meeting', notes: 'Site visit coordination', status: 'completed' },
  ];
}

export const mockLeads: Lead[] = [
  {
    id: 'l1', name: 'Rajesh Agarwal', email: 'rajesh.a@gmail.com', phone: '+91 99887 76655',
    company: 'Agarwal Enterprises', location: 'Mumbai, Maharashtra', budget: 4500000,
    source: 'website', status: 'qualified', score: 92, scoreCategory: 'hot',
    urgency: 9, siteVisitInterest: 10, questionsAsked: 14, followUpHistory: 7,
    propertyInterest: 'Premium 3BHK in Andheri West', propertyType: '3BHK Apartment',
    assignedTo: mockUsers[2], createdAt: '2025-05-20T10:00:00', updatedAt: '2025-06-14T16:00:00',
    lastContactedAt: '2025-06-14T16:00:00', notes: 'Very interested in premium projects. Wants possession within 6 months.',
    tags: ['premium', 'urgent', 'NRI'], activities: makeActivities('l1'), followUps: makeFollowUps('l1', 'Rajesh Agarwal'),
    aiSummary: 'Rajesh Agarwal is a high-value NRI prospect with exceptional buying intent. Budget of ₹45L and urgency 9/10 indicate ready-to-close status. Has completed 7 follow-ups and asked 14 detailed questions about specifications.',
    aiNextActions: ['Schedule immediate site visit', 'Prepare customized payment plan', 'Arrange meeting with project director'],
  },
  {
    id: 'l2', name: 'Meera Joshi', email: 'meera.j@outlook.com', phone: '+91 88776 55443',
    company: '', location: 'Pune, Maharashtra', budget: 3200000,
    source: 'referral', status: 'contacted', score: 78, scoreCategory: 'hot',
    urgency: 8, siteVisitInterest: 8, questionsAsked: 11, followUpHistory: 5,
    propertyInterest: '2BHK in Hinjewadi', propertyType: '2BHK Apartment',
    assignedTo: mockUsers[3], createdAt: '2025-05-25T14:00:00', updatedAt: '2025-06-13T11:00:00',
    lastContactedAt: '2025-06-13T11:00:00', notes: 'IT professional, looking for proximity to tech park.',
    tags: ['IT professional', 'first-time buyer'], activities: makeActivities('l2'), followUps: makeFollowUps('l2', 'Meera Joshi'),
    aiSummary: 'Meera is an IT professional seeking a 2BHK near Hinjewadi tech park. Strong engagement signals with 11 questions and consistent follow-ups.',
    aiNextActions: ['Share connectivity maps to tech parks', 'Offer virtual tour of available units', 'Send EMI calculator details'],
  },
  {
    id: 'l3', name: 'Sunil Verma', email: 'sunil.v@yahoo.com', phone: '+91 77665 44332',
    location: 'Bangalore, Karnataka', budget: 6800000,
    source: 'advertisement', status: 'proposal', score: 88, scoreCategory: 'hot',
    urgency: 9, siteVisitInterest: 9, questionsAsked: 16, followUpHistory: 8,
    propertyInterest: 'Villa in Whitefield', propertyType: 'Villa',
    assignedTo: mockUsers[4], createdAt: '2025-04-15T09:00:00', updatedAt: '2025-06-14T17:00:00',
    lastContactedAt: '2025-06-14T17:00:00', notes: 'Looking for a villa with private garden. Budget flexible up to 75L.',
    tags: ['high-budget', 'villa', 'flexible-budget'], activities: makeActivities('l3'), followUps: makeFollowUps('l3', 'Sunil Verma'),
    aiSummary: 'Sunil Verma is in advanced stages with a proposal already sent. High budget flexibility (up to ₹75L) for a villa in Whitefield. Closing probability: 85%.',
    aiNextActions: ['Send revised proposal with negotiated pricing', 'Schedule final site visit with family', 'Prepare sale agreement draft'],
  },
  {
    id: 'l4', name: 'Ananya Gupta', email: 'ananya.g@gmail.com', phone: '+91 66554 33221',
    location: 'Noida, Uttar Pradesh', budget: 2200000,
    source: 'social_media', status: 'new', score: 55, scoreCategory: 'warm',
    urgency: 5, siteVisitInterest: 6, questionsAsked: 7, followUpHistory: 2,
    propertyInterest: '2BHK in Sector 150', propertyType: '2BHK Apartment',
    assignedTo: mockUsers[5], createdAt: '2025-06-10T08:00:00', updatedAt: '2025-06-14T10:00:00',
    lastContactedAt: '2025-06-14T10:00:00', notes: 'Found us on Instagram. Interested in new launches.',
    tags: ['social-media', 'new-launch'], activities: makeActivities('l4'), followUps: makeFollowUps('l4', 'Ananya Gupta'),
    aiSummary: 'Ananya is a warm lead from social media with moderate engagement. Budget of ₹22L for a 2BHK in Noida Sector 150.',
    aiNextActions: ['Share new launch project details', 'Send virtual tour links', 'Schedule discovery call'],
  },
  {
    id: 'l5', name: 'Deepak Choudhury', email: 'deepak.c@gmail.com', phone: '+91 55443 22110',
    company: 'Choudhury & Sons', location: 'Hyderabad, Telangana', budget: 5500000,
    source: 'walk_in', status: 'qualified', score: 82, scoreCategory: 'hot',
    urgency: 8, siteVisitInterest: 9, questionsAsked: 12, followUpHistory: 6,
    propertyInterest: '4BHK Penthouse in Gachibowli', propertyType: '4BHK Penthouse',
    assignedTo: mockUsers[2], createdAt: '2025-05-05T11:00:00', updatedAt: '2025-06-13T15:00:00',
    lastContactedAt: '2025-06-13T15:00:00', notes: 'Business owner, looking for luxury segment.',
    tags: ['luxury', 'business-owner', 'walk-in'], activities: makeActivities('l5'), followUps: makeFollowUps('l5', 'Deepak Choudhury'),
    aiSummary: 'Deepak is a high-net-worth business owner seeking luxury penthouse. Walk-in lead with strong engagement metrics.',
    aiNextActions: ['Arrange exclusive property viewing', 'Send luxury amenities portfolio', 'Connect with relationship manager'],
  },
  {
    id: 'l6', name: 'Pooja Singh', email: 'pooja.s@hotmail.com', phone: '+91 44332 11009',
    location: 'Chennai, Tamil Nadu', budget: 1800000,
    source: 'email_campaign', status: 'contacted', score: 48, scoreCategory: 'warm',
    urgency: 4, siteVisitInterest: 5, questionsAsked: 5, followUpHistory: 3,
    propertyInterest: '2BHK in OMR', propertyType: '2BHK Apartment',
    assignedTo: mockUsers[3], createdAt: '2025-06-01T13:00:00', updatedAt: '2025-06-12T09:00:00',
    lastContactedAt: '2025-06-12T09:00:00', notes: 'Responded to email campaign. Comparing options.',
    tags: ['email-lead', 'comparison-phase'], activities: makeActivities('l6'), followUps: makeFollowUps('l6', 'Pooja Singh'),
    aiSummary: 'Pooja is in comparison phase. Budget ₹18L for OMR area. Needs nurturing with competitive analysis.',
    aiNextActions: ['Send area comparison sheet', 'Share customer testimonials', 'Follow up in 5 days'],
  },
  {
    id: 'l7', name: 'Karthik Rao', email: 'karthik.r@gmail.com', phone: '+91 33221 00998',
    location: 'Bangalore, Karnataka', budget: 3800000,
    source: 'referral', status: 'qualified', score: 71, scoreCategory: 'warm',
    urgency: 6, siteVisitInterest: 7, questionsAsked: 9, followUpHistory: 4,
    propertyInterest: '3BHK in Sarjapur Road', propertyType: '3BHK Apartment',
    assignedTo: mockUsers[4], createdAt: '2025-05-18T10:30:00', updatedAt: '2025-06-14T14:00:00',
    lastContactedAt: '2025-06-14T14:00:00', notes: 'Referred by existing client. Good engagement.',
    tags: ['referral', 'mid-budget'], activities: makeActivities('l7'), followUps: makeFollowUps('l7', 'Karthik Rao'),
    aiSummary: 'Referral lead with good engagement. Budget ₹38L for 3BHK on Sarjapur Road. Steadily progressing.',
    aiNextActions: ['Schedule weekend site visit', 'Share payment plan options', 'Offer referral discount'],
  },
  {
    id: 'l8', name: 'Fatima Khan', email: 'fatima.k@gmail.com', phone: '+91 22110 99887',
    location: 'Delhi, NCR', budget: 1200000,
    source: 'cold_call', status: 'new', score: 28, scoreCategory: 'cold',
    urgency: 2, siteVisitInterest: 3, questionsAsked: 2, followUpHistory: 1,
    propertyInterest: '1BHK in Dwarka', propertyType: '1BHK Apartment',
    assignedTo: mockUsers[5], createdAt: '2025-06-12T16:00:00', updatedAt: '2025-06-13T10:00:00',
    lastContactedAt: '2025-06-13T10:00:00', notes: 'Cold call lead. Minimal interest shown.',
    tags: ['cold-call', 'low-budget'], activities: makeActivities('l8'), followUps: makeFollowUps('l8', 'Fatima Khan'),
    aiSummary: 'Early-stage prospect from cold call. Low engagement metrics. Budget ₹12L for 1BHK in Dwarka.',
    aiNextActions: ['Add to drip email campaign', 'Re-engage in 3 weeks', 'Share market insights newsletter'],
  },
  {
    id: 'l9', name: 'Vivek Tiwari', email: 'vivek.t@corporate.com', phone: '+91 11009 88776',
    company: 'TechStar Solutions', location: 'Gurgaon, Haryana', budget: 7200000,
    source: 'partner', status: 'proposal', score: 90, scoreCategory: 'hot',
    urgency: 10, siteVisitInterest: 10, questionsAsked: 18, followUpHistory: 9,
    propertyInterest: 'Luxury 4BHK in Golf Course Road', propertyType: '4BHK Apartment',
    assignedTo: mockUsers[2], createdAt: '2025-04-20T09:00:00', updatedAt: '2025-06-15T08:00:00',
    lastContactedAt: '2025-06-15T08:00:00', notes: 'CXO level. Wants immediate possession. Ready to close.',
    tags: ['CXO', 'luxury', 'immediate-possession', 'partner-referral'], activities: makeActivities('l9'), followUps: makeFollowUps('l9', 'Vivek Tiwari'),
    aiSummary: 'CXO-level buyer with maximum urgency. Budget ₹72L for luxury 4BHK on Golf Course Road. 95% closing probability.',
    aiNextActions: ['Fast-track agreement preparation', 'Arrange chairman meeting', 'Send exclusive possession-ready inventory'],
  },
  {
    id: 'l10', name: 'Lakshmi Narayan', email: 'lakshmi.n@gmail.com', phone: '+91 00998 77665',
    location: 'Kochi, Kerala', budget: 2800000,
    source: 'website', status: 'contacted', score: 62, scoreCategory: 'warm',
    urgency: 6, siteVisitInterest: 6, questionsAsked: 8, followUpHistory: 3,
    propertyInterest: '3BHK Waterfront Apartment', propertyType: '3BHK Apartment',
    assignedTo: mockUsers[4], createdAt: '2025-05-28T12:00:00', updatedAt: '2025-06-14T11:00:00',
    lastContactedAt: '2025-06-14T11:00:00', notes: 'Interested in waterfront properties. NRI based in Dubai.',
    tags: ['NRI', 'waterfront', 'Dubai-based'], activities: makeActivities('l10'), followUps: makeFollowUps('l10', 'Lakshmi Narayan'),
    aiSummary: 'NRI prospect based in Dubai. Interested in waterfront 3BHK in Kochi. Good engagement via website.',
    aiNextActions: ['Schedule video call for virtual tour', 'Send NRI investment guide', 'Share RERA compliance docs'],
  },
  {
    id: 'l11', name: 'Sanjay Mishra', email: 'sanjay.m@yahoo.com', phone: '+91 99001 22334',
    location: 'Lucknow, UP', budget: 1500000,
    source: 'advertisement', status: 'new', score: 35, scoreCategory: 'cold',
    urgency: 3, siteVisitInterest: 4, questionsAsked: 3, followUpHistory: 1,
    propertyInterest: '2BHK in Gomti Nagar', propertyType: '2BHK Apartment',
    assignedTo: mockUsers[5], createdAt: '2025-06-08T15:00:00', updatedAt: '2025-06-12T09:30:00',
    lastContactedAt: '2025-06-12T09:30:00', notes: 'Responded to newspaper ad. Early research stage.',
    tags: ['print-ad', 'early-stage'], activities: makeActivities('l11'), followUps: makeFollowUps('l11', 'Sanjay Mishra'),
    aiSummary: 'Early-stage lead from newspaper ad. Low urgency but reasonable budget for Lucknow market.',
    aiNextActions: ['Send project brochure', 'Add to monthly newsletter', 'Follow up in 2 weeks'],
  },
  {
    id: 'l12', name: 'Divya Menon', email: 'divya.m@techcorp.com', phone: '+91 88112 33445',
    company: 'TechCorp', location: 'Bangalore, Karnataka', budget: 4100000,
    source: 'social_media', status: 'qualified', score: 76, scoreCategory: 'hot',
    urgency: 7, siteVisitInterest: 8, questionsAsked: 10, followUpHistory: 5,
    propertyInterest: '3BHK in Electronic City', propertyType: '3BHK Apartment',
    assignedTo: mockUsers[3], createdAt: '2025-05-15T10:00:00', updatedAt: '2025-06-14T13:00:00',
    lastContactedAt: '2025-06-14T13:00:00', notes: 'Senior software engineer. Interested in tech-enabled homes.',
    tags: ['tech-professional', 'smart-home'], activities: makeActivities('l12'), followUps: makeFollowUps('l12', 'Divya Menon'),
    aiSummary: 'Tech professional seeking smart-home enabled 3BHK. Strong budget and engagement. Ready for site visit.',
    aiNextActions: ['Highlight smart home features', 'Schedule weekend site visit', 'Share floor plans with tech specs'],
  },
  {
    id: 'l13', name: 'Ramesh Iyer', email: 'ramesh.i@gmail.com', phone: '+91 77223 44556',
    location: 'Mumbai, Maharashtra', budget: 8500000,
    source: 'referral', status: 'converted', score: 95, scoreCategory: 'hot',
    urgency: 10, siteVisitInterest: 10, questionsAsked: 20, followUpHistory: 12,
    propertyInterest: 'Sea-facing 4BHK in Worli', propertyType: '4BHK Apartment',
    assignedTo: mockUsers[2], createdAt: '2025-03-01T09:00:00', updatedAt: '2025-06-10T16:00:00',
    lastContactedAt: '2025-06-10T16:00:00', notes: 'Deal closed! ₹85L sea-facing unit in Worli.',
    tags: ['converted', 'luxury', 'sea-facing'], activities: makeActivities('l13'), followUps: makeFollowUps('l13', 'Ramesh Iyer'),
    aiSummary: 'Successfully converted! ₹85L deal for sea-facing 4BHK in Worli. Total cycle: 3 months.',
    aiNextActions: ['Send welcome kit', 'Schedule post-sale feedback call', 'Request referral'],
  },
  {
    id: 'l14', name: 'Priti Saxena', email: 'priti.s@gmail.com', phone: '+91 66334 55667',
    location: 'Jaipur, Rajasthan', budget: 1900000,
    source: 'walk_in', status: 'contacted', score: 52, scoreCategory: 'warm',
    urgency: 5, siteVisitInterest: 6, questionsAsked: 6, followUpHistory: 3,
    propertyInterest: '2BHK in Vaishali Nagar', propertyType: '2BHK Apartment',
    assignedTo: mockUsers[5], createdAt: '2025-06-03T11:30:00', updatedAt: '2025-06-13T14:00:00',
    lastContactedAt: '2025-06-13T14:00:00', notes: 'Walk-in visitor. Interested but comparing with 2 other projects.',
    tags: ['walk-in', 'comparing'], activities: makeActivities('l14'), followUps: makeFollowUps('l14', 'Priti Saxena'),
    aiSummary: 'Walk-in prospect comparing multiple projects. Moderate engagement. Needs differentiation strategy.',
    aiNextActions: ['Send competitive comparison chart', 'Offer limited-time pricing', 'Schedule second visit'],
  },
  {
    id: 'l15', name: 'Mohammad Ali', email: 'mohammad.a@gmail.com', phone: '+91 55445 66778',
    location: 'Ahmedabad, Gujarat', budget: 2500000,
    source: 'email_campaign', status: 'new', score: 22, scoreCategory: 'cold',
    urgency: 1, siteVisitInterest: 2, questionsAsked: 1, followUpHistory: 0,
    propertyInterest: 'Plot in SG Highway', propertyType: 'Plot',
    assignedTo: mockUsers[3], createdAt: '2025-06-14T08:00:00', updatedAt: '2025-06-14T08:00:00',
    lastContactedAt: undefined, notes: 'Opened email but no response to call.',
    tags: ['email-lead', 'unresponsive'], activities: [], followUps: [],
    aiSummary: 'Very early-stage lead. Opened marketing email but has not engaged further. Needs patience.',
    aiNextActions: ['Send follow-up email with plot layouts', 'Add to remarketing list', 'Try alternative contact channel'],
  },
  {
    id: 'l16', name: 'Nisha Kulkarni', email: 'nisha.k@infosys.com', phone: '+91 44556 77889',
    company: 'Infosys', location: 'Pune, Maharashtra', budget: 3500000,
    source: 'partner', status: 'qualified', score: 73, scoreCategory: 'warm',
    urgency: 7, siteVisitInterest: 7, questionsAsked: 9, followUpHistory: 4,
    propertyInterest: '3BHK in Baner', propertyType: '3BHK Apartment',
    assignedTo: mockUsers[4], createdAt: '2025-05-22T10:00:00', updatedAt: '2025-06-14T12:00:00',
    lastContactedAt: '2025-06-14T12:00:00', notes: 'Infosys employee, partner channel referral. Strong prospect.',
    tags: ['corporate', 'partner-referral'], activities: makeActivities('l16'), followUps: makeFollowUps('l16', 'Nisha Kulkarni'),
    aiSummary: 'Corporate employee via partner channel. Good engagement and steady progression. ₹35L budget for Baner.',
    aiNextActions: ['Offer corporate discount', 'Schedule site visit with spouse', 'Send loan pre-approval info'],
  },
];

// ─── Dashboard Metrics ──────────────────────────────────────
export const mockDashboardMetrics: DashboardMetrics = {
  totalLeads: 247,
  hotLeads: 48,
  warmLeads: 95,
  coldLeads: 104,
  conversionRate: 24.3,
  revenueForecast: 125000000,
  newLeadsThisMonth: 38,
  followUpsPending: 23,
  avgResponseTime: '2.4 hrs',
};

// ─── Revenue Data ───────────────────────────────────────────
export const mockRevenueData: RevenueDataPoint[] = [
  { month: 'Jan', revenue: 8500000, target: 10000000, deals: 4 },
  { month: 'Feb', revenue: 12000000, target: 10000000, deals: 6 },
  { month: 'Mar', revenue: 9800000, target: 12000000, deals: 5 },
  { month: 'Apr', revenue: 15500000, target: 12000000, deals: 8 },
  { month: 'May', revenue: 18200000, target: 15000000, deals: 9 },
  { month: 'Jun', revenue: 22000000, target: 15000000, deals: 11 },
  { month: 'Jul', revenue: 19500000, target: 18000000, deals: 10 },
  { month: 'Aug', revenue: 24000000, target: 18000000, deals: 12 },
  { month: 'Sep', revenue: 21000000, target: 20000000, deals: 10 },
  { month: 'Oct', revenue: 27500000, target: 20000000, deals: 14 },
  { month: 'Nov', revenue: 25000000, target: 22000000, deals: 13 },
  { month: 'Dec', revenue: 31000000, target: 25000000, deals: 16 },
];

// ─── Lead Source Data ───────────────────────────────────────
export const mockLeadSourceData: ChartDataPoint[] = [
  { name: 'Website', value: 35, color: '#6366f1' },
  { name: 'Referral', value: 25, color: '#8b5cf6' },
  { name: 'Social Media', value: 15, color: '#a78bfa' },
  { name: 'Walk-in', value: 10, color: '#c4b5fd' },
  { name: 'Advertisement', value: 8, color: '#10b981' },
  { name: 'Partner', value: 7, color: '#06b6d4' },
];

// ─── Lead Funnel Data ───────────────────────────────────────
export const mockFunnelData: LeadFunnelData[] = [
  { stage: 'New Leads', count: 247, percentage: 100, color: '#6366f1' },
  { stage: 'Contacted', count: 186, percentage: 75, color: '#8b5cf6' },
  { stage: 'Qualified', count: 124, percentage: 50, color: '#a78bfa' },
  { stage: 'Proposal', count: 68, percentage: 28, color: '#f59e0b' },
  { stage: 'Converted', count: 42, percentage: 17, color: '#10b981' },
];

// ─── Agent Performance ──────────────────────────────────────
export const mockAgentPerformance: AgentPerformance[] = [
  { name: 'Rahul Kapoor', leadsAssigned: 32, leadsConverted: 12, conversionRate: 37.5, revenue: 45000000, avgResponseTime: '1.8 hrs' },
  { name: 'Sneha Patel', leadsAssigned: 28, leadsConverted: 10, conversionRate: 35.7, revenue: 35000000, avgResponseTime: '2.1 hrs' },
  { name: 'Vikram Desai', leadsAssigned: 25, leadsConverted: 8, conversionRate: 32.0, revenue: 28000000, avgResponseTime: '2.5 hrs' },
  { name: 'Neha Reddy', leadsAssigned: 22, leadsConverted: 9, conversionRate: 40.9, revenue: 32000000, avgResponseTime: '1.5 hrs' },
  { name: 'Amit Kumar', leadsAssigned: 15, leadsConverted: 5, conversionRate: 33.3, revenue: 18000000, avgResponseTime: '3.2 hrs' },
];

// ─── Conversion Trend ───────────────────────────────────────
export const mockConversionTrend: ChartDataPoint[] = [
  { name: 'Jan', value: 18, leads: 42 },
  { name: 'Feb', value: 22, leads: 48 },
  { name: 'Mar', value: 19, leads: 45 },
  { name: 'Apr', value: 28, leads: 55 },
  { name: 'May', value: 25, leads: 52 },
  { name: 'Jun', value: 32, leads: 60 },
  { name: 'Jul', value: 29, leads: 58 },
  { name: 'Aug', value: 35, leads: 65 },
  { name: 'Sep', value: 31, leads: 62 },
  { name: 'Oct', value: 38, leads: 70 },
  { name: 'Nov', value: 34, leads: 67 },
  { name: 'Dec', value: 42, leads: 75 },
];

// ─── Notifications ──────────────────────────────────────────
export const mockNotifications: Notification[] = [
  { id: 'n1', userId: 'u3', title: 'Hot Lead Alert', message: 'Vivek Tiwari score jumped to 90. Immediate attention required!', type: 'alert', read: false, createdAt: '2025-06-15T08:00:00', actionUrl: '/leads/l9' },
  { id: 'n2', userId: 'u3', title: 'Follow-up Due', message: 'Follow-up with Rajesh Agarwal is scheduled for today at 10:00 AM', type: 'warning', read: false, createdAt: '2025-06-15T07:00:00', actionUrl: '/leads/l1' },
  { id: 'n3', userId: 'u3', title: 'Lead Converted! 🎉', message: 'Ramesh Iyer has been marked as converted. Deal value: ₹85L', type: 'success', read: true, createdAt: '2025-06-14T16:30:00', actionUrl: '/leads/l13' },
  { id: 'n4', userId: 'u3', title: 'New Lead Assigned', message: 'Mohammad Ali has been assigned to you by Priya Sharma', type: 'info', read: true, createdAt: '2025-06-14T08:15:00', actionUrl: '/leads/l15' },
  { id: 'n5', userId: 'u3', title: 'Missed Follow-up', message: 'You missed a follow-up with Fatima Khan yesterday', type: 'warning', read: false, createdAt: '2025-06-14T09:00:00', actionUrl: '/leads/l8' },
  { id: 'n6', userId: 'u3', title: 'Weekly Report Ready', message: 'Your weekly performance report for Jun 9-15 is now available', type: 'info', read: true, createdAt: '2025-06-14T06:00:00', actionUrl: '/reports' },
];

// ─── Monthly Lead Trend ─────────────────────────────────────
export const mockLeadTrend: ChartDataPoint[] = [
  { name: 'Jan', hot: 8, warm: 15, cold: 22 },
  { name: 'Feb', hot: 12, warm: 18, cold: 20 },
  { name: 'Mar', hot: 10, warm: 16, cold: 25 },
  { name: 'Apr', hot: 15, warm: 22, cold: 18 },
  { name: 'May', hot: 18, warm: 20, cold: 16 },
  { name: 'Jun', hot: 22, warm: 25, cold: 15 },
];

// ─── Pricing Tiers ──────────────────────────────────────────
export const mockPricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: 2999,
    period: '/month',
    description: 'Perfect for small real estate teams',
    features: [
      'Up to 500 leads',
      '3 team members',
      'Basic AI scoring',
      'Email notifications',
      'Standard reports',
      'Lead management',
      '5GB storage',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Professional',
    price: 7999,
    period: '/month',
    description: 'Ideal for growing real estate businesses',
    features: [
      'Up to 5,000 leads',
      '15 team members',
      'Advanced AI scoring',
      'Smart follow-up system',
      'Advanced analytics',
      'Custom reports & exports',
      'API access',
      'Priority support',
      '50GB storage',
    ],
    highlighted: true,
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    price: 19999,
    period: '/month',
    description: 'For large-scale real estate operations',
    features: [
      'Unlimited leads',
      'Unlimited team members',
      'Custom AI models',
      'White-label solution',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'On-premise deployment',
      'Unlimited storage',
      '24/7 premium support',
    ],
    cta: 'Contact Sales',
  },
];

// ─── All Follow-ups ─────────────────────────────────────────
export const mockAllFollowUps: FollowUp[] = [
  { id: 'fu1', leadId: 'l1', leadName: 'Rajesh Agarwal', userId: 'u3', userName: 'Rahul Kapoor', scheduledAt: '2025-06-16T10:00:00', type: 'Call', notes: 'Discuss final pricing', status: 'pending' },
  { id: 'fu2', leadId: 'l9', leadName: 'Vivek Tiwari', userId: 'u3', userName: 'Rahul Kapoor', scheduledAt: '2025-06-16T14:00:00', type: 'Meeting', notes: 'Final negotiation meeting', status: 'pending' },
  { id: 'fu3', leadId: 'l4', leadName: 'Ananya Gupta', userId: 'u5', userName: 'Neha Reddy', scheduledAt: '2025-06-16T11:30:00', type: 'Call', notes: 'Share new project details', status: 'pending' },
  { id: 'fu4', leadId: 'l7', leadName: 'Karthik Rao', userId: 'u4', userName: 'Vikram Desai', scheduledAt: '2025-06-17T09:00:00', type: 'Site Visit', notes: 'Weekend site visit', status: 'pending' },
  { id: 'fu5', leadId: 'l2', leadName: 'Meera Joshi', userId: 'u3', userName: 'Sneha Patel', scheduledAt: '2025-06-15T08:00:00', type: 'Email', notes: 'Send comparison sheet', status: 'completed', completedAt: '2025-06-15T08:30:00' },
  { id: 'fu6', leadId: 'l8', leadName: 'Fatima Khan', userId: 'u5', userName: 'Neha Reddy', scheduledAt: '2025-06-14T16:00:00', type: 'Call', notes: 'Re-engagement call', status: 'missed' },
];
