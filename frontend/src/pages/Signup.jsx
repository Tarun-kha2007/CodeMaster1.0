import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser } from '../authSlice';
import axiosClient from '../utils/axiosClient';
import ThemeToggle from '../components/ThemeToggle';
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import OtpInput from '../components/OtpInput';

const signupSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  emailId: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState(null);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Remove useEffect error listener to prevent duplicate notifications on refresh

  // Step 1: Handle Initial Registration Info & Send OTP
  const onSubmitDetails = async (data) => {
    setSendOtpLoading(true);
    try {
      await axiosClient.post('/user/send-otp', { emailId: data.emailId });
      setFormData(data);
      setOtpStep(true);
      setTimer(300); // 5 min countdown
      toast.success("Verification code sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || 'Failed to send verification code to this email.');
    } finally {
      setSendOtpLoading(false);
    }
  };

  // Step 2: Handle Final OTP verification & user registration
  const onSubmitOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter the 6-digit verification code.');
      return;
    }
    if (!formData) return;

    try {
      await dispatch(registerUser({ ...formData, otp })).unwrap();
      toast.success("Account created successfully!");
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Registration failed');
    }
  };

  const handleResendOtp = async () => {
    if (!formData?.emailId) return;
    setSendOtpLoading(true);
    try {
      await axiosClient.post('/user/send-otp', { emailId: formData.emailId });
      setTimer(300);
      toast.success("Verification code resent successfully!");
    } catch (err) {
      toast.error('Failed to resend verification code.');
    } finally {
      setSendOtpLoading(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4 transition-colors duration-300 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className="card bg-base-100 shadow-2xl overflow-hidden border border-base-300 transition-all duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-center text-white relative">
            <img src="/logo.png" alt="CodeMaster Logo" className="w-16 h-16 mx-auto mb-3 object-contain rounded-2xl bg-white p-2.5 shadow-lg border border-white/20" />
            <h2 className="text-4xl font-black tracking-tight">
              <span className="text-yellow-300">Code</span>Master
            </h2>
            <p className="mt-2 text-indigo-100 text-sm font-medium">Create your developer account</p>
          </div>

          <div className="p-8">
            {!otpStep ? (
              <form onSubmit={handleSubmit(onSubmitDetails)} className="space-y-5">
                {/* First Name */}
                <div>
                  <label className="label" htmlFor="firstName">
                    <span className="label-text font-semibold">First Name</span>
                  </label>
                  <div className="relative">
                    <input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      className={`input input-bordered w-full pl-11 rounded-xl font-semibold bg-base-200 ${errors.firstName ? 'input-error' : ''} focus:outline-none transition-all`}
                      {...register('firstName')}
                    />
                    <User className="w-5 h-5 text-base-content/50 absolute left-3.5 top-3.5" />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-error font-medium">{errors.firstName.message}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="label" htmlFor="emailId">
                    <span className="label-text font-semibold">Email Address</span>
                  </label>
                  <div className="relative">
                    <input
                      id="emailId"
                      type="email"
                      placeholder="john@example.com"
                      className={`input input-bordered w-full pl-11 rounded-xl font-semibold bg-base-200 ${errors.emailId ? 'input-error' : ''} focus:outline-none transition-all`}
                      {...register('emailId')}
                    />
                    <Mail className="w-5 h-5 text-base-content/50 absolute left-3.5 top-3.5" />
                  </div>
                  {errors.emailId && (
                    <p className="mt-1 text-xs text-error font-medium">{errors.emailId.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="label" htmlFor="password">
                    <span className="label-text font-semibold">Password</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`input input-bordered w-full pl-11 pr-11 rounded-xl font-semibold bg-base-200 ${errors.password ? 'input-error' : ''} focus:outline-none transition-all`}
                      {...register('password')}
                    />
                    <Lock className="w-5 h-5 text-base-content/50 absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      className="absolute right-3.5 top-3.5 text-base-content/50 hover:text-primary transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-error font-medium">{errors.password.message}</p>
                  )}
                </div>

                {/* Submit Details Button */}
                <button
                  type="submit"
                  disabled={sendOtpLoading}
                  className="btn btn-primary w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mt-2"
                >
                  {sendOtpLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Verify Email with OTP <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Step 2: Verification Code Input */
              <form onSubmit={onSubmitOtp} className="space-y-6">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mx-auto mb-2">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-base-content">Verify Email Address</h3>
                  <p className="text-xs text-base-content/70 mt-1">
                    Enter the 6-digit OTP code sent to <strong className="text-primary">{formData?.emailId}</strong>
                  </p>
                </div>

                <div>
                  <OtpInput length={6} value={otp} onChange={setOtp} />
                  <div className="flex justify-between items-center mt-6 text-xs">
                    {timer > 0 ? (
                      <span className="text-base-content/70">Expires in {formatTimer(timer)}</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-primary font-semibold hover:underline"
                      >
                        Resend Code
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setOtpStep(false)}
                      className="text-base-content/70 hover:text-base-content"
                    >
                      Edit Info
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Verify & Create Account'
                  )}
                </button>
              </form>
            )}

            {/* Login Link */}
            <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-800 pt-6">
              <p className="text-base-content/70 text-sm">
                Already have an account?{' '}
                <NavLink
                  to="/login"
                  className="font-bold text-primary hover:underline"
                >
                  Login
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;