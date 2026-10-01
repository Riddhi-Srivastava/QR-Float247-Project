import React from 'react';
import { Cpu, ShieldCheck, Globe, Zap } from 'lucide-react';

export const Stats: React.FC = () => {
  const stats = [
    { value: '99.99%', label: 'Guaranteed SLA Uptime', icon: ShieldCheck },
    { value: '< 15ms', label: 'Edge Global Latency', icon: Zap },
    { value: '180+', label: 'Countries Supported', icon: Globe },
    { value: '100k+', label: 'Requests per Second', icon: Cpu }
  ];

  return (
    <section className="section" style={{ paddingTop: '1rem', paddingBottom: '4rem' }}>
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem', color: 'var(--primary)' }}>
                  <Icon size={24} />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
