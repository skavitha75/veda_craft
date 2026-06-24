import React, { useState } from 'react';
import { Mail, Phone, ChevronRight, CheckCircle2, Leaf, ShieldCheck, Heart } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/products/WhatsApp_Image_2026-06-19_at_11.31.57_AM.jpeg';
import bgImg from '../assets/products/login_eco_bg.png'; // New eco products collage

type LoginMethod = 'mobile' | 'email';
type Step = 'input' | 'verify';

export default function LoginPage() {
  const [method, setMethod] = useState<LoginMethod>('mobile');
  const [step, setStep] = useState<Step>('input');
  const [inputValue, setInputValue] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (method === 'mobile') {
      const isNum = /^\d{10}$/.test(inputValue);
      if (!isNum) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
      }
    } else {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue);
      if (!isEmail) {
        setError('Please enter a valid email address.');
        return;
      }
    }
    
    // Proceed to OTP step
    setStep('verify');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length !== 4) {
      setError('Please enter a valid 4-digit OTP.');
      return;
    }
    
    // Success: Mock login with inputValue
    login(inputValue);
    navigate(redirect);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // limit to 1 char
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-white flex flex-col lg:flex-row relative overflow-hidden">

      {/* Mobile/Tablet Top Banner (visible below lg) */}
      <div className="lg:hidden w-full relative overflow-hidden" style={{ height: '200px' }}>
        <img src={bgImg} alt="Eco Friendly" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-green-900/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
          <img src={logoImg} alt="Vedha Craft" className="h-14 bg-white/90 rounded-xl px-3 py-1 object-contain" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white text-center leading-tight">
            Welcome to Veda Craft
          </h1>
          <p className="text-xs sm:text-sm text-white/80 text-center max-w-xs">
            Eco-friendly products for a healthy you and a happy planet.
          </p>
          {/* Mini feature badges */}
          <div className="flex gap-4 mt-1">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
              <Leaf className="w-3 h-3 text-white" />
              <span className="text-[10px] text-white font-semibold">Eco</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
              <Heart className="w-3 h-3 text-white" />
              <span className="text-[10px] text-white font-semibold">Handcrafted</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
              <ShieldCheck className="w-3 h-3 text-white" />
              <span className="text-[10px] text-white font-semibold">Trusted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Left Section - Brand (lg and above) */}
      <div className="hidden lg:flex w-1/2 relative bg-green-50 flex-col p-12 justify-between border-r border-green-100">
        <div className="absolute inset-0 overflow-hidden">
          <img src={bgImg} alt="Eco Friendly" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-green-900/40" />
        </div>
        
        <div className="relative z-10">
          <img src={logoImg} alt="Vedha Craft" className="h-20 mb-12 bg-white/90 rounded-xl px-3 py-1" />
          
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-4">
            Welcome Back<br />to Veda Craft
          </h1>
          <div className="w-16 h-1 bg-white/70 mb-6"></div>
          <p className="text-lg text-white/85 max-w-md font-medium">
            Discover sustainable products and support eco-friendly living.
          </p>
        </div>
        
        <div className="relative z-10 flex gap-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-sm border border-white/30">
              <Leaf className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-white">Eco Friendly</p>
              <p className="text-xs text-white/80 font-medium">Sustainable & Natural</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-sm border border-white/30">
              <Heart className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-white">Handcrafted</p>
              <p className="text-xs text-white/80 font-medium">Made with Care</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-sm border border-white/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-white">Better Future</p>
              <p className="text-xs text-white/80 font-medium">For Our Planet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 bg-gray-50 lg:bg-white relative z-10">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 lg:border-none lg:shadow-none">
          


          {step === 'input' ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Login to Your Account</h2>
                <p className="text-sm text-gray-500">Enter your mobile number or email to continue</p>
              </div>

              {/* Tabs */}
              <div className="flex p-1 bg-gray-50 rounded-xl mb-8 border border-gray-200">
                <button
                  type="button"
                  onClick={() => { setMethod('mobile'); setInputValue(''); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                    method === 'mobile' ? 'bg-white text-[#1c6b32] shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  Mobile Number
                </button>
                <button
                  type="button"
                  onClick={() => { setMethod('email'); setInputValue(''); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                    method === 'email' ? 'bg-white text-[#1c6b32] shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Email Address
                </button>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {method === 'mobile' ? 'Mobile Number' : 'Email Address'}
                  </label>
                  <div className="relative flex shadow-sm">
                    {method === 'mobile' && (
                      <div className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-600 text-sm font-medium">
                        +91
                      </div>
                    )}
                    <input
                      type={method === 'mobile' ? 'tel' : 'email'}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={method === 'mobile' ? 'Enter your mobile number' : 'Enter your email'}
                      className={`w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c6b32]/20 focus:border-[#1c6b32] transition-colors ${
                        method === 'mobile' ? 'rounded-r-xl border-l-0' : 'rounded-xl'
                      }`}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1c6b32] hover:bg-[#155228] text-white font-semibold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Request OTP
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Verification Step */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h2>
                <p className="text-sm text-gray-500">
                  Code sent to <span className="font-semibold text-gray-800">{inputValue}</span>
                </p>
                <button 
                  onClick={() => setStep('input')}
                  className="text-sm text-[#1c6b32] hover:text-[#155228] font-medium mt-2"
                >
                  Change {method}
                </button>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-8">
                <div className="flex justify-center gap-4">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-14 h-14 text-center text-xl font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c6b32]/20 focus:border-[#1c6b32] transition-colors shadow-sm"
                      required
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1c6b32] hover:bg-[#155228] text-white font-semibold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Verify & Login
                </button>
                
                <p className="text-center text-sm text-gray-500">
                  Didn't receive the code? <button type="button" className="text-[#1c6b32] font-semibold ml-1">Resend OTP</button>
                </p>
              </form>
            </>
          )}

          {/* Social Login */}
          {step === 'input' && (
            <>
              <div className="mt-8 mb-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-white text-gray-500 font-medium rounded-full border border-gray-200 py-1">OR</span>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700 shadow-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
              </div>
            </>
          )}

          <div className="mt-10 flex items-center justify-center gap-6 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-[#1c6b32]" /> Secure Login
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#1c6b32]" /> Data is safe with us
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
