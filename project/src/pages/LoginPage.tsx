import React, { useState } from 'react';
import { Mail, Phone, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/products/WhatsApp_Image_2026-06-19_at_11.31.57_AM.jpeg';
import bgImg from '../assets/products/login_eco_bg.png'; // New eco products collage
import { supabase } from '../lib/supabase';

type LoginMethod = 'mobile' | 'email';
type Step = 'input' | 'verify';

export default function LoginPage() {
  const [method, setMethod] = useState<LoginMethod>('mobile');
  const [step, setStep] = useState<Step>('input');
  const [inputValue, setInputValue] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (method === 'mobile') {
      const isNum = /^\d{10}$/.test(inputValue);
      if (!isNum) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
      }

      // Send SMS OTP via Supabase + Twilio
      const { error: signInError } = await supabase.auth.signInWithOtp({
        phone: '+91' + inputValue,
        options: {
          shouldCreateUser: true,
        }
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }
    } else {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue);
      if (!isEmail) {
        setError('Please enter a valid email address.');
        return;
      }
      
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: inputValue,
        options: {
          shouldCreateUser: true,
        }
      });
      
      if (signInError) {
        setError(signInError.message);
        return;
      }
    }
    
    // Proceed to OTP step
    setStep('verify');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    
    if (method === 'email') {
      if (code.length !== 6) {
        setError('Please enter a valid 6-digit OTP.');
        return;
      }
      
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: inputValue,
        token: code,
        type: 'email'
      });
      
      if (verifyError) {
        setError(verifyError.message);
        return;
      }
      navigate(redirect);
    } else {
      if (code.length !== 6) {
        setError('Please enter the 6-digit OTP sent to your mobile.');
        return;
      }

      // Verify SMS OTP via Supabase
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: '+91' + inputValue,
        token: code,
        type: 'sms',
      });

      if (verifyError) {
        setError(verifyError.message);
        return;
      }

      navigate(redirect);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // limit to 1 char
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-white flex flex-col lg:flex-row relative overflow-hidden">
      
      {/* Desktop Left Section - Just the image */}
      <div className="hidden lg:block w-1/2 relative bg-gray-50 overflow-hidden">
        <img src={bgImg} alt="Eco Friendly" className="w-full h-full object-cover" />
      </div>

      {/* Mobile Top Banner (visible below lg) */}
      <div className="lg:hidden w-full relative overflow-hidden" style={{ height: '200px' }}>
        <img src={bgImg} alt="Eco Friendly" className="w-full h-full object-cover object-center" />
      </div>

      {/* Right Section - Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white relative z-10">
        
        {/* Leaf Decoration Bottom Right */}
        <div className="hidden sm:block absolute bottom-0 right-0 opacity-[0.15] pointer-events-none transform translate-x-1/4 translate-y-1/4">
          <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke="#346b3f" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 1 8.3s-2.9 6.25-5 8.35A7 7 0 0 1 11 20z" />
            <path d="M15 11l-4 4" />
          </svg>
        </div>

        <div className="w-full max-w-[420px] bg-white p-2 relative z-10">
          
          <div className="flex justify-center mb-6">
            <img src={logoImg} alt="Veda Craft" className="h-28 object-contain" />
          </div>

          {step === 'input' ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-[22px] font-bold text-gray-900 mb-1.5">Login to Your Account</h2>
                <p className="text-[13px] text-gray-500">Enter your mobile number or email to continue</p>
              </div>

              {/* Tabs */}
              <div className="flex bg-gray-50 rounded-lg mb-8 p-1">
                <button
                  type="button"
                  onClick={() => { setMethod('mobile'); setInputValue(''); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-all rounded-md ${
                    method === 'mobile' ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] border-b-2 border-[#346b3f] text-[#346b3f]' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  Mobile Number
                </button>
                <button
                  type="button"
                  onClick={() => { setMethod('email'); setInputValue(''); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-all rounded-md ${
                    method === 'email' ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] border-b-2 border-[#346b3f] text-[#346b3f]' : 'text-gray-500 hover:text-gray-700'
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

              <form onSubmit={handleRequestOtp} className="space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-gray-800 mb-2">
                    {method === 'mobile' ? 'Mobile Number' : 'Email Address'}
                  </label>
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:border-[#346b3f] focus-within:ring-1 focus-within:ring-[#346b3f] transition-all">
                    {method === 'mobile' && (
                      <div className="flex items-center gap-1.5 px-4 py-3 bg-white border-r border-gray-200 text-gray-800 text-[13px] font-bold">
                        +91 <ChevronRight className="w-3.5 h-3.5 rotate-90 text-gray-500" />
                      </div>
                    )}
                    <input
                      type={method === 'mobile' ? 'tel' : 'email'}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={method === 'mobile' ? 'Enter your mobile number' : 'Enter your email'}
                      className="w-full px-4 py-3 text-[13px] focus:outline-none text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#346b3f] hover:bg-[#285331] text-white font-semibold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm text-sm"
                >
                  Request OTP <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Verification Step */}
              <div className="text-center mb-8">
                <h2 className="text-[22px] font-bold text-gray-900 mb-1.5">Verify OTP</h2>
                <p className="text-[13px] text-gray-500">
                  Code sent to <span className="font-semibold text-gray-800">{inputValue}</span>
                </p>
                <button 
                  onClick={() => setStep('input')}
                  className="text-[13px] text-[#346b3f] hover:text-[#285331] font-semibold mt-2"
                >
                  Change {method}
                </button>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex justify-center gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-12 h-12 text-center text-lg font-bold border border-gray-200 rounded-lg focus:outline-none focus:border-[#346b3f] focus:ring-1 focus:ring-[#346b3f] transition-colors"
                      required
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#346b3f] hover:bg-[#285331] text-white font-semibold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm text-sm"
                >
                  Verify & Login
                </button>
                
                <p className="text-center text-[13px] text-gray-500">
                  Didn't receive the code? <button type="button" className="text-[#346b3f] font-bold ml-1 hover:underline">Resend OTP</button>
                </p>
              </form>
            </>
          )}

          {/* Social Login */}
          {step === 'input' && (
            <>
              <div className="mt-6 mb-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white text-gray-400 text-[10px] font-bold rounded-full border border-gray-200 w-8 h-8 flex items-center justify-center">OR</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  type="button"
                  onClick={async () => { 
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: {
                        redirectTo: `${window.location.origin}${redirect}`
                      }
                    });
                    if (error) {
                      setError(error.message);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-[13px] font-bold text-gray-800 bg-white"
                >
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

          <div className="mt-8 flex items-center justify-center gap-6 text-[12px] text-gray-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#346b3f]" /> Secure Login
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#346b3f]" /> Data is safe with us
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
