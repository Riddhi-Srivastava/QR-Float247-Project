import React from 'react';
import { ArrowRight, Sparkles, Code2 } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-banner">
          <div style={{ maxWidth: '640px', marginInline: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
            <div className="badge">
              <Sparkles size={14} />
              <span>Production Ready</span>
            </div>

            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
              Accelerate Your Next Project Today
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Built with modular React components, clean CSS architecture, and strict TypeScript types.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
              <a href="#playground" className="btn btn-primary btn-lg">
                <span>Explore Live Workspace</span>
                <ArrowRight size={18} />
              </a>
              <button 
                className="btn btn-secondary btn-lg"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <Code2 size={18} />
                <span>Back to Top</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
