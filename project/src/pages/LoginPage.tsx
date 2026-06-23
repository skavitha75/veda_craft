import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/products/WhatsApp_Image_2026-06-19_at_11.31.57_AM.jpeg';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();
  const { login } = useAuth();
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login(email);
      navigate(redirect);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center relative overflow-hidden">
      
      {/* Subtle Background Decorations */}
      <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-50px] left-20 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl z-10 mx-4 border border-gray-100">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logoImg} alt="Vedacraft" className="h-24 object-contain" />
        </div>

        {/* Header Text */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1c6b32] mb-2">{t('login.welcome')}</h2>
          <p className="text-gray-500 text-sm">{t('login.subtitle')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-[#1c6b32] mb-1.5">{t('login.email')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[#1c6b32]" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1c6b32] focus:border-[#1c6b32] transition-colors"
                placeholder={t('login.emailPlaceholder')}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-[#1c6b32] mb-1.5">{t('login.password')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#1c6b32]" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1c6b32] focus:border-[#1c6b32] transition-colors"
                placeholder={t('login.passwordPlaceholder')}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <a href="#" className="text-sm font-medium text-[#1c6b32] hover:underline">
              {t('login.forgotPassword')}
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#f5b027] hover:bg-[#e09e20] text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md"
          >
            {t('login.loginButton')}
          </button>

        </form>

        {/* Divider */}
        <div className="mt-8 mb-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">{t('login.orContinueWith')}</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="font-medium text-gray-700">Google</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.365 21.444c-1.258.914-2.544.896-3.805.05-1.29-.86-2.316-.86-3.626 0-1.35.89-2.518.868-3.722-.05-1.182-.906-2.215-2.22-3.04-3.844-1.748-3.44-2.128-6.953-.615-9.356 1.04-1.65 2.654-2.66 4.415-2.695 1.455-.03 2.81.95 3.59.95.808 0 2.45-1.196 4.21-1.026 1.83.176 3.4.88 4.485 2.464-3.87 2.274-3.195 7.155.85 8.796-1.04 2.503-2.66 4.885-3.766 5.815zM15.112 3.82c-.93 1.12-2.32 1.835-3.6 1.76-.176-1.306.406-2.66 1.254-3.526.85-1.01 2.226-1.68 3.476-1.65.196 1.344-.24 2.376-1.13 3.416z" />
            </svg>
            <span className="font-medium text-gray-700">Apple</span>
          </button>
        </div>

        {/* Footer Text */}
        <div className="mt-8 text-center text-sm text-gray-600">
          {t('login.noAccount')}{' '}
          <a href="#" className="font-bold text-[#1c6b32] hover:underline">
            {t('login.signUp')}
          </a>
        </div>

      </div>
    </div>
  );
}
