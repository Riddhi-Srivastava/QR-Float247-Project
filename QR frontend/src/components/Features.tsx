import React from 'react';
import { 
  Boxes, 
  Palette, 
  Sparkles, 
  ShieldAlert, 
  Gauge, 
  GitBranch 
} from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: Boxes,
      title: 'Modular Architecture',
      description: 'Composable, self-contained components and hooks designed for high reuse and minimal cognitive load.'
    },
    {
      icon: Palette,
      title: 'Dynamic Design Tokens',
      description: 'Zero-runtime CSS custom properties with effortless dark/light mode switching and fluid typography.'
    },
    {
      icon: Gauge,
      title: 'Optimal Performance',
      description: 'Sub-second initial loads, tree-shaken bundles, and instant HMR powered by Vite & React 18.'
    },
    {
      icon: Sparkles,
      title: 'Glassmorphic Aesthetics',
      description: 'Modern visual elements, backdrop blur filters, glowing border accents, and curated color palettes.'
    },
    {
      icon: GitBranch,
      title: 'API & State Ready',
      description: 'Pre-configured patterns for API clients, async data handling, notifications, and local state management.'
    },
    {
      icon: ShieldAlert,
      title: 'Production Guardrails',
      description: 'Full TypeScript strict mode, responsive layout boundaries, and accessible WCAG-compliant UI primitives.'
    }
  ];

  return (
    <section id="features" className="section">
      <div className="container">
        <div className="section-header">
          <div className="badge">
            <span>Capabilities</span>
          </div>
          <h2>Engineered for Scale & Speed</h2>
          <p>
            Everything you need to ship world-class user interfaces with polished interaction design and battle-tested code quality.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="glass-card glass-card-hoverable">
                <div className="feature-icon-wrapper">
                  <Icon size={24} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
