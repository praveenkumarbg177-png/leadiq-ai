import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('praveenkumarbg177@gmail.com');
  const [password, setPassword] = useState('123456789');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      await login(email, password);
      setIsLoading(false);
      navigate('/dashboard');
    } catch (e: any) {
      setIsLoading(false);
      setErrorMsg(e.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      {/* Left side - Branding/Illustration */}
      <div style={{ 
        flex: 1, 
        background: 'var(--gradient-hero)', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '10%',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }} className="hidden lg:flex">
        {/* Background elements */}
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: 300, height: 300, background: 'rgba(99, 102, 241, 0.4)', filter: 'blur(100px)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: 250, height: 250, background: 'rgba(167, 139, 250, 0.3)', filter: 'blur(80px)', borderRadius: '50%' }} />

        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <div style={{ width: 48, height: 48, background: 'white', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand-600)' }}>
              <Zap size={28} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32 }}>LeadIQ AI</span>
          </div>
          
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
            Intelligent lead scoring for modern real estate teams.
          </h1>
          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.8)', maxWidth: 500, lineHeight: 1.5 }}>
            Join thousands of professionals using AI to prioritize their pipeline and close deals 3x faster.
          </p>

          {/* Testimonial card */}
          <div className="glass-subtle" style={{ marginTop: 60, padding: 24, borderRadius: 20, maxWidth: 450 }}>
            <p style={{ fontSize: 16, fontStyle: 'italic', marginBottom: 16, color: 'white' }}>
              "LeadIQ completely transformed our sales process. The AI scoring is incredibly accurate, and we've seen a 40% increase in conversion rates since implementation."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, background: 'var(--color-brand-400)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>SK</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Sarah Kapoor</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>VP of Sales, Metro Realty</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="card-solid"
          style={{ width: '100%', maxWidth: 440, padding: 40, boxShadow: 'var(--shadow-xl)' }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, background: 'var(--gradient-brand)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Zap size={24} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--color-text-primary)' }}>LeadIQ</span>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Welcome back</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>Please enter your details to sign in.</p>
            {errorMsg && <p style={{ color: 'var(--color-danger)', fontSize: 14, marginTop: 8, fontWeight: 600 }}>{errorMsg}</p>}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="input-label" htmlFor="email">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 14, top: 11, color: 'var(--color-text-tertiary)' }} />
                <input 
                  id="email"
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field" 
                  style={{ paddingLeft: 42 }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label className="input-label" htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
                <a href="#" style={{ fontSize: 13, color: 'var(--color-brand-500)', textDecoration: 'none', fontWeight: 600 }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 14, top: 11, color: 'var(--color-text-tertiary)' }} />
                <input 
                  id="password"
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field" 
                  style={{ paddingLeft: 42 }}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', marginTop: 8 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} className="animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Demo Credentials Helper */}
          <div style={{ marginTop: 32, padding: 16, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--color-text-secondary)' }}>
            <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--color-text-primary)' }}>System Accounts:</p>
            <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Admin: <strong>admin@leadiq.com</strong> / admin123</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
