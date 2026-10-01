import React from 'react';
import { ArrowRight, Sparkles, Terminal, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="section hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="badge">
            <span className="badge-pulse"></span>
            <Sparkles size={14} />
            <span>v2.0 Architecture Ready • Lightning Fast</span>
          </div>

          <h1 className="hero-title">
            Build Modern Web Apps <br />
            with <span className="gradient-text">Precision & Elegance</span>
          </h1>

          <p className="hero-description">
            A high-performance, accessible, and ultra-modular frontend architecture engineered for modern web applications, dashboards, and enterprise platforms.
          </p>

          <div className="hero-cta-group">
            <a href="#playground" className="btn btn-primary btn-lg">
              <span>Start Building Now</span>
              <ArrowRight size={18} />
            </a>
            <a href="#features" className="btn btn-secondary btn-lg">
              <Terminal size={18} />
              <span>Explore Architecture</span>
            </a>
          </div>

          <div className="hero-tags">
            <div className="hero-tag-item">
              <CheckCircle2 size={16} color="var(--accent-emerald)" />
              <span>Zero-Config Setup</span>
            </div>
            <div className="hero-tag-item">
              <Zap size={16} color="var(--accent-cyan)" />
              <span>Sub-millisecond Render</span>
            </div>
            <div className="hero-tag-item">
              <ShieldCheck size={16} color="var(--primary)" />
              <span>TypeScript Strict</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
