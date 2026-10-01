import React from 'react';
import { Layers, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="brand">
              <div className="brand-icon">
                <Layers size={18} />
              </div>
              <span>Apex<span className="gradient-text">UI</span></span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: '320px' }}>
              Next-generation frontend architecture combining high performance, modular tokens, and modern visual design.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="GitHub">
                <Github size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Column 1 */}
          <div className="footer-col">
            <h4>Architecture</h4>
            <ul>
              <li><a href="#features" className="footer-link">Design Tokens</a></li>
              <li><a href="#playground" className="footer-link">UI Components</a></li>
              <li><a href="#preview" className="footer-link">Data Visualizations</a></li>
              <li><a href="#docs" className="footer-link">Type Definitions</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><a href="#docs" className="footer-link">Documentation</a></li>
              <li><a href="#playground" className="footer-link">Interactive Lab</a></li>
              <li><a href="#preview" className="footer-link">Component Specs</a></li>
              <li><a href="#changelog" className="footer-link">Changelog</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="footer-col">
            <h4>Ecosystem</h4>
            <ul>
              <li><a href="#guidelines" className="footer-link">Design Guidelines</a></li>
              <li><a href="#accessibility" className="footer-link">Accessibility</a></li>
              <li><a href="#community" className="footer-link">Community</a></li>
              <li><a href="#support" className="footer-link">Support & FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} ApexUI Architecture. Open-source under MIT License.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Engineered with</span>
            <Heart size={14} color="var(--accent-pink)" fill="var(--accent-pink)" />
            <span>for high performance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
