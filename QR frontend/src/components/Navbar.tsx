import React, { useState } from 'react';
import { Layers, Moon, Sun, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container nav-container">
        <a href="#" className="brand">
          <div className="brand-icon">
            <Layers size={20} />
          </div>
          <span>Apex<span className="gradient-text">UI</span></span>
        </a>

        <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <a href="#features" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <a href="#preview" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Preview</a>
          <a href="#playground" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Playground</a>
          <a href="#docs" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Docs</a>
          <a href="#pricing" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
        </nav>

        <div className="nav-actions">
          <button 
            className="icon-btn" 
            onClick={toggleTheme} 
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a href="#playground" className="btn btn-primary btn-sm">
            <Sparkles size={14} />
            <span>Get Started</span>
            <ArrowRight size={14} />
          </a>

          <button 
            className="icon-btn mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};
