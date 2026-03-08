import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "./components/ui/sonner";
import InstallPrompt from "./components/InstallPrompt";
import TermsAcceptance from "./components/TermsAcceptance";
import { FastScrollTop } from "./components/FastScrollTop";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import LandingPage from "./pages/LandingPage";
import AuthCallbackPage from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import CaseDetail from "./pages/CaseDetail";
import ReportView from "./pages/ReportView";
import BarristerView from "./pages/BarristerView";
import HelpPage from "./pages/HelpPage";
import ResourcesPage from "./pages/ResourcesPage";
import ProfessionalSummary from "./pages/ProfessionalSummary";
import TermsOfService from "./pages/TermsOfService";
import AdminStats from "./pages/AdminStats";
import ContactPage from "./pages/ContactPage";
import LegalGlossary from "./pages/LegalGlossary";
import SuccessStories from "./pages/SuccessStories";
import Statistics from "./pages/Statistics";
import FAQPage from "./pages/FAQPage";
import LawyerDirectory from "./pages/LawyerDirectory";
import FormTemplates from "./pages/FormTemplates";
import CompareCasesPage from "./pages/CompareCasesPage";
import AboutPage from "./pages/AboutPage";
import LegalResourcesPage from "./pages/LegalResourcesPage";
import HowToUsePage from "./pages/HowToUsePage";
import HowItWorksPage from "./pages/HowItWorksPage";
import AppealStatisticsPage from "./pages/AppealStatisticsPage";
import CaselawSearchPage from "./pages/CaselawSearchPage";
import LegalFrameworkPage from "./pages/LegalFrameworkPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminDashboard from "./pages/AdminDashboard";
import { ThemeProvider } from "./contexts/ThemeContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Configure axios with timeout and credentials
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000; // 30 second timeout for most requests

