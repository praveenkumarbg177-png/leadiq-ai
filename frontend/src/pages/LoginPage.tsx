import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('praveenkumarbg177@gmail.com');
  const [password, setPassword] = useState('123456789');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock password reset API call
    setTimeout(() => {
      setIsLoading(false);
      setResetSent(true);
    }, 1000);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await loginWithGoogle();
      if (result) navigate('/dashboard');
      else setErrorMsg('Google sign-in failed. Please try again.');
    } catch (e: any) {
      setErrorMsg(e.message || 'Google sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

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
        color: 'var(--color-text-primary)',
        position: 'relative',
        overflow: 'hidden'
      }} className="hidden lg:flex">
        {/* Background elements */}
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: 300, height: 300, background: 'rgba(14, 165, 233, 0.1)', filter: 'blur(100px)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: 250, height: 250, background: 'rgba(2, 132, 199, 0.05)', filter: 'blur(80px)', borderRadius: '50%' }} />

        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ overflow: 'hidden', marginBottom: 40 }}>
            <img
              src="/logo.png"
              alt="Lohitha Dharma Projects Pvt. Ltd."
              className="theme-logo"
              style={{
                width: '80%',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                marginTop: '-18%',
                marginBottom: '-18%',
              }}
            />
          </div>
          
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 24, color: 'var(--color-text-primary)' }}>
            Intelligent lead scoring for modern real estate teams.
          </h1>
          <p style={{ fontSize: 20, color: 'var(--color-text-secondary)', maxWidth: 500, lineHeight: 1.5 }}>
            Join thousands of professionals using AI to prioritize their pipeline and close deals 3x faster.
          </p>

          {/* Testimonial card */}
          <div style={{ marginTop: 60, padding: 24, borderRadius: 20, maxWidth: 450, background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
            <p style={{ fontSize: 16, fontStyle: 'italic', marginBottom: 16, color: 'var(--color-text-primary)' }}>
              "Lohitha Dharma Projects completely transformed our sales process. The AI scoring is incredibly accurate, and we've seen a 40% increase in conversion rates since implementation."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, background: 'var(--gradient-brand)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>SK</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text-primary)' }}>Sarah Kapoor</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>VP of Sales, Metro Realty</div>
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
          <div className="lg:hidden" style={{ overflow: 'hidden', marginBottom: 32 }}>
            <img
              src="/logo.png"
              alt="Lohitha Dharma Projects Pvt. Ltd."
              className="theme-logo"
              style={{
                width: '80%',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
                marginTop: '-18%',
                marginBottom: '-18%',
              }}
            />
          </div>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
              {isForgotPassword ? 'Reset Password' : 'Welcome back'}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>
              {isForgotPassword 
                ? 'Enter your email to receive a password reset link.' 
                : 'Please enter your details to sign in.'}
            </p>
            {errorMsg && <p style={{ color: 'var(--color-danger)', fontSize: 14, marginTop: 8, fontWeight: 600 }}>{errorMsg}</p>}
          </div>

          {isForgotPassword ? (
            resetSent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 48, height: 48, background: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Mail size={24} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Check your email</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 24 }}>
                  We've sent a password reset link to <br/><strong>{email}</strong>
                </p>
                <button 
                  type="button" 
                  className="btn btn-primary btn-lg" 
                  style={{ width: '100%' }}
                  onClick={() => { setIsForgotPassword(false); setResetSent(false); }}
                >
                  Back to login
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label className="input-label" htmlFor="reset-email">Email address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: 14, top: 11, color: 'var(--color-text-tertiary)' }} />
                    <input 
                      id="reset-email"
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
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg" 
                  style={{ width: '100%', marginTop: 8 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} className="animate-spin" />
                  ) : (
                    <>Send Reset Link <ArrowRight size={18} /></>
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-ghost" 
                  style={{ width: '100%' }}
                  onClick={() => setIsForgotPassword(false)}
                >
                  Back to login
                </button>
              </form>
            )
          ) : (
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
                  <button type="button" onClick={() => setIsForgotPassword(true)} style={{ fontSize: 13, color: 'var(--color-brand-500)', textDecoration: 'none', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Forgot password?</button>
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

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
                <span style={{ fontSize: 13, color: 'var(--color-text-tertiary)', fontWeight: 500 }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
              </div>

              {/* Google Sign-In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="btn btn-secondary btn-lg"
                style={{ width: '100%', gap: 12, border: '1px solid var(--color-border)' }}
              >
                {/* Google SVG Icon */}
                <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
                  <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
                  <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04"/>
                  <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: 'var(--color-brand-500)', fontWeight: 600, textDecoration: 'none' }}>
                  Create one
                </Link>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
