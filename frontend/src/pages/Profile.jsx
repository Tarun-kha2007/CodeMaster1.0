import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import axiosClient from '../utils/axiosClient';
import ThemeToggle from '../components/ThemeToggle';
import { User, Shield, CheckCircle2, Award, Lock, Key, ArrowLeft, Loader2, BarChart2, Flame } from 'lucide-react';

function Profile() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);
  const [pwdError, setPwdError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/user/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Unable to load user profile statistics.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPwdError('All fields are required.');
      return;
    }
    if (newPassword.length < 8) {
      setPwdError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match.');
      return;
    }

    setPwdLoading(true);
    setPwdError(null);
    setPwdMsg(null);

    try {
      const { data } = await axiosClient.post('/user/reset-password', {
        currentPassword,
        newPassword
      });
      setPwdMsg(data.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwdError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPwdLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const acceptanceRate = stats?.totalSubmissions
    ? Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-base-200 text-base-content transition-colors duration-300">
      {/* Header Bar */}
      <nav className="bg-base-100 border-b border-base-300 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </NavLink>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* User Card Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl font-black shadow-inner">
              {stats?.user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black">{stats?.user?.firstName}</h1>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider uppercase">
                  {stats?.user?.role || 'Developer'}
                </span>
              </div>
              <p className="text-indigo-100 mt-1 flex items-center gap-2 text-sm">
                <User className="w-4 h-4" /> {stats?.user?.emailId}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3 text-center">
              <div className="text-2xl font-black">{stats?.totalSolved || 0}</div>
              <div className="text-xs text-indigo-100 font-medium">Solved</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3 text-center">
              <div className="text-2xl font-black">{acceptanceRate}%</div>
              <div className="text-xs text-indigo-100 font-medium">Acceptance</div>
            </div>
          </div>
        </div>

        {/* Grid Stats & Password Reset */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Performance Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Breakdown Card */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-md border border-base-300">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-base-content">
                <BarChart2 className="w-6 h-6 text-primary" />
                Problem Solving Breakdown
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {/* Easy */}
                <div className="bg-success/10 border border-success/30 rounded-2xl p-5 text-center">
                  <div className="text-success text-sm font-semibold mb-1">Easy</div>
                  <div className="text-3xl font-black text-success">
                    {stats?.easySolved || 0}
                  </div>
                </div>

                {/* Medium */}
                <div className="bg-warning/10 border border-warning/30 rounded-2xl p-5 text-center">
                  <div className="text-warning text-sm font-semibold mb-1">Medium</div>
                  <div className="text-3xl font-black text-warning">
                    {stats?.mediumSolved || 0}
                  </div>
                </div>

                {/* Hard */}
                <div className="bg-error/10 border border-error/30 rounded-2xl p-5 text-center">
                  <div className="text-error text-sm font-semibold mb-1">Hard</div>
                  <div className="text-3xl font-black text-error">
                    {stats?.hardSolved || 0}
                  </div>
                </div>
              </div>

              {/* Submission Activity */}
              <div className="border-t border-base-300 pt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4 bg-base-200 p-4 rounded-xl">
                  <div className="p-3 bg-primary/20 rounded-xl text-primary">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-base-content">{stats?.totalSubmissions || 0}</div>
                    <div className="text-xs text-base-content/60 font-medium">Total Submissions</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-base-200 p-4 rounded-xl">
                  <div className="p-3 bg-success/20 rounded-xl text-success">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-base-content">{stats?.acceptedSubmissions || 0}</div>
                    <div className="text-xs text-base-content/60 font-medium">Accepted Submissions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Password Reset */}
          <div className="lg:col-span-1">
            <div className="bg-base-100 rounded-2xl p-6 shadow-md border border-base-300 sticky top-10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-base-content">
                <Lock className="w-6 h-6 text-primary" />
                Change Password
              </h2>

              {pwdError && (
                <div className="alert alert-error text-xs p-3 rounded-xl mb-4">
                  <span>{pwdError}</span>
                </div>
              )}

              {pwdMsg && (
                <div className="alert alert-success text-xs p-3 rounded-xl mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> <span>{pwdMsg}</span>
                </div>
              )}

              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-base-content/80 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input input-bordered w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-base-content/80 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 chars"
                    className="input input-bordered w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-base-content/80 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="input input-bordered w-full"
                  />
                </div>

                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="btn btn-primary w-full mt-2"
                >
                  {pwdLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
