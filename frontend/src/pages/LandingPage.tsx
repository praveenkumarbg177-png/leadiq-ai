import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, BarChart3, Target, Zap, Bot, Shield, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    { icon: Bot, title: 'AI-Powered Lead Scoring', desc: 'Automatically classify leads as Hot, Warm, or Cold based on intent signals, budget, and engagement history.' },
    { icon: Target, title: 'Smart Follow-Ups', desc: 'Never miss a beat. Our engine suggests the perfect time and channel to reconnect with every prospect.' },
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Visualize your entire sales funnel with interactive Recharts, forecasting revenue and tracking agent performance.' },
    { icon: Zap, title: 'Real-Time Insights', desc: 'Get AI-generated summaries of lead interactions and actionable next steps right on your dashboard.' },
    { icon: Shield, title: 'Enterprise Security', desc: 'Role-based access control ensures your data is secure. Perfect for scaling real estate teams.' },
    { icon: CheckCircle, title: 'Seamless Workflow', desc: 'From initial contact to final contract, manage the entire customer journey in one beautiful interface.' },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass" style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/logo.png"
            alt="Lohitha Dharma Projects Pvt. Ltd."
            style={{
              height: 52,
              width: 'auto',
              objectFit: 'contain',
              mixBlendMode: 'multiply',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={() => navigate('/login')} className="btn btn-ghost">Log In</button>
          <button onClick={() => navigate('/login')} className="btn btn-primary">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ paddingTop: 160, paddingBottom: 100, paddingLeft: '5%', paddingRight: '5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'var(--color-brand-500)', filter: 'blur(120px)', opacity: 0.15, borderRadius: '50%' }} />
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="badge badge-brand" style={{ marginBottom: 24, padding: '8px 16px', fontSize: 14 }}>
            ✨ The Future of Real Estate Sales
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.03em', maxWidth: 1000, margin: '0 auto 24px' }}>
            Close More Deals with <br />
            <span className="text-gradient">Intelligent Lead Scoring</span>
          </h1>
          <p style={{ fontSize: 'clamp(18px, 2vw, 22px)', color: 'var(--color-text-secondary)', maxWidth: 700, margin: '0 auto 40px', lineHeight: 1.5 }}>
            Stop guessing which leads will convert. LeadIQ AI analyzes budget, urgency, and engagement to prioritize your real estate pipeline automatically.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button onClick={() => navigate('/login')} className="btn btn-primary btn-lg" style={{ padding: '16px 32px', fontSize: 18 }}>
              Start Free Trial <ArrowRight size={20} />
            </button>
            <button className="btn btn-secondary btn-lg" style={{ padding: '16px 32px', fontSize: 18 }}>
              View Demo
            </button>
          </div>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ marginTop: 80, position: 'relative', perspective: 1000 }}
        >
          <div className="glass-strong" style={{ borderRadius: 24, padding: 8, background: 'rgba(255,255,255,0.4)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-xl)', maxWidth: 1200, margin: '0 auto', transform: 'rotateX(2deg)' }}>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80" 
              alt="LeadIQ Dashboard" 
              style={{ width: '100%', borderRadius: 16, display: 'block', border: '1px solid rgba(0,0,0,0.1)' }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '100px 5%', background: 'var(--color-bg-secondary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Everything you need to scale</h2>
            <p style={{ fontSize: 20, color: 'var(--color-text-secondary)', maxWidth: 600, margin: '0 auto' }}>Enterprise-grade tools packaged in a beautiful, intuitive interface.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30 }}>
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card"
                style={{ background: 'var(--color-bg-card-solid)' }}
              >
                <div style={{ width: 48, height: 48, background: 'var(--color-brand-100)', color: 'var(--color-brand-600)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <f.icon size={24} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 5%' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', background: 'var(--color-bg-secondary)', borderRadius: 32, padding: '80px 40px', textAlign: 'center', border: '1px solid var(--color-border)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%230ea5e9\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 800, marginBottom: 24, position: 'relative', zIndex: 1, color: 'var(--color-text-primary)' }}>Ready to transform your sales?</h2>
          <p style={{ fontSize: 20, color: 'var(--color-text-secondary)', marginBottom: 40, maxWidth: 600, margin: '0 auto 40px', position: 'relative', zIndex: 1 }}>Join top real estate teams using AI to close deals faster and smarter.</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '16px 40px', fontSize: 18, position: 'relative', zIndex: 1 }}>
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--color-border)', padding: '40px 5%', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <img
            src="/logo.png"
            alt="Lohitha Dharma Projects Pvt. Ltd."
            style={{
              height: 44,
              width: 'auto',
              objectFit: 'contain',
              mixBlendMode: 'multiply',
              opacity: 0.85,
            }}
          />
        </div>
        <p>© 2026 Lohitha Dharma Projects Pvt. Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}
