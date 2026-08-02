import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import Navbar from '../components/Navbar';

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all',
    company: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const allCompanies = Array.from(new Set(problems.flatMap(p => p.companies || []))).filter(Boolean);

  const safeIncludes = (field, query) => {
    if (!field || !query) return false;
    const q = String(query).toLowerCase().trim();
    if (Array.isArray(field)) {
      return field.some(item => String(item).toLowerCase().includes(q));
    }
    return String(field).toLowerCase().includes(q);
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || safeIncludes(problem.difficulty, filters.difficulty);
    const tagMatch = filters.tag === 'all' || safeIncludes(problem.tags, filters.tag);
    const companyMatch = filters.company === 'all' || safeIncludes(problem.companies, filters.company);
    
    let statusMatch = true;
    if (filters.status === 'solved') {
      statusMatch = solvedProblems.some(sp => sp._id === problem._id);
    } else if (filters.status === 'unsolved') {
      statusMatch = !solvedProblems.some(sp => sp._id === problem._id);
    }
    
    let searchMatch = true;
    if (searchQuery.trim() !== '') {
      const terms = searchQuery.toLowerCase().trim().split(/\s+/);
      searchMatch = terms.every(q => 
        safeIncludes(problem.title, q) || 
        safeIncludes(problem.tags, q) ||
        safeIncludes(problem.difficulty, q) ||
        safeIncludes(problem.companies, q)
      );
    }
    
    return difficultyMatch && tagMatch && companyMatch && statusMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300 relative z-0">
      <div className="mesh-bg"></div>
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Hero Section */}
        <div className="hero glass-panel rounded-3xl p-10 mb-12 text-base-content relative overflow-hidden shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
          <div className="hero-content text-center relative z-10 py-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight font-display">
                <span className="text-gradient">Master</span> Coding Challenges
              </h1>
              <p className="text-xl mb-8 opacity-90 font-medium">Solve problems, track your stats, and build your technical skills.</p>
              {problems?.length > 0 && (
                <NavLink to={`/problem/${problems[0]._id}`} className="btn btn-primary font-bold border-none btn-lg shadow-lg hover:shadow-primary/50 transition-all hover:scale-105">
                  Start Practicing Now
                </NavLink>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card glass-panel p-6 shadow-xl mb-8 border border-white/10 hover:-translate-y-1 transition-all duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-base-content flex items-center gap-2 font-display">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Problem Filters
            </h2>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="label"><span className="label-text font-semibold">Status</span></label>
              <select className="select select-bordered w-full bg-base-200" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
                <option value="all">All</option>
                <option value="solved">Solved</option>
                <option value="unsolved">Unsolved</option>
              </select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="label"><span className="label-text font-semibold">Difficulty</span></label>
              <select className="select select-bordered w-full bg-base-200" value={filters.difficulty} onChange={(e) => setFilters({...filters, difficulty: e.target.value})}>
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="label"><span className="label-text font-semibold">Tags / Topics</span></label>
              <select className="select select-bordered w-full bg-base-200" value={filters.tag} onChange={(e) => setFilters({...filters, tag: e.target.value})}>
                <option value="all">All Tags</option>
                <option value="array">Array</option>
                <option value="linkedList">Linked List</option>
                <option value="graph">Graph</option>
                <option value="dp">Dynamic Programming</option>
                <option value="string">String</option>
                <option value="hashTable">Hash Table</option>
                <option value="tree">Tree</option>
              </select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="label"><span className="label-text font-semibold">Company</span></label>
              <select className="select select-bordered w-full bg-base-200" value={filters.company} onChange={(e) => setFilters({...filters, company: e.target.value})}>
                <option value="all">All Companies</option>
                {allCompanies.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="card glass-panel p-0 overflow-hidden shadow-xl border border-white/10 hover:-translate-y-1 transition-all duration-300">
          <div className="p-6 border-b border-base-content/10 bg-base-200/50">
            <h2 className="text-2xl font-semibold text-base-content flex items-center gap-2 font-display">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Problems
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table w-full table-zebra">
              <thead>
                <tr className="bg-base-200 text-base-content/70 border-b border-base-content/10 text-sm uppercase tracking-wide">
                  <th className="px-6 py-4 w-16">#</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4 w-32">Difficulty</th>
                  <th className="px-6 py-4 w-1/3">Tags & Companies</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.length > 0 ? (
                  filteredProblems.map((problem, index) => {
                    const isSolved = solvedProblems.some(sp => sp._id === problem._id);
                    return (
                      <tr key={problem._id} className="hover:bg-base-200/50 transition-colors border-b border-base-content/5">
                        <td className="px-6 py-4 font-mono text-base-content/60">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {isSolved && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            <NavLink to={`/problem/${problem._id}`} className="font-bold text-base hover:text-primary transition-colors">
                              {problem.title}
                            </NavLink>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)} font-semibold`}>
                            {problem.difficulty}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {problem.tags && (
                              <div className="badge badge-outline badge-info badge-sm">
                                {problem.tags}
                              </div>
                            )}
                            {problem.companies?.map(c => (
                              <div key={c} className="badge badge-outline badge-warning badge-sm">
                                {c}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-12">
                      <div className="flex flex-col items-center justify-center text-base-content/50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-medium">No problems found</p>
                        <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'badge-success';
    case 'medium': return 'badge-warning';
    case 'hard': return 'badge-error';
    default: return 'badge-neutral';
  }
};

export default Homepage;