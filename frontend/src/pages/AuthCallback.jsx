import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const processAuth = async () => {
      // Get session_id from hash
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const sessionId = params.get("session_id");
      
      console.log("[AuthCallbackPage] Processing, hash:", hash);
      console.log("[AuthCallbackPage] session_id:", sessionId ? "found" : "missing");

      if (sessionId) {
        try {
          const response = await axios.post(`${API}/auth/session`, { 
            session_id: sessionId 
          });
          
          console.log("[AuthCallbackPage] Success:", response.data?.email);
          
          // Store token
          if (response.data?.session_token) {
            localStorage.setItem('session_token', response.data.session_token);
          }
          
          // Go to dashboard
          const userData = { ...response.data };
          delete userData.session_token;
          
          navigate("/dashboard", { state: { user: userData }, replace: true });
        } catch (err) {
          console.error("[AuthCallbackPage] Error:", err);
          navigate("/", { replace: true });
        }
      } else {
        console.log("[AuthCallbackPage] No session_id");
        navigate("/", { replace: true });
      }
    };

    processAuth();
  }, [navigate]);

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "#f8fafc"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 48,
          height: 48,
          border: "3px solid #e2e8f0",
          borderTopColor: "#0f172a",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto"
        }} />
        <p style={{ marginTop: 16, color: "#64748b" }}>Signing you in...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
