import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { API } from "../App";

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState("login"); // login or register
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showGoogleHint, setShowGoogleHint] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (mode === "register" && !formData.name) {
      newErrors.name = "Name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const response = await axios.post(`${API}${endpoint}`, formData);
      
      toast.success(mode === "login" ? "Welcome back!" : "Account created successfully!");
      onSuccess(response.data);
      onClose();
    } catch (error) {
      const message = error.response?.data?.detail || "Authentication failed. Please try again.";
      
      // Handle specific error cases with clearer messages
      if (message.includes("Google login") || message.includes("Google")) {
        toast.error("This email is linked to Google. Please close this and use 'Sign in with Google' instead.", {
          duration: 5000
        });
        setShowGoogleHint(true);
      } else if (message.includes("already registered") || message.includes("already exists")) {
        toast.error("This email is already registered. Try signing in instead.");
        setMode("login");
      } else if (message.includes("Invalid email or password") || message.includes("invalid")) {
        toast.error("Invalid email or password. Please check your credentials.");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: "", password: "", name: "" });
    setErrors({});
    setShowGoogleHint(false);
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle 
            className="text-2xl font-bold text-center"
            style={{ fontFamily: 'Crimson Pro, serif' }}
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {showGoogleHint && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>This email uses Google login.</strong> Please close this dialog and click "Sign in with Google" to continue.
              </p>
            </div>
          )}
          
          {mode === "register" && (
            <div>
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
                className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                data-testid="auth-name-input"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
          )}
          
          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-500" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
              data-testid="auth-email-input"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-500" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className={`mt-1 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                data-testid="auth-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white hover:bg-slate-800"
            data-testid="auth-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {mode === "login" ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              mode === "login" ? "Sign In" : "Create Account"
            )}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-slate-600">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={switchMode}
              className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="/terms" className="text-blue-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
