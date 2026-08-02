import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import axiosClient from '../utils/axiosClient';
import ThemeToggle from '../components/ThemeToggle';
import { Edit, Trash2, Video, ArrowLeft, Search, Plus, Loader2 } from 'lucide-react';

const AdminUpdate = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems from database.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(p => p._id !== id));
    } catch (err) {
      alert('Failed to delete problem: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredProblems = problems.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tags?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content transition-colors duration-300 pb-12">
      {/* Top Navbar */}
      <nav className="bg-base-100 border-b border-base-300 px-6 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <NavLink to="/admin" className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Admin Dashboard
          </NavLink>
          <div className="flex items-center gap-4">
            <NavLink to="/admin/create" className="btn btn-sm btn-primary gap-1">
              <Plus className="w-4 h-4" /> New Problem
            </NavLink>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-base-100 rounded-3xl shadow-xl border border-base-300 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-base-300">
            <div>
              <h1 className="text-3xl font-black text-base-content">Problem Management</h1>
              <p className="text-sm text-base-content/60 mt-1">
                Edit problem metadata, update test cases, or manage video solutions
              </p>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[280px]">
              <input
                type="text"
                placeholder="Search title or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
              <Search className="w-4 h-4 text-base-content/50 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {error && (
            <div className="alert alert-error text-sm mb-6 rounded-xl p-4">
              {error}
            </div>
          )}

          {/* Table View */}
          <div className="overflow-x-auto">
            <table className="table w-full text-left">
              <thead>
                <tr className="border-b border-base-300 text-xs text-base-content/60 uppercase font-bold">
                  <th className="pb-3 px-3">#</th>
                  <th className="pb-3 px-3">Title</th>
                  <th className="pb-3 px-3">Difficulty</th>
                  <th className="pb-3 px-3">Tag</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300 font-medium text-base-content">
                {filteredProblems.map((prob, idx) => (
                  <tr key={prob._id} className="hover:bg-base-200 transition-colors">
                    <td className="py-4 px-3 text-base-content/60">{idx + 1}</td>
                    <td className="py-4 px-3 font-bold">{prob.title}</td>
                    <td className="py-4 px-3">
                      <span className={`badge ${
                        prob.difficulty?.toLowerCase() === 'easy'
                          ? 'badge-success'
                          : prob.difficulty?.toLowerCase() === 'medium'
                            ? 'badge-warning'
                            : 'badge-error'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <span className="badge badge-outline badge-primary">
                        {prob.tags}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <NavLink
                          to={`/admin/edit/${prob._id}`}
                          className="btn btn-xs btn-outline btn-primary gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </NavLink>

                        <NavLink
                          to={`/admin/upload/${prob._id}`}
                          className="btn btn-xs btn-outline btn-secondary gap-1"
                        >
                          <Video className="w-3.5 h-3.5" /> Video Solution
                        </NavLink>

                        <button
                          onClick={() => handleDelete(prob._id, prob.title)}
                          className="btn btn-xs btn-outline btn-error gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdate;