// Add request interceptor to include auth token from localStorage
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('session_token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Callback Component
const AuthCallback = ({ onComplete }) => {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      const hash = window.location.hash;
      const sessionId = new URLSearchParams(hash.substring(1)).get("session_id");
      console.log("[AuthCallback] Processing auth, session_id:", sessionId ? "present" : "missing");

      if (sessionId) {
        try {
          console.log("[AuthCallback] Calling /api/auth/session...");
          const response = await axios.post(`${API}/auth/session`, { session_id: sessionId });
          console.log("[AuthCallback] Session created successfully, user:", response.data?.email);
          
          // Store session token in localStorage as backup for cookies
          if (response.data?.session_token) {
            localStorage.setItem('session_token', response.data.session_token);
            console.log("[AuthCallback] Session token stored in localStorage");
          }
          
          // Store user data (without sensitive token for state)
          const userData = { ...response.data };
          delete userData.session_token; // Don't keep token in React state
          
          // Small delay to ensure everything is set
          await new Promise(resolve => setTimeout(resolve, 200));
          
          console.log("[AuthCallback] Navigating to dashboard with user state:", userData?.email);
          
          // Signal that auth processing is complete
          if (onComplete) onComplete();
          
          // Navigate to dashboard with user data in state
          navigate("/dashboard", { 
            state: { user: userData }, 
            replace: true 
          });
        } catch (error) {
          console.error("[AuthCallback] Auth error:", error?.response?.data || error.message);
          if (onComplete) onComplete();
          navigate("/", { replace: true });
        }
      } else {
        console.log("[AuthCallback] No session_id found in URL hash");
        if (onComplete) onComplete();
        navigate("/", { replace: true });
      }
    };

    processAuth();
  }, [navigate, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
        <p className="mt-4 text-slate-600 font-medium">Authenticating...</p>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const checkedRef = useRef(false);

  useEffect(() => {
    // Prevent double-checking
    if (checkedRef.current && isAuthenticated !== null) return;
    
    const checkAuth = async () => {
      console.log("[ProtectedRoute] Checking auth, location.state:", location.state ? "present" : "missing");
      
      // First check if user data was passed via navigation state
      if (location.state?.user) {
        console.log("[ProtectedRoute] Using user from navigation state:", location.state.user?.email);
        checkedRef.current = true;
        const userData = location.state.user;
        setUser(userData);
        setIsAuthenticated(true);
        setTermsAccepted(userData.terms_accepted === true);
        return;
      }

      // Otherwise, verify session via API
      console.log("[ProtectedRoute] No state, calling /api/auth/me...");
      try {
        const response = await axios.get(`${API}/auth/me`);
        console.log("[ProtectedRoute] Auth verified:", response.data?.email);
        checkedRef.current = true;
        const userData = response.data;
        setUser(userData);
        setIsAuthenticated(true);
        setTermsAccepted(userData.terms_accepted === true);
      } catch (error) {
        console.error("[ProtectedRoute] Auth check failed:", error?.response?.data || error.message);
        checkedRef.current = true;
        setIsAuthenticated(false);
        navigate("/", { replace: true });
      }
    };

    checkAuth();
  }, [navigate, location.state]);

  const handleTermsAccepted = () => {
    setTermsAccepted(true);
    setUser(prev => ({ ...prev, terms_accepted: true }));
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Show terms acceptance if not yet accepted
  if (!termsAccepted) {
    return <TermsAcceptance onAccept={handleTermsAccepted} />;
  }

  // Clone children and pass user prop
  return children({ user });
};

// App Router Component
function AppRouter() {
  const location = useLocation();
  const [authCompleted, setAuthCompleted] = useState(false);
  const [hasSessionId, setHasSessionId] = useState(false);

  // Check for session_id on mount and when location changes
  // Use window.location.hash directly as react-router location.hash can be delayed on mobile
  useEffect(() => {
    const checkForSession = () => {
      const hash = window.location.hash || location.hash || '';
      if (hash.includes('session_id=') && !authCompleted) {
        console.log('[AppRouter] Found session_id in hash:', hash.substring(0, 30));
        setHasSessionId(true);
      }
    };
    
    // Check immediately
    checkForSession();
    
    // Also check after a short delay for mobile browsers
    const timer = setTimeout(checkForSession, 100);
    return () => clearTimeout(timer);
  }, [location, authCompleted]);

  const shouldShowAuthCallback = hasSessionId && !authCompleted;

  // Handle auth completion - this clears the hash and marks auth as done
  const handleAuthComplete = () => {
    setAuthCompleted(true);
    setHasSessionId(false);
    // Clear the hash from URL after auth completes
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  if (shouldShowAuthCallback) {
    return <AuthCallback onComplete={handleAuthComplete} />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {({ user }) => <Dashboard user={user} />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/cases/:caseId"
        element={
          <ProtectedRoute>
            {({ user }) => <CaseDetail user={user} />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/cases/:caseId/reports/:reportId"
        element={
          <ProtectedRoute>
            {({ user }) => <ReportView user={user} />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/cases/:caseId/reports/:reportId/barrister"
        element={
          <ProtectedRoute>
            {({ user }) => <BarristerView user={user} />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            {({ user }) => <HelpPage user={user} />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources"
        element={
          <ProtectedRoute>
            {({ user }) => <ResourcesPage user={user} />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/professional-summary"
        element={<ProfessionalSummary />}
      />
      <Route
        path="/terms"
        element={<TermsOfService />}
      />
      <Route
        path="/admin/stats"
        element={
          <ProtectedRoute>
            {({ user }) => <AdminStats user={user} />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/contact"
        element={<ContactPage />}
      />
      <Route
        path="/glossary"
        element={<LegalGlossary />}
      />
      <Route
        path="/success-stories"
        element={<SuccessStories />}
      />
      <Route
        path="/statistics"
        element={<Statistics />}
      />
      <Route
        path="/faq"
        element={<FAQPage />}
      />
      <Route
        path="/lawyers"
        element={<LawyerDirectory />}
      />
      <Route
        path="/forms"
        element={<FormTemplates />}
      />
      <Route
        path="/compare"
        element={
          <ProtectedRoute>
            {({ user }) => <CompareCasesPage user={user} />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/about"
        element={<AboutPage />}
      />
      <Route
        path="/legal-resources"
        element={<LegalResourcesPage />}
      />
      <Route
        path="/how-to-use"
        element={<HowToUsePage />}
      />
      <Route
        path="/how-it-works"
        element={<HowItWorksPage />}
      />
      <Route
        path="/appeal-statistics"
        element={<AppealStatisticsPage />}
      />
      <Route
        path="/caselaw-search"
        element={<CaselawSearchPage />}
      />
      <Route
        path="/legal-framework"
        element={<LegalFrameworkPage />}
      />
      <Route
        path="/legal-contacts"
        element={<Navigate to="/legal-resources" replace />}
      />
      <Route
        path="/contacts"
        element={<Navigate to="/legal-resources" replace />}
      />
      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />
      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            {({ user }) => <AdminDashboard user={user} />}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <BrowserRouter>
          <ScrollToTop />
          <AppRouter />
          <FastScrollTop />
          <Toaster position="top-right" richColors />
          <InstallPrompt />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
