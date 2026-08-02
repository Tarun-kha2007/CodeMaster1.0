import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams, NavLink } from 'react-router';
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { Play, Send, Plus, Trash2, Code2, CheckCircle2, XCircle, FileCode, MessageSquare, ArrowLeft, Terminal, Sparkles } from 'lucide-react';

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript',
  python: 'Python'
};

const ProblemPage = () => {
  const { problemId } = useParams();
  const { theme } = useTheme();

  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);

  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [solutionLang, setSolutionLang] = useState('javascript');

  // Custom Test Case State
  const [useCustomTestCases, setUseCustomTestCases] = useState(false);
  const [customTestCases, setCustomTestCases] = useState([
    { input: '', output: '' }
  ]);

  const editorRef = useRef(null);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        setProblem(response?.data);
        const initialCode = response?.data?.startCode?.find(sc => sc.language?.toLowerCase() === selectedLanguage || sc.language === langMap[selectedLanguage])?.initialCode;
        setCode(initialCode || getDefaultCode(selectedLanguage));

        // Pre-fill custom test cases if available
        if (response?.data?.visibleTestCases?.length > 0) {
          setCustomTestCases(response.data.visibleTestCases.map(tc => ({
            input: tc.input || '',
            output: tc.output || ''
          })));
        }
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const initialCode = problem?.startCode?.find(sc => sc.language?.toLowerCase() === selectedLanguage || sc.language === langMap[selectedLanguage])?.initialCode;
      setCode(initialCode || getDefaultCode(selectedLanguage));
    }
  }, [selectedLanguage, problem]);

  const getDefaultCode = (lang) => {
    switch (lang) {
      case 'javascript':
        return `// Write your JavaScript solution here\nfunction twoSum(nums, target) {\n  \n}`;
      case 'cpp':
        return `// Write your C++ solution here\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`;
      case 'java':
        return `// Write your Java solution here\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}`;
      default:
        return `// Start coding...`;
    }
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleRun = async () => {
    setRunLoading(true);
    setRunResult(null);
    setActiveRightTab('testcase');

    try {
      const payload = {
        code,
        language: selectedLanguage,
      };

      if (useCustomTestCases && customTestCases.length > 0) {
        payload.customTestCases = customTestCases;
      }

      const response = await axiosClient.post(`/submission/run/${problemId}`, payload);
      setRunResult(response?.data);
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: error.response?.data?.message || 'Internal server error while executing code'
      });
    } finally {
      setRunLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setSubmitLoading(true);
    setSubmitResult(null);
    setActiveRightTab('result');

    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage
      });
      setSubmitResult(response?.data);
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult({
        accepted: false,
        error: error.response?.data?.message || 'Submission failed'
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAddTestCase = () => {
    setCustomTestCases([...customTestCases, { input: '', output: '' }]);
  };

  const handleRemoveTestCase = (index) => {
    setCustomTestCases(customTestCases.filter((_, i) => i !== index));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...customTestCases];
    updated[index][field] = value;
    setCustomTestCases(updated);
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      case 'python': return 'python';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-success/20 text-success border-success/30';
      case 'medium': return 'bg-warning/20 text-warning border-warning/30';
      case 'hard': return 'bg-error/20 text-error border-error/30';
      default: return 'bg-base-200 text-base-content';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-base-200 text-base-content overflow-hidden transition-colors duration-300">
      {/* Top Navbar */}
      <div className="h-14 bg-base-100 border-b border-base-300 px-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <NavLink to="/" className="btn btn-ghost btn-sm gap-1 text-base-content/70 hover:text-primary">
            <ArrowLeft className="w-4 h-4" /> Problems
          </NavLink>
          <span className="text-base-content/20">|</span>
          <h1 className="font-bold text-base-content truncate max-w-xs sm:max-w-md">
            {problem?.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRun}
            disabled={runLoading || submitLoading}
            className="btn btn-sm bg-base-200 hover:bg-base-300 border-base-300 text-base-content gap-1.5"
          >
            {runLoading ? <div className="loading loading-spinner loading-xs" /> : <Play className="w-4 h-4 text-success fill-success" />}
            Run
          </button>
          <button
            onClick={handleSubmitCode}
            disabled={runLoading || submitLoading}
            className="btn btn-sm btn-success text-success-content font-semibold gap-1.5 shadow-md"
          >
            {submitLoading ? <div className="loading loading-spinner loading-xs" /> : <Send className="w-4 h-4" />}
            Submit
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-base-300 h-full bg-base-100">
          {/* Left Tabs */}
          <div className="flex border-b border-base-300 bg-base-200 px-2 overflow-x-auto">
            {[
              { id: 'description', label: 'Description', icon: FileCode },
              { id: 'editorial', label: 'Editorial', icon: Sparkles },
              { id: 'solutions', label: 'Solutions', icon: Code2 },
              { id: 'submissions', label: 'Submissions', icon: CheckCircle2 },
              { id: 'chatAI', label: 'AI Helper', icon: MessageSquare },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveLeftTab(tab.id)}
                  className={`px-4 py-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
                    activeLeftTab === tab.id
                      ? 'border-primary text-primary bg-base-100'
                      : 'border-transparent text-base-content/60 hover:text-base-content'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Left Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-base-100">
            {problem && (
              <>
                {/* Description Tab */}
                {activeLeftTab === 'description' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-extrabold text-base-content">{problem?.title}</h2>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getDifficultyColor(problem?.difficulty)}`}>
                        {problem?.difficulty?.toUpperCase()}
                      </span>
                      {problem?.tags && (
                        <span className="badge badge-primary badge-outline text-xs font-semibold gap-1">
                          {problem?.tags}
                        </span>
                      )}
                      {problem?.companies?.map(c => (
                        <span key={c} className="badge badge-warning badge-outline text-xs font-semibold gap-1">
                          {c}
                        </span>
                      ))}
                    </div>

                    <div className="prose max-w-none text-sm text-base-content/80 leading-relaxed whitespace-pre-wrap">
                      {problem?.description}
                    </div>

                    {/* Visible Examples */}
                    <div className="mt-8 space-y-4">
                      <h3 className="text-sm font-bold text-base-content uppercase tracking-wider">Example Test Cases</h3>
                      {problem?.visibleTestCases?.map((example, index) => (
                        <div key={index} className="bg-base-200 p-4 rounded-xl border border-base-300">
                          <div className="text-xs font-bold text-base-content/60 mb-2">Example {index + 1}</div>
                          <div className="space-y-2 text-xs font-mono">
                            <div>
                              <span className="text-base-content/60 font-semibold">Input: </span>
                              <span className="text-base-content font-bold">{example?.input}</span>
                            </div>
                            <div>
                              <span className="text-base-content/60 font-semibold">Output: </span>
                              <span className="text-base-content font-bold">{example?.output}</span>
                            </div>
                            {example?.explanation && (
                              <div className="text-base-content/60 italic">
                                <span>Explanation: </span>{example?.explanation}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Editorial Tab */}
                {activeLeftTab === 'editorial' && (
                  <div>
                    {problem?.secureUrl ? (
                      <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} />
                    ) : (
                      <div className="p-8 text-center bg-base-200 rounded-2xl border border-dashed border-base-300">
                        <Sparkles className="w-10 h-10 text-primary mx-auto mb-3 animate-pulse" />
                        <h3 className="text-lg font-bold text-base-content">Video Editorial Coming Soon</h3>
                        <p className="text-xs text-base-content/60 mt-1">Our team is preparing a walkthrough for this problem.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Solutions Tab (Multilingual support) */}
                {activeLeftTab === 'solutions' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-base-content">Official Solutions</h3>

                      {/* Language Selection Tabs */}
                      <div className="flex bg-base-200 p-1 rounded-xl">
                        {['javascript', 'cpp', 'java', 'python'].map(lang => (
                          <button
                            key={lang}
                            onClick={() => setSolutionLang(lang)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              solutionLang === lang
                                ? 'bg-base-100 text-primary shadow-sm'
                                : 'text-base-content/60 hover:text-base-content'
                            }`}
                          >
                            {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : lang.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Display reference solution for selected language */}
                    {(() => {
                      const sol = problem?.referenceSolution?.find(
                        s => s.language?.toLowerCase() === solutionLang || s.language === langMap[solutionLang]
                      );

                      if (sol && sol.completeCode) {
                        return (
                          <div className="border border-base-300 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-base-200 px-4 py-3 flex items-center justify-between border-b border-base-300">
                              <span className="text-xs font-bold font-mono text-primary">
                                {langMap[solutionLang] || solutionLang.toUpperCase()} Solution
                              </span>
                              <span className="text-xs text-base-content/60">Read Only</span>
                            </div>
                            <div className="h-96">
                              <Editor
                                height="100%"
                                language={getLanguageForMonaco(solutionLang)}
                                value={sol.completeCode}
                                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                                options={{
                                  readOnly: true,
                                  minimap: { enabled: false },
                                  fontSize: 13,
                                  scrollBeyondLastLine: false,
                                  automaticLayout: true,
                                }}
                              />
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div className="p-8 text-center bg-base-200 rounded-2xl border border-base-300">
                          <Code2 className="w-10 h-10 text-base-content/40 mx-auto mb-2" />
                          <h4 className="text-sm font-bold text-base-content/80">No {langMap[solutionLang] || solutionLang} Reference Solution</h4>
                          <p className="text-xs text-base-content/60 mt-1">Switch tabs above to check available solution implementations.</p>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Submissions Tab */}
                {activeLeftTab === 'submissions' && (
                  <SubmissionHistory problemId={problemId} />
                )}

                {/* Chat AI Tab */}
                {activeLeftTab === 'chatAI' && (
                  <ChatAi problem={problem} />
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Panel (Editor / Testcases / Results) */}
        <div className="w-full md:w-1/2 flex flex-col bg-base-100 h-full">
          {/* Right Panel Tabs */}
          <div className="flex items-center justify-between border-b border-base-300 bg-base-200 px-4">
            <div className="flex">
              {[
                { id: 'code', label: 'Code Editor', icon: Code2 },
                { id: 'testcase', label: 'Test Cases', icon: Terminal },
                { id: 'result', label: 'Submission Result', icon: CheckCircle2 },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveRightTab(tab.id)}
                    className={`px-4 py-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                      activeRightTab === tab.id
                        ? 'border-primary text-primary bg-base-100'
                        : 'border-transparent text-base-content/60 hover:text-base-content'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Language Selector inside Editor */}
            {activeRightTab === 'code' && (
              <div className="relative inline-block">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="appearance-none bg-base-100 border border-base-300 text-base-content text-xs font-bold rounded-lg pl-4 pr-10 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer shadow-sm hover:border-primary/50"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-base-content/60">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel Content */}
          <div className="flex-1 overflow-hidden relative">
            {/* Code Tab */}
            {activeRightTab === 'code' && (
              <div className="h-full w-full">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme={theme === 'dark' ? 'vs-dark' : 'light'}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    cursorStyle: 'line',
                  }}
                />
              </div>
            )}

            {/* Testcase Tab (Interactive Custom Test Cases) */}
            {activeRightTab === 'testcase' && (
              <div className="h-full overflow-y-auto p-6 space-y-6">
                <div className="flex items-center justify-between bg-base-200 p-4 rounded-xl border border-base-300">
                  <div>
                    <h3 className="text-sm font-bold text-base-content">Custom Test Cases</h3>
                    <p className="text-xs text-base-content/60">Manually edit or add input test cases to execute</p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useCustomTestCases}
                      onChange={(e) => setUseCustomTestCases(e.target.checked)}
                      className="toggle toggle-primary toggle-sm"
                    />
                    <span className="text-xs font-semibold">Enable Custom Mode</span>
                  </label>
                </div>

                {/* Custom Test Case List */}
                <div className="space-y-4">
                  {customTestCases.map((tc, index) => (
                    <div key={index} className="bg-base-200 p-4 rounded-xl border border-base-300 space-y-3">
                      <div className="flex justify-between items-center text-xs font-bold text-base-content/70">
                        <span>Case {index + 1}</span>
                        {customTestCases.length > 1 && (
                          <button
                            onClick={() => handleRemoveTestCase(index)}
                            className="text-error hover:opacity-80 flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-base-content/60 font-medium mb-1">
                          Input (stdin)
                        </label>
                        <textarea
                          rows={2}
                          value={tc.input}
                          onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                          placeholder="e.g. [2, 7, 11, 15] 9"
                          className="textarea textarea-bordered w-full rounded-lg text-xs font-mono bg-base-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-base-content/60 font-medium mb-1">
                          Expected Output (optional)
                        </label>
                        <input
                          type="text"
                          value={tc.output}
                          onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                          placeholder="e.g. [0, 1]"
                          className="input input-bordered input-sm w-full rounded-lg text-xs font-mono bg-base-100"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleAddTestCase}
                    className="btn btn-outline btn-sm w-full gap-2 text-xs border-dashed"
                  >
                    <Plus className="w-4 h-4" /> Add Test Case
                  </button>
                </div>

                {/* Execution Results View */}
                {runResult && (
                  <div className="mt-6 border-t border-base-300 pt-6">
                    <h4 className="text-sm font-bold mb-4 text-base-content">Run Execution Results</h4>
                    <div className={`p-4 rounded-xl border ${runResult.success ? 'bg-success/10 border-success/30' : 'bg-error/10 border-error/30'}`}>
                      <div className="flex items-center gap-2 font-bold text-sm">
                        {runResult.success ? (
                          <span className="text-success flex items-center gap-1.5">
                            <CheckCircle2 className="w-5 h-5" /> All Test Cases Passed
                          </span>
                        ) : (
                          <span className="text-error flex items-center gap-1.5">
                            <XCircle className="w-5 h-5" /> Execution Errors / Wrong Output
                          </span>
                        )}
                      </div>

                      {runResult.error && (
                        <div className="mt-4 bg-error/10 text-error p-3 rounded-lg border border-error/30 font-mono text-xs whitespace-pre-wrap">
                          {runResult.error}
                        </div>
                      )}

                      {runResult.testCases?.map((tc, idx) => (
                        <div key={idx} className="mt-3 bg-base-100 p-3 rounded-lg border border-base-300 font-mono text-xs space-y-1">
                          <div><span className="text-base-content/50">Input:</span> <span className="font-semibold text-base-content">{tc.stdin || 'N/A'}</span></div>
                          {tc.compile_output && (
                            <div className="text-error"><span className="text-error/70">Compilation Error:</span> <pre className="whitespace-pre-wrap mt-1">{tc.compile_output}</pre></div>
                          )}
                          {tc.stderr && (
                            <div className="text-error"><span className="text-error/70">Runtime Error:</span> <pre className="whitespace-pre-wrap mt-1">{tc.stderr}</pre></div>
                          )}
                          {tc.stdout && (
                            <div><span className="text-base-content/50">Output:</span> <span className="font-semibold text-base-content">{tc.stdout}</span></div>
                          )}
                          {tc.expected_output && (
                            <div><span className="text-base-content/50">Expected:</span> <span className="font-semibold text-base-content">{tc.expected_output}</span></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Result Tab */}
            {activeRightTab === 'result' && (
              <div className="h-full overflow-y-auto p-6">
                <h3 className="text-sm font-bold mb-4 text-base-content">Submission Result</h3>
                {submitResult ? (
                  <div className={`p-6 rounded-2xl border ${submitResult.accepted ? 'bg-success/10 border-success/30' : 'bg-error/10 border-error/30'}`}>
                    <div className="flex items-center gap-3">
                      {submitResult.accepted ? (
                        <CheckCircle2 className="w-8 h-8 text-success" />
                      ) : (
                        <XCircle className="w-8 h-8 text-error" />
                      )}
                      <div>
                        <h4 className="text-xl font-black text-base-content">
                          {submitResult.accepted ? 'Accepted' : (submitResult.error || 'Wrong Answer')}
                        </h4>
                        <p className="text-xs text-base-content/60">
                          Passed {submitResult.passedTestCases || 0} / {submitResult.totalTestCases || 0} Testcases
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-base-200 rounded-2xl border border-base-300">
                    <Send className="w-8 h-8 text-base-content/40 mx-auto mb-2" />
                    <p className="text-xs text-base-content/60">Click "Submit" to submit your solution for evaluation.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;