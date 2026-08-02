import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router';
import Editor from '@monaco-editor/react';
import axiosClient from '../utils/axiosClient';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { Plus, Trash2, Save, ArrowLeft, Code, Layers, FileText, CheckCircle, Loader2 } from 'lucide-react';

const AdminPanel = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isEditMode = !!problemId;

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [tags, setTags] = useState('array');
  const [companies, setCompanies] = useState('');

  // Visible Test Cases
  const [visibleTestCases, setVisibleTestCases] = useState([
    { input: '', output: '', explanation: '' }
  ]);

  // Hidden Test Cases
  const [hiddenTestCases, setHiddenTestCases] = useState([
    { input: '', output: '' }
  ]);

  // Start Codes (for multiple languages)
  const [activeLang, setActiveLang] = useState('javascript');
  const [startCodeMap, setStartCodeMap] = useState({
    javascript: '// Start code for JavaScript\nfunction solution() {\n  \n}',
    cpp: '// Start code for C++\n#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n        \n    }\n};',
    java: '// Start code for Java\nclass Solution {\n    public void solve() {\n        \n    }\n}',
    python: '# Start code for Python\nclass Solution:\n    def solve(self):\n        pass'
  });

  // Reference Solutions (for multiple languages)
  const [referenceSolutionMap, setReferenceSolutionMap] = useState({
    javascript: '// Reference solution for JavaScript\nfunction solution() {\n  return true;\n}',
    cpp: '// Reference solution for C++\n#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n        cout << "ok";\n    }\n};',
    java: '// Reference solution for Java\nclass Solution {\n    public void solve() {\n        System.out.println("ok");\n    }\n}',
    python: '# Reference solution for Python\nclass Solution:\n    def solve(self):\n        return True'
  });

  useEffect(() => {
    if (isEditMode) {
      fetchProblemDetails();
    }
  }, [problemId]);

  const fetchProblemDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get(`/problem/problemById/${problemId}`);
      setTitle(data.title || '');
      setDescription(data.description || '');
      setDifficulty(data.difficulty?.toLowerCase() || 'easy');
      setTags(data.tags || '');
      setCompanies(data.companies ? data.companies.join(', ') : '');

      if (data.visibleTestCases?.length > 0) {
        setVisibleTestCases(data.visibleTestCases);
      }
      if (data.hiddenTestCases?.length > 0) {
        setHiddenTestCases(data.hiddenTestCases);
      }

      // Populate Start Codes
      if (data.startCode?.length > 0) {
        const newStartMap = { ...startCodeMap };
        data.startCode.forEach(sc => {
          const l = sc.language?.toLowerCase();
          if (l && newStartMap[l] !== undefined) {
            newStartMap[l] = sc.initialCode;
          }
        });
        setStartCodeMap(newStartMap);
      }

      // Populate Reference Solutions
      if (data.referenceSolution?.length > 0) {
        const newRefMap = { ...referenceSolutionMap };
        data.referenceSolution.forEach(rs => {
          const l = rs.language?.toLowerCase();
          if (l && newRefMap[l] !== undefined) {
            newRefMap[l] = rs.completeCode;
          }
        });
        setReferenceSolutionMap(newRefMap);
      }
    } catch (err) {
      setError('Failed to fetch problem details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setMessage(null);
    setError(null);

    try {
      const companiesArray = companies.split(',').map(c => c.trim()).filter(Boolean);

      const startCodeArray = Object.keys(startCodeMap).map(lang => ({
        language: lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : lang.charAt(0).toUpperCase() + lang.slice(1),
        initialCode: startCodeMap[lang]
      }));

      const referenceSolutionArray = Object.keys(referenceSolutionMap).map(lang => ({
        language: lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : lang.charAt(0).toUpperCase() + lang.slice(1),
        completeCode: referenceSolutionMap[lang]
      }));

      const payload = {
        title,
        description,
        difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        tags,
        companies: companiesArray,
        visibleTestCases,
        hiddenTestCases,
        startCode: startCodeArray,
        referenceSolution: referenceSolutionArray
      };

      if (isEditMode) {
        await axiosClient.put(`/problem/update/${problemId}`, payload);
        setMessage('Problem updated successfully!');
      } else {
        await axiosClient.post('/problem/create', payload);
        setMessage('Problem created successfully!');
      }
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to save problem.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content transition-colors duration-300 pb-16">
      {/* Top Navbar */}
      <nav className="bg-base-100 border-b border-base-300 px-6 py-4 mb-8 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <NavLink to="/admin" className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Admin Dashboard
          </NavLink>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-base-100 rounded-3xl shadow-xl border border-base-300 p-8">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-base-300">
            <div>
              <h1 className="text-3xl font-black text-base-content">
                {isEditMode ? 'Update Problem' : 'Create New Problem'}
              </h1>
              <p className="text-sm text-base-content/70 mt-1">
                Configure basic info, test cases, and multi-language solutions
              </p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={saveLoading}
              className="btn btn-primary font-bold gap-2 px-6 shadow-lg hover:scale-105 transition-all"
            >
              {saveLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isEditMode ? 'Update Problem' : 'Save Problem'}
            </button>
          </div>

          {error && (
            <div className="mb-6 alert alert-error rounded-2xl shadow-sm text-sm font-medium">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 alert alert-success rounded-2xl shadow-sm text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Basic Metadata */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Basic Metadata
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-base-content/80 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Two Sum"
                    className="input input-bordered w-full bg-base-200/50 focus:bg-base-200 text-sm font-semibold rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-base-content/80 mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="select select-bordered w-full bg-base-200/50 focus:bg-base-200 text-sm font-semibold rounded-xl"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-base-content/80 mb-1">Description</label>
                <textarea
                  rows={5}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Problem description, constraints, and requirements..."
                  className="textarea textarea-bordered w-full bg-base-200/50 focus:bg-base-200 text-sm font-medium rounded-xl leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-base-content/80 mb-1">Tag (Category)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. array, dp, graph"
                    className="input input-bordered w-full bg-base-200/50 focus:bg-base-200 text-sm font-semibold rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-base-content/80 mb-1">Companies (Comma Separated)</label>
                  <input
                    type="text"
                    value={companies}
                    onChange={(e) => setCompanies(e.target.value)}
                    placeholder="e.g. Google, Amazon, Meta"
                    className="input input-bordered w-full bg-base-200/50 focus:bg-base-200 text-sm font-semibold rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Visible Test Cases */}
            <div className="space-y-4 border-t border-base-300 pt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" /> Visible Test Cases (Examples)
                </h2>
                <button
                  type="button"
                  onClick={() => setVisibleTestCases([...visibleTestCases, { input: '', output: '', explanation: '' }])}
                  className="btn btn-xs btn-outline btn-primary gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Case
                </button>
              </div>

              {visibleTestCases.map((tc, idx) => (
                <div key={idx} className="p-4 bg-base-200/50 rounded-2xl border border-base-300 space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>Example {idx + 1}</span>
                    {visibleTestCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setVisibleTestCases(visibleTestCases.filter((_, i) => i !== idx))}
                        className="text-error hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Input stdin"
                      value={tc.input}
                      onChange={(e) => {
                        const updated = [...visibleTestCases];
                        updated[idx].input = e.target.value;
                        setVisibleTestCases(updated);
                      }}
                      className="input input-bordered input-sm w-full bg-base-100 text-xs font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Expected output"
                      value={tc.output}
                      onChange={(e) => {
                        const updated = [...visibleTestCases];
                        updated[idx].output = e.target.value;
                        setVisibleTestCases(updated);
                      }}
                      className="input input-bordered input-sm w-full bg-base-100 text-xs font-mono"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Explanation (optional)"
                    value={tc.explanation || ''}
                    onChange={(e) => {
                      const updated = [...visibleTestCases];
                      updated[idx].explanation = e.target.value;
                      setVisibleTestCases(updated);
                    }}
                    className="input input-bordered input-sm w-full bg-base-100 text-xs"
                  />
                </div>
              ))}
            </div>

            {/* Section 3: Hidden Test Cases */}
            <div className="space-y-4 border-t border-base-300 pt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" /> Hidden Test Cases (Judge Verification)
                </h2>
                <button
                  type="button"
                  onClick={() => setHiddenTestCases([...hiddenTestCases, { input: '', output: '' }])}
                  className="btn btn-xs btn-outline btn-primary gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Hidden Case
                </button>
              </div>

              {hiddenTestCases.map((tc, idx) => (
                <div key={idx} className="p-4 bg-base-200/50 rounded-2xl border border-base-300 space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>Hidden Case {idx + 1}</span>
                    {hiddenTestCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setHiddenTestCases(hiddenTestCases.filter((_, i) => i !== idx))}
                        className="text-error hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Input stdin"
                      value={tc.input}
                      onChange={(e) => {
                        const updated = [...hiddenTestCases];
                        updated[idx].input = e.target.value;
                        setHiddenTestCases(updated);
                      }}
                      className="input input-bordered input-sm w-full bg-base-100 text-xs font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Expected output"
                      value={tc.output}
                      onChange={(e) => {
                        const updated = [...hiddenTestCases];
                        updated[idx].output = e.target.value;
                        setHiddenTestCases(updated);
                      }}
                      className="input input-bordered input-sm w-full bg-base-100 text-xs font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Section 4: Multi-Language Code Editors */}
            <div className="space-y-4 border-t border-base-300 pt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" /> Start Code & Reference Solutions
                </h2>
                <div className="flex bg-base-200 p-1 rounded-xl">
                  {['javascript', 'cpp', 'java', 'python'].map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLang(lang)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeLang === lang
                          ? 'bg-base-100 text-primary shadow-sm'
                          : 'text-base-content/60 hover:text-base-content'
                      }`}
                    >
                      {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Code Editor */}
              <div className="border border-base-300 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-base-200 px-4 py-2 text-xs font-bold text-base-content border-b border-base-300">
                  Initial Starter Code ({activeLang.toUpperCase()})
                </div>
                <div className="h-64">
                  <Editor
                    height="100%"
                    language={activeLang === 'cpp' ? 'cpp' : activeLang}
                    value={startCodeMap[activeLang] || ''}
                    onChange={(val) => setStartCodeMap({ ...startCodeMap, [activeLang]: val || '' })}
                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    options={{ minimap: { enabled: false }, fontSize: 13 }}
                  />
                </div>
              </div>

              {/* Reference Solution Editor */}
              <div className="border border-base-300 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-base-200 px-4 py-2 text-xs font-bold text-base-content border-b border-base-300">
                  Complete Reference Solution ({activeLang.toUpperCase()})
                </div>
                <div className="h-64">
                  <Editor
                    height="100%"
                    language={activeLang === 'cpp' ? 'cpp' : activeLang}
                    value={referenceSolutionMap[activeLang] || ''}
                    onChange={(val) => setReferenceSolutionMap({ ...referenceSolutionMap, [activeLang]: val || '' })}
                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    options={{ minimap: { enabled: false }, fontSize: 13 }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-base-300 flex justify-end">
              <button
                type="submit"
                disabled={saveLoading}
                className="btn btn-primary font-bold gap-2 px-8 shadow-lg hover:scale-105 transition-all"
              >
                {saveLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isEditMode ? 'Update Problem' : 'Save Problem'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;