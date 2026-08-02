import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../authSlice';
import ThemeToggle from './ThemeToggle';
import axiosClient from '../utils/axiosClient';
import { Search, Loader2 } from 'lucide-react';

const safeIncludes = (field, query) => {
  if (!field || !query) return false;
  const q = String(query).toLowerCase().trim();
  if (Array.isArray(field)) {
    return field.some(item => String(item).toLowerCase().includes(q));
  }
  return String(field).toLowerCase().includes(q);
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [problems, setProblems] = useState([]);
  const searchRef = useRef(null);

  // Fetch all problems once for client-side fuzzy search
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems for search:', error);
      }
    };
    if (user) fetchProblems();
  }, [user]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() === '') {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const terms = searchQuery.toLowerCase().trim().split(/\s+/);
      
      const filtered = problems.filter(problem => {
        return terms.every(q => 
          safeIncludes(problem.title, q) ||
          safeIncludes(problem.tags, q) ||
          safeIncludes(problem.difficulty, q) ||
          safeIncludes(problem.companies, q)
        );
      });

      setResults(filtered.slice(0, 6)); // show top 6 results
      setIsSearching(false);
      setShowDropdown(true);
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, problems]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const handleResultClick = (problemId) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/problem/${problemId}`);
  };

  return (
    <nav className="navbar glass-panel sticky top-0 z-50 px-6 py-4 mb-4 border-b border-base-content/5">
      <div className="flex-1 gap-4 items-center flex">
        <NavLink to="/" className="btn btn-ghost text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent hover:opacity-80 flex items-center gap-2.5">
          <img src="/logo.png" alt="CodeMaster Logo" className="w-10 h-10 object-contain rounded-xl bg-white p-1.5 shadow-sm border border-base-content/10" />
          <span>Code<span className="text-base-content">Master</span></span>
        </NavLink>
        
        {/* Semantic Search Bar */}
        {user && (
          <div className="relative w-full max-w-md ml-4 hidden md:block" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search problems, tags, companies..."
                className="input input-bordered w-full pl-11 pr-10 rounded-full bg-base-200/50 focus:bg-base-200 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if(searchQuery.trim() !== '') setShowDropdown(true); }}
              />
              <Search className="w-5 h-5 text-base-content/40 absolute left-4 top-3.5" />
              {isSearching && (
                <Loader2 className="w-5 h-5 text-primary animate-spin absolute right-4 top-3.5" />
              )}
            </div>

            {/* Search Results Dropdown */}
            {showDropdown && searchQuery.trim() !== '' && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 rounded-2xl shadow-2xl border border-base-200 overflow-hidden z-[60]">
                {results.length > 0 ? (
                  <ul className="py-2">
                    {results.map(problem => (
                      <li key={problem._id}>
                        <button
                          onClick={() => handleResultClick(problem._id)}
                          className="w-full text-left px-5 py-3 hover:bg-base-200 transition-colors flex flex-col gap-1"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-sm">{problem.title}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              problem.difficulty === 'Easy' ? 'bg-success/20 text-success' :
                              problem.difficulty === 'Medium' ? 'bg-warning/20 text-warning' :
                              'bg-error/20 text-error'
                            }`}>
                              {problem.difficulty}
                            </span>
                          </div>
                          <div className="flex gap-2 text-xs text-base-content/60">
                            {problem.tags && <span>#{problem.tags}</span>}
                            {problem.companies && problem.companies.length > 0 && (
                              <span className="font-medium text-primary/70">{problem.companies.join(', ')}</span>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  !isSearching && (
                    <div className="p-5 text-center text-sm text-base-content/60">
                      No matching problems found.
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-none items-center">
        {!user && <ThemeToggle />}
        {user && (
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-bold text-lg leading-none ring-2 ring-primary/20 hover:ring-primary hover:scale-105 transition-all duration-300 shadow-md cursor-pointer select-none">
                <span className="flex items-center justify-center w-full h-full leading-none">
                  {user.firstName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <ul tabIndex={0} className="mt-4 p-3 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-2xl w-60 z-50 border border-base-200">
                <li className="px-4 py-3 font-medium text-base-content border-b border-base-content/10 mb-2">
                  <div className="flex flex-col gap-1 items-start">
                    <span className="font-bold text-base">{user.firstName} {user.lastName}</span>
                    <span className="text-xs text-base-content/60">{user.email}</span>
                  </div>
                </li>
                <li>
                  <NavLink to="/profile" className="hover:bg-primary/10 hover:text-primary rounded-xl py-2.5 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile & Stats
                  </NavLink>
                </li>
                {user.role === 'admin' && (
                  <li>
                    <NavLink to="/admin" className="hover:bg-primary/10 hover:text-primary rounded-xl py-2.5 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Admin Dashboard
                    </NavLink>
                  </li>
                )}
                <li className="mt-2 border-t border-base-content/10 pt-2">
                  <button 
                    onClick={handleLogout} 
                    className="text-error hover:bg-error/10 rounded-xl py-2.5 text-left font-semibold transition-colors w-full flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
