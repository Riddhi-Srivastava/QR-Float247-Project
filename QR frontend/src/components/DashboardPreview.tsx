import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  DollarSign, 
  ArrowUpRight, 
  CheckCircle, 
  Search,
  Bell,
  RefreshCw
} from 'lucide-react';

export const DashboardPreview: React.FC = () => {
  const [activeRange, setActiveRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const metrics = [
    { label: 'Total Revenue', value: '$128,430', change: '+18.2%', icon: DollarSign, isPositive: true },
    { label: 'Active Users', value: '45,210', change: '+12.4%', icon: Users, isPositive: true },
    { label: 'Conversion Rate', value: '4.82%', change: '+0.9%', icon: TrendingUp, isPositive: true },
    { label: 'System Uptime', value: '99.99%', change: 'Stable', icon: Activity, isPositive: true }
  ];

  const recentTransactions = [
    { id: 'TX-9021', name: 'Stripe Gateway Deposit', status: 'Completed', amount: '+$3,450.00', time: '2 mins ago', badgeColor: 'var(--accent-emerald)' },
    { id: 'TX-9020', name: 'API Subscription Tier Pro', status: 'Completed', amount: '+$149.00', time: '14 mins ago', badgeColor: 'var(--accent-emerald)' },
    { id: 'TX-9019', name: 'AWS Cloud Server Cluster', status: 'Processing', amount: '-$890.00', time: '1 hour ago', badgeColor: 'var(--accent-amber)' },
    { id: 'TX-9018', name: 'Enterprise License Renewal', status: 'Completed', amount: '+$12,800.00', time: '3 hours ago', badgeColor: 'var(--accent-emerald)' }
  ];

  return (
    <section id="preview" className="container" style={{ marginBottom: '5rem' }}>
      <div className="showcase-wrapper">
        <div className="showcase-inner">
          {/* Header Bar */}
          <div className="window-header">
            <div className="window-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="window-tab">apex-cloud-dashboard.internal.app</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="icon-btn" 
                style={{ width: '28px', height: '28px', borderRadius: '6px' }}
                onClick={handleRefresh}
                title="Refresh preview data"
              >
                <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Dashboard Body */}
          <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Top Bar inside app */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Analytics Overview</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Real-time telemetry and metric streams</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  display: 'flex', 
                  background: 'rgba(255,255,255,0.05)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '3px',
                  border: '1px solid var(--border-subtle)' 
                }}>
                  {(['24h', '7d', '30d'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setActiveRange(range)}
                      style={{
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        borderRadius: '4px',
                        color: activeRange === range ? '#fff' : 'var(--text-secondary)',
                        background: activeRange === range ? 'var(--primary)' : 'transparent',
                        transition: 'all 150ms'
                      }}
                    >
                      {range.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  padding: '0.35rem 0.85rem', 
                  borderRadius: 'var(--radius-sm)', 
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)'
                }}>
                  <Search size={14} />
                  <span>Search records...</span>
                </div>
              </div>
            </div>

            {/* Metric Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {metrics.map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div 
                    key={idx} 
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{m.label}</span>
                      <div style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '6px', 
                        background: 'rgba(99, 102, 241, 0.15)', 
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={14} />
                      </div>
                    </div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                      {m.value}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                      <ArrowUpRight size={14} />
                      <span>{m.change}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>vs last period</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Simulated Live Activity Chart / Feed */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1rem' }}>
              {/* Performance Graph Simulation */}
              <div style={{ 
                background: 'var(--bg-tertiary)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: 'var(--radius-md)', 
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Network Throughput & Traffic</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>LIVE STREAM</span>
                </div>
                
                {/* Bar Graph Simulation */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px', paddingTop: '1rem' }}>
                  {[45, 68, 52, 84, 92, 70, 85, 60, 95, 78, 88, 100, 65, 82, 90, 75].map((height, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        flex: 1, 
                        height: `${height}%`, 
                        background: i === 11 ? 'var(--gradient-brand)' : 'rgba(99, 102, 241, 0.25)', 
                        borderRadius: '4px 4px 0 0',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      title={`Time frame ${i}: ${height}% load`}
                    />
                  ))}
                </div>
              </div>

              {/* Transactions Feed */}
              <div style={{ 
                background: 'var(--bg-tertiary)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: 'var(--radius-md)', 
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Recent Operations</span>
                  <Bell size={14} color="var(--text-muted)" />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {recentTransactions.slice(0, 3).map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={14} color={item.badgeColor} />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.time}</div>
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, color: item.amount.startsWith('+') ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                        {item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
