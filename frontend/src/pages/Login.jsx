import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { loginUser } from "../authSlice";
import axiosClient from '../utils/axiosClient';
import ThemeToggle from '../components/ThemeToggle';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import OtpInput from '../components/OtpInput';

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [credentials, setCredentials] = useState(null);
  const [preLoading, setPreLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

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

  // Initial Submit -> Pre-login credential check & trigger OTP
  const onSubmitCredentials = async (data) => {
    setPreLoading(true);
    try {
      const res = await axiosClient.post('/user/pre-login', data);
      if (res.data?.otpRequired) {
        setCredentials(data);
        setOtpStep(true);
        setTimer(300); // 5 min countdown
        toast.success("OTP sent to your email!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || 'Invalid email or password');
    } finally {
      setPreLoading(false);
    }
  };

  // Submit OTP & complete login
  const onSubmitOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP code.');
      return;
    }
    if (!credentials) return;

    try {
      await dispatch(loginUser({ ...credentials, otp })).unwrap();
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Invalid credentials or OTP');
    }
  };

  const handleResendOtp = async () => {
    if (!credentials?.emailId) return;
    setPreLoading(true);
    try {
      await axiosClient.post('/user/send-otp', { emailId: credentials.emailId });
      setTimer(300);
      toast.success("OTP resent successfully!");
    } catch (err) {
      toast.error('Failed to resend OTP code.');
    } finally {
      setPreLoading(false);
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
            <p className="mt-2 text-indigo-100 text-sm font-medium">Welcome back to the portal</p>
          </div>

          <div className="p-8">
            {!otpStep ? (
              <form onSubmit={handleSubmit(onSubmitCredentials)} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="label" htmlFor="emailId">
                    <span className="label-text font-semibold">Email Address</span>
                  </label>
                  <div className="relative">
                    <input
                      id="emailId"
                      type="email"
                      placeholder="you@example.com"
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
                  <div className="flex justify-between items-center">
                    <label className="label" htmlFor="password">
                      <span className="label-text font-semibold">Password</span>
                    </label>
                    <NavLink
                      to="/forgot-password"
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Forgot Password?
                    </NavLink>
                  </div>
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

                {/* Submit Credentials */}
                <button
                  type="submit"
                  disabled={preLoading}
                  className="btn btn-primary w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {preLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying Credentials...
                    </>
                  ) : (
                    <>
                      Continue <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Step 2: OTP Entry */
              <form onSubmit={onSubmitOtp} className="space-y-6">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mx-auto mb-2">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-base-content">Security Verification</h3>
                  <p className="text-xs text-base-content/70 mt-1">
                    Enter the 6-digit code sent to <strong className="text-primary">{credentials?.emailId}</strong>
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
                        Resend OTP
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setOtpStep(false)}
                      className="text-base-content/70 hover:text-base-content"
                    >
                      Change Email
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
                      Authenticating...
                    </>
                  ) : (
                    'Verify & Login'
                  )}
                </button>
              </form>
            )}

            {/* Signup Link */}
            <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-800 pt-6">
              <p className="text-base-content/70 text-sm">
                Don't have an account?{' '}
                <NavLink
                  to="/signup"
                  className="font-bold text-primary hover:underline"
                >
                  Sign Up
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;