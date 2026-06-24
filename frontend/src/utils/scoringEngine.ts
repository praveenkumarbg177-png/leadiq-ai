// ═══════════════════════════════════════════════════════════════
// LeadIQ AI — AI Lead Scoring Engine
// ═══════════════════════════════════════════════════════════════

import type { Lead, LeadScoreCategory } from '../types';

interface ScoreWeights {
  budget: number;
  urgency: number;
  siteVisitInterest: number;
  questionsAsked: number;
  followUpHistory: number;
}

const DEFAULT_WEIGHTS: ScoreWeights = {
  budget: 0.25,
  urgency: 0.25,
  siteVisitInterest: 0.20,
  questionsAsked: 0.15,
  followUpHistory: 0.15,
};

function normalizeBudget(budget: number): number {
  // Normalize budget to 0-100 scale
  // Budgets above 50L (5,000,000) get max score
  if (budget >= 5000000) return 100;
  if (budget >= 3000000) return 85;
  if (budget >= 1500000) return 70;
  if (budget >= 800000) return 55;
  if (budget >= 400000) return 40;
  if (budget >= 200000) return 25;
  return 15;
}

function normalizeValue(value: number, max: number = 10): number {
  return Math.min(100, (value / max) * 100);
}

function normalizeQuestions(count: number): number {
  if (count >= 15) return 100;
  if (count >= 10) return 85;
  if (count >= 7) return 70;
  if (count >= 4) return 50;
  if (count >= 2) return 30;
  return 10;
}

function normalizeFollowUps(count: number): number {
  if (count >= 8) return 100;
  if (count >= 5) return 80;
  if (count >= 3) return 60;
  if (count >= 1) return 40;
  return 10;
}

export function calculateLeadScore(lead: Partial<Lead>, weights: ScoreWeights = DEFAULT_WEIGHTS): number {
  const budgetScore = normalizeBudget(lead.budget || 0);
  const urgencyScore = normalizeValue(lead.urgency || 0);
  const siteVisitScore = normalizeValue(lead.siteVisitInterest || 0);
  const questionsScore = normalizeQuestions(lead.questionsAsked || 0);
  const followUpScore = normalizeFollowUps(lead.followUpHistory || 0);

  const weightedScore =
    budgetScore * weights.budget +
    urgencyScore * weights.urgency +
    siteVisitScore * weights.siteVisitInterest +
    questionsScore * weights.questionsAsked +
    followUpScore * weights.followUpHistory;

  return Math.round(Math.min(100, Math.max(0, weightedScore)));
}

export function getScoreCategory(score: number): LeadScoreCategory {
  if (score >= 75) return 'hot';
  if (score >= 45) return 'warm';
  return 'cold';
}

export function getScoreColor(category: LeadScoreCategory): string {
  switch (category) {
    case 'hot': return 'var(--color-hot)';
    case 'warm': return 'var(--color-warm)';
    case 'cold': return 'var(--color-cold)';
  }
}

export function getScoreGradient(category: LeadScoreCategory): string {
  switch (category) {
    case 'hot': return 'var(--gradient-hot)';
    case 'warm': return 'var(--gradient-warm)';
    case 'cold': return 'var(--gradient-cold)';
  }
}

export function getScoreLabel(category: LeadScoreCategory): string {
  switch (category) {
    case 'hot': return '🔥 Hot Lead';
    case 'warm': return '☀️ Warm Lead';
    case 'cold': return '❄️ Cold Lead';
  }
}

export function generateAISummary(lead: Lead): string {
  const summaries: Record<LeadScoreCategory, string[]> = {
    hot: [
      `${lead.name} shows exceptional buying intent with a strong budget of ₹${(lead.budget / 100000).toFixed(1)}L and high urgency (${lead.urgency}/10). They've expressed keen interest in site visits and have actively engaged with ${lead.questionsAsked} questions. This lead is highly likely to convert within the next 2 weeks.`,
      `High-value prospect ${lead.name} from ${lead.location} has demonstrated serious purchase intent. With ${lead.followUpHistory} successful follow-ups and consistent engagement, recommend scheduling an immediate property tour and preparing a customized proposal.`,
    ],
    warm: [
      `${lead.name} is showing moderate interest with a budget of ₹${(lead.budget / 100000).toFixed(1)}L. While engagement is promising with ${lead.questionsAsked} questions asked, urgency is at ${lead.urgency}/10. Recommend nurturing with property comparison sheets and scheduling a follow-up call within 3-5 days.`,
      `Potential buyer ${lead.name} from ${lead.location} has been responsive but hasn't committed to a site visit yet. Focus on addressing their specific requirements for ${lead.propertyType} properties and share relevant market insights to boost confidence.`,
    ],
    cold: [
      `${lead.name} has shown initial interest but engagement remains low with only ${lead.questionsAsked} questions and urgency at ${lead.urgency}/10. Budget of ₹${(lead.budget / 100000).toFixed(1)}L suggests they may be in early research phase. Recommend adding to drip email campaign and re-engaging in 2-3 weeks.`,
      `Early-stage prospect ${lead.name} needs nurturing. Consider sharing educational content about ${lead.propertyType} market trends in ${lead.location} and testimonials from similar buyers to build trust over time.`,
    ],
  };

  const options = summaries[lead.scoreCategory];
  return options[Math.floor(Math.random() * options.length)];
}

export function generateNextActions(lead: Lead): string[] {
  const actions: Record<LeadScoreCategory, string[]> = {
    hot: [
      'Schedule immediate site visit within 48 hours',
      'Prepare customized property proposal',
      'Send exclusive pricing and payment plans',
      'Arrange meeting with senior sales manager',
      'Share virtual tour of shortlisted properties',
    ],
    warm: [
      'Send property comparison brochure',
      'Schedule follow-up call in 3-5 days',
      'Share recent customer testimonials',
      'Invite to upcoming property expo',
      'Send market analysis report for their area',
    ],
    cold: [
      'Add to monthly newsletter list',
      'Send introductory email with key listings',
      'Schedule re-engagement call in 2-3 weeks',
      'Share educational blog content',
      'Monitor for renewed interest signals',
    ],
  };

  return actions[lead.scoreCategory].slice(0, 3 + Math.floor(Math.random() * 2));
}

export function getScoreBreakdown(lead: Lead) {
  return [
    { label: 'Budget', value: normalizeBudget(lead.budget), weight: DEFAULT_WEIGHTS.budget, icon: '💰' },
    { label: 'Urgency', value: normalizeValue(lead.urgency), weight: DEFAULT_WEIGHTS.urgency, icon: '⚡' },
    { label: 'Site Visit Interest', value: normalizeValue(lead.siteVisitInterest), weight: DEFAULT_WEIGHTS.siteVisitInterest, icon: '🏠' },
    { label: 'Questions Asked', value: normalizeQuestions(lead.questionsAsked), weight: DEFAULT_WEIGHTS.questionsAsked, icon: '❓' },
    { label: 'Follow-up History', value: normalizeFollowUps(lead.followUpHistory), weight: DEFAULT_WEIGHTS.followUpHistory, icon: '📞' },
  ];
}
