import React from 'react';

const Navbar = ({ user, setCurrentRoute }) => (
  <nav className="navbar bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-indigo-600">TaskLoad</span>
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setCurrentRoute('dashboard')}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentRoute('account')}
            className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Account
          </button>
          <span className="ml-4 text-sm font-medium text-gray-700">
            Welcome, {user.username}
          </span>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;

