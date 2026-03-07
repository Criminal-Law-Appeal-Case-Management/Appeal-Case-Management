import { Link, useNavigate } from "react-router-dom";
import { Scale, Moon, Sun, Menu, X, ArrowLeft, Home } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

const PageHeader = ({ 
  title, 
  showBackButton = true, 
  backTo = "/",
  showHomeButton = true,
  children 
}) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/how-it-works", label: "How It Works" },
    { to: "/appeal-statistics", label: "Statistics" },
    { to: "/legal-resources", label: "Legal Resources" },
    { to: "/success-stories", label: "Success Stories" },
    { to: "/faq", label: "FAQ" },
    { to: "/about", label: "About" },
  ];

  return (
    <header className="bg-slate-900 dark:bg-slate-950 sticky top-0 z-50" data-testid="page-header">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and back button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(backTo)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 -ml-2"
                data-testid="header-back-btn"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            )}
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-600 flex items-center justify-center">
                <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-base sm:text-lg font-semibold text-white tracking-tight hidden sm:block" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Appeal Case Manager
              </span>
            </Link>
          </div>

          {/* Right side - Navigation and actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                  data-testid={`nav-${link.to.replace("/", "")}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Home button */}
            {showHomeButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
                data-testid="header-home-btn"
              >
                <Home className="w-4 h-4" />
              </Button>
            )}

            {/* Dark mode toggle - always visible */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              data-testid="theme-toggle"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Additional children (e.g., Sign In button) */}
            {children}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pt-4 border-t border-slate-700 space-y-2" data-testid="mobile-nav">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2 text-slate-300 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/glossary" className="block py-2 text-slate-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Legal Glossary</Link>
            <Link to="/forms" className="block py-2 text-slate-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Forms & Templates</Link>
            <Link to="/contact" className="block py-2 text-slate-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <Link to="/terms" className="block py-2 text-slate-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Terms</Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
