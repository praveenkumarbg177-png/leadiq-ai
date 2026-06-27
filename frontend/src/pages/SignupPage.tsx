import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signup(name, email, password);
      if (result) {
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setErrorMsg('Registration failed. Please try again.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      {/* Left side - Branding */}
      <div style={{
        flex: 1,
        background: 'var(--gradient-hero)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '10%',
        color: 'var(--color-text-primary)',
        position: 'relative',
        overflow: 'hidden'
      }} className="hidden lg:flex">
        {/* Background glow elements */}
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: 300, height: 300, background: 'rgba(14, 165, 233, 0.1)', filter: 'blur(100px)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: 250, height: 250, background: 'rgba(2, 132, 199, 0.05)', filter: 'blur(80px)', borderRadius: '50%' }} />

        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          {/* Logo */}
          <div style={{ overflow: 'hidden', marginBottom: 40 }}>
            <img
              src="/logo.png"
              alt="Lohitha Dharma Projects Pvt. Ltd."
              style={{
                width: '80%',
                height: 'auto',
                objectFit: 'contain',
                mixBlendMode: 'multiply',
                display: 'block',
                marginTop: '-18%',
                marginBottom: '-18%',
              }}
            />
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 800, lineHeight: 1.15, marginBottom: 24, color: 'var(--color-text-primary)' }}>
            Start managing your leads smarter today.
          </h1>
          <p style={{ fontSize: 18, color: 'var(--color-text-secondary)', maxWidth: 480, lineHeight: 1.6 }}>
            Join the platform that uses AI to score, prioritize and convert your real estate leads — all in one place.
          </p>

          {/* Feature highlights */}
          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              'AI-powered lead scoring in real time',
              'Smart follow-up calendar & reminders',
              'Advanced analytics & conversion reports',
              'Role-based team & user management',
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12 }}
              >
                <CheckCircle size={20} color="var(--color-brand-500)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 15, color: 'var(--color-text-secondary)' }}>{feature}</span>
              </motion.div>
            ))}
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
          style={{ width: '100%', maxWidth: 460, padding: 40, boxShadow: 'var(--shadow-xl)' }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ overflow: 'hidden', marginBottom: 32 }}>
            <img
              src="/logo.png"
              alt="Lohitha Dharma Projects Pvt. Ltd."
              style={{
                width: '80%',
                height: 'auto',
                objectFit: 'contain',
                mixBlendMode: 'multiply',
                display: 'block',
                margin: '0 auto',
                marginTop: '-18%',
                marginBottom: '-18%',
              }}
            />
          </div>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
              Create your account
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>
              Get started with Lohitha Dharma Projects AI.
            </p>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: 'center', padding: 32, display: 'flex',
                flexDirection: 'column', alignItems: 'center', gap: 16,
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--color-success-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckCircle size={32} color="var(--color-success)" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)' }}>Account Created!</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>Redirecting you to your dashboard...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Full Name */}
              <div>
                <label className="input-label" htmlFor="name">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: 14, top: 11, color: 'var(--color-text-tertiary)' }} />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: 42 }}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="input-label" htmlFor="signup-email">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: 14, top: 11, color: 'var(--color-text-tertiary)' }} />
                  <input
                    id="signup-email"
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

              {/* Password */}
              <div>
                <label className="input-label" htmlFor="signup-password">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: 14, top: 11, color: 'var(--color-text-tertiary)' }} />
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: 42 }}
                    placeholder="Min. 6 characters"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="input-label" htmlFor="confirm-password">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: 14, top: 11, color: 'var(--color-text-tertiary)' }} />
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: 42 }}
                    placeholder="Re-enter your password"
                    required
                  />
                </div>
              </div>

              {errorMsg && (
                <p style={{ color: 'var(--color-danger)', fontSize: 13, fontWeight: 600, margin: 0 }}>
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: 4 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} className="animate-spin" />
                ) : (
                  <>Create Account <ArrowRight size={18} /></>
                )}
              </button>

              <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 8 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--color-brand-500)', fontWeight: 600, textDecoration: 'none' }}>
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
