import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/products/WhatsApp_Image_2026-06-19_at_11.31.57_AM.jpeg';

type Mode = 'login' | 'signup';

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('login');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  // Sign-up fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [showSignupPwd, setShowSignupPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // Error / success
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  /* ─── Handlers ─── */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginEmail || !loginPassword) {
      setError('Please enter your email and password.');
      return;
    }
    login(loginEmail);
    navigate(redirect);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!signupName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (signupPassword !== signupConfirm) {
      setError('Passwords do not match.');
      return;
    }

    // No backend — use AuthContext login with name
    login(signupEmail, signupName.trim());
    navigate(redirect);
  };

  const switchMode = (m: Mode) => {
    setError('');
    setMode(m);
  };

  /* ─── Shared input class ─── */
  const inputCls =
    'w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#1c6b32] focus:border-[#1c6b32] transition-colors';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
      <div className="absolute bottom-[-50px] left-20 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl z-10 mx-4 border border-gray-100">
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <img src={logoImg} alt="Vedacraft" className="h-20 object-contain" />
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-lg border border-gray-200 p-1 mb-6 bg-gray-50">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all
              ${mode === 'login'
                ? 'bg-white text-[#1c6b32] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all
              ${mode === 'signup'
                ? 'bg-white text-[#1c6b32] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ═══════════ LOGIN FORM ═══════════ */}
        {mode === 'login' && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-[#1c6b32]">Welcome Back!</h2>
              <p className="text-gray-500 text-sm mt-1">Login to continue your journey with Vedacraft</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#1c6b32] mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-[#1c6b32]" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className={inputCls}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#1c6b32] mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[#1c6b32]" />
                  </div>
                  <input
                    id="login-password"
                    type={showLoginPwd ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#1c6b32] focus:border-[#1c6b32] transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowLoginPwd(!showLoginPwd)}
                  >
                    {showLoginPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <a href="#" className="text-xs font-medium text-[#1c6b32] hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-[#f5b027] hover:bg-[#e09e20] text-white font-bold py-3 rounded-lg transition-colors shadow-md"
              >
                Login
              </button>
            </form>

            {/* Divider + social */}
            <Divider />
            <SocialButtons />

            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="font-bold text-[#1c6b32] hover:underline"
              >
                Sign Up
              </button>
            </p>
          </>
        )}

        {/* ═══════════ SIGN UP FORM ═══════════ */}
        {mode === 'signup' && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-[#1c6b32]">Create Account</h2>
              <p className="text-gray-500 text-sm mt-1">Join Vedacraft and start shopping</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-[#1c6b32] mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-[#1c6b32]" />
                  </div>
                  <input
                    id="signup-name"
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className={inputCls}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#1c6b32] mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-[#1c6b32]" />
                  </div>
                  <input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className={inputCls}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#1c6b32] mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[#1c6b32]" />
                  </div>
                  <input
                    id="signup-password"
                    type={showSignupPwd ? 'text' : 'password'}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#1c6b32] focus:border-[#1c6b32] transition-colors"
                    placeholder="Min. 6 characters"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowSignupPwd(!showSignupPwd)}
                  >
                    {showSignupPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-[#1c6b32] mb-1.5">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[#1c6b32]" />
                  </div>
                  <input
                    id="signup-confirm"
                    type={showConfirmPwd ? 'text' : 'password'}
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#1c6b32] focus:border-[#1c6b32] transition-colors"
                    placeholder="Re-enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  >
                    {showConfirmPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1c6b32] hover:bg-[#155228] text-white font-bold py-3 rounded-lg transition-colors shadow-md mt-2"
              >
                Create Account
              </button>
            </form>

            {/* Divider + social */}
            <Divider />
            <SocialButtons />

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="font-bold text-[#1c6b32] hover:underline"
              >
                Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Small shared components ── */
function Divider() {
  return (
    <div className="mt-6 mb-4 relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="px-2 bg-white text-gray-400">or continue with</span>
      </div>
    </div>
  );
}

function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        <span className="font-medium text-gray-700">Google</span>
      </button>
      <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.365 21.444c-1.258.914-2.544.896-3.805.05-1.29-.86-2.316-.86-3.626 0-1.35.89-2.518.868-3.722-.05-1.182-.906-2.215-2.22-3.04-3.844-1.748-3.44-2.128-6.953-.615-9.356 1.04-1.65 2.654-2.66 4.415-2.695 1.455-.03 2.81.95 3.59.95.808 0 2.45-1.196 4.21-1.026 1.83.176 3.4.88 4.485 2.464-3.87 2.274-3.195 7.155.85 8.796-1.04 2.503-2.66 4.885-3.766 5.815zM15.112 3.82c-.93 1.12-2.32 1.835-3.6 1.76-.176-1.306.406-2.66 1.254-3.526.85-1.01 2.226-1.68 3.476-1.65.196 1.344-.24 2.376-1.13 3.416z" />
        </svg>
        <span className="font-medium text-gray-700">Apple</span>
      </button>
    </div>
  );
}
