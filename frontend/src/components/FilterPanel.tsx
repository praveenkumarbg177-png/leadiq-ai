import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function FilterPanel({ isOpen, onClose, title = 'Filters', children }: FilterPanelProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--color-bg-card-solid)',
          borderRadius: 'var(--radius-lg)',
          padding: 24,
          width: '90%',
          maxWidth: 500,
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: 18 }} aria-label="Close">
            ×
          </button>
        </div>
        {children}
        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={onClose}>Apply</button>
        </div>
      </motion.div>
    </div>
  );
}
