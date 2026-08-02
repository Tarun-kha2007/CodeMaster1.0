import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import axiosClient from '../utils/axiosClient';
import ThemeToggle from '../components/ThemeToggle';
import { KeyRound, Mail, ShieldCheck, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify & Reset
  const [emailId, setEmailId] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!emailId) {
      setError('Please enter your registered email address.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axiosClient.post('/user/send-otp', { emailId });
      setSuccessMsg('OTP code sent to your email address!');
      setStep(2);
      setTimer(300); // 5 min countdown
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await axiosClient.post('/user/forgot-password', {
        emailId,
        password: newPassword,
        otp
      });
      setSuccessMsg('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Check your OTP and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-base-200 transition-colors duration-300 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="card w-full max-w-md bg-base-100 shadow-2xl overflow-hidden border border-base-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-center text-white relative">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <KeyRound className="w-8 h-8 text-yellow-300" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Forgot Password</h2>
          <p className="text-indigo-100 text-sm mt-1">Reset your account security credentials</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 alert alert-error shadow-sm rounded-xl text-sm flex items-start gap-3">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 alert alert-success shadow-sm rounded-xl text-sm flex items-center gap-3 text-success-content">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Email Address</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    placeholder="Enter your account email"
                    className="input input-bordered w-full pl-11 rounded-xl font-semibold bg-base-200 focus:outline-none transition-all"
                  />
                  <Mail className="w-5 h-5 text-base-content/50 absolute left-3.5 top-3.5" />
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
                    Sending OTP...
                  </>
                ) : (
                  'Send Verification OTP'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Verification Code (6-digit OTP)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="input input-bordered w-full tracking-widest text-center text-xl font-mono py-3 bg-base-200 rounded-xl focus:outline-none"
                  />
                  <ShieldCheck className="w-5 h-5 text-base-content/50 absolute left-3.5 top-3.5" />
                </div>
                {timer > 0 ? (
                  <p className="text-xs text-base-content/70 mt-1">Code expires in {formatTimer(timer)}</p>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-xs text-primary hover:underline mt-1 font-semibold"
                  >
                    Resend OTP Code
                  </button>
                )}
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">New Password</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="input input-bordered w-full rounded-xl font-medium bg-base-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Confirm New Password</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="input input-bordered w-full rounded-xl font-medium bg-base-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-xs text-base-content/70 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="checkbox checkbox-xs checkbox-primary mr-2"
                  />
                  Show Password
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-base-300 text-center">
            <NavLink
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-focus transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
