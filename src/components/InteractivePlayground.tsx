import React, { useState } from 'react';
import { 
  Sliders, 
  Layers, 
  Plus, 
  Minus, 
  Check, 
  Copy, 
  Send, 
  AlertCircle, 
  CheckCircle2,
  Code2
} from 'lucide-react';

export const InteractivePlayground: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'components' | 'forms' | 'feedback'>('components');
  const [counter, setCounter] = useState(42);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyCode = () => {
    setCopied(true);
    triggerToast('Code snippet copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="playground" className="section" style={{ background: 'rgba(0,0,0,0.1)' }}>
      <div className="container">
        <div className="section-header">
          <div className="badge">
            <Sliders size={14} />
            <span>Interactive Workshop</span>
          </div>
          <h2>Explore Dynamic UI Primitives</h2>
          <p>Test and interact with standard frontend modules, dynamic states, and feedback loops.</p>
        </div>

        <div className="glass-card demo-box" style={{ padding: 0 }}>
          {/* Sidebar Tabs */}
          <div className="demo-sidebar">
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
              Prerequisites & Tools
            </span>

            <button 
              className={`demo-tab-btn ${activeTab === 'components' ? 'active' : ''}`}
              onClick={() => setActiveTab('components')}
            >
              <Layers size={18} />
              <span>UI Elements</span>
            </button>

            <button 
              className={`demo-tab-btn ${activeTab === 'forms' ? 'active' : ''}`}
              onClick={() => setActiveTab('forms')}
            >
              <Send size={18} />
              <span>Interactive Controls</span>
            </button>

            <button 
              className={`demo-tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
              onClick={() => setActiveTab('feedback')}
            >
              <AlertCircle size={18} />
              <span>Toasts & Alerts</span>
            </button>

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Code2 size={14} />
                <span>React 18 + Pure CSS</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="demo-main">
            {activeTab === 'components' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem' }}>Button Variants & Badges</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                  <button className="btn btn-primary" onClick={() => triggerToast('Primary action triggered!')}>
                    Primary Glow
                  </button>
                  <button className="btn btn-secondary" onClick={() => triggerToast('Secondary action clicked!')}>
                    Secondary Glass
                  </button>
                  <button className="btn btn-ghost" onClick={() => triggerToast('Ghost link clicked!')}>
                    Ghost Link
                  </button>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Stateful Counter Hook</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="interactive-counter">
                      <button 
                        className="icon-btn" 
                        style={{ width: '32px', height: '32px' }}
                        onClick={() => setCounter(c => c - 1)}
                        aria-label="Decrement"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="counter-display">{counter}</span>
                      <button 
                        className="icon-btn" 
                        style={{ width: '32px', height: '32px' }}
                        onClick={() => setCounter(c => c + 1)}
                        aria-label="Increment"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      Click buttons to mutate component state
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'forms' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem' }}>Form Field & Validation</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Project Domain Name
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      placeholder="e.g. apex-cloud.io" 
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        if (inputVal.trim()) {
                          triggerToast(`Configured domain: ${inputVal}`);
                          setInputVal('');
                        } else {
                          triggerToast('Please enter a domain name first');
                        }
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'feedback' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem' }}>Feedback & Notifications</h4>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => triggerToast('System health status: All services operational.')}
                  >
                    Trigger Info Notification
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => triggerToast('Success: Component bundle deployed to CDN!')}
                  >
                    Trigger Success Banner
                  </button>
                </div>
              </div>
            )}

            {/* Code Snippet Box */}
            <div style={{ 
              marginTop: 'auto',
              background: 'var(--bg-primary)', 
              borderRadius: 'var(--radius-md)', 
              padding: '1rem',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
                import &#123; Button, Badge, Card &#125; from '@/components';
              </code>
              <button 
                className="icon-btn" 
                style={{ width: '32px', height: '32px' }}
                onClick={handleCopyCode}
                title="Copy import"
              >
                {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
              </button>
            </div>

            {/* Toast feedback pill */}
            {toastMessage && (
              <div style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-strong)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                zIndex: 999,
                animation: 'pulse-glow 3s infinite'
              }}>
                <CheckCircle2 size={18} color="var(--accent-emerald)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{toastMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
