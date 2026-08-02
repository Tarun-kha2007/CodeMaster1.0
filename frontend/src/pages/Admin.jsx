import React from 'react';
import { Plus, Edit, Trash2, Home, Video, Database, Code, Shield } from 'lucide-react';
import { NavLink } from 'react-router';
import ThemeToggle from '../components/ThemeToggle';

function Admin() {
  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem with multi-language starter code & solutions',
      icon: Plus,
      color: 'text-success',
      bgColor: 'bg-success/10',
      hoverBg: 'hover:bg-success/20',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update & Edit Problems',
      description: 'Search, modify existing problem details, test cases & solutions',
      icon: Edit,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      hoverBg: 'hover:bg-warning/20',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problems',
      description: 'Remove outdated or duplicate problems from the platform',
      icon: Trash2,
      color: 'text-error',
      bgColor: 'bg-error/10',
      hoverBg: 'hover:bg-error/20',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Solutions',
      description: 'Upload & manage video walkthroughs and editorials',
      icon: Video,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      hoverBg: 'hover:bg-primary/20',
      route: '/admin/video'
    }
  ];

  return (
    <div className="min-h-screen bg-base-200 text-base-content transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="bg-base-100 border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Code className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-base-content">CodeMaster Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <NavLink to="/" className="btn btn-ghost btn-sm gap-1 text-base-content/70 hover:text-primary">
                <Home className="h-4 w-4" />
                <span>User Portal</span>
              </NavLink>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-2xl border border-primary/20 shadow-md mb-6">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-black text-base-content mb-3">
            Admin Control Center
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto font-medium">
            Manage coding challenges, multi-language solutions, video tutorials, and platform content
          </p>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <NavLink
                key={option.id}
                to={option.route}
                className="group"
              >
                <div className="h-full rounded-3xl border border-base-300 bg-base-100 p-8 shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center ${option.bgColor} ${option.color} rounded-2xl p-4 mb-6`}>
                    <IconComponent className="h-8 w-8" />
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-extrabold text-base-content mb-2">
                    {option.title}
                  </h2>

                  {/* Description */}
                  <p className="text-base-content/70 text-sm mb-6 leading-relaxed">
                    {option.description}
                  </p>

                  {/* Action Link */}
                  <div className="flex items-center text-sm font-bold text-primary group-hover:underline">
                    <span>Open {option.title}</span>
                    <svg className="ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Admin;
