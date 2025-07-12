import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Briefcase, 
  User, 
  Settings, 
  LogOut,
  Search,
  Bell,
  MessageCircle,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { generateAvatarUrl, formatFullName } from '../utils';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/network?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-linkedin-500 rounded text-white flex items-center justify-center font-bold">
                L
              </div>
              <span className="text-xl font-bold text-gray-900">LINKDEV</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for people, jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive('/') 
                  ? 'text-linkedin-500 bg-linkedin-50' 
                  : 'text-gray-600 hover:text-linkedin-500 hover:bg-gray-50'
              }`}
            >
              <Home className="h-5 w-5 mb-1" />
              Home
            </Link>

            <Link
              to="/network"
              className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive('/network') 
                  ? 'text-linkedin-500 bg-linkedin-50' 
                  : 'text-gray-600 hover:text-linkedin-500 hover:bg-gray-50'
              }`}
            >
              <Users className="h-5 w-5 mb-1" />
              Network
            </Link>

            <Link
              to="/jobs"
              className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive('/jobs') 
                  ? 'text-linkedin-500 bg-linkedin-50' 
                  : 'text-gray-600 hover:text-linkedin-500 hover:bg-gray-50'
              }`}
            >
              <Briefcase className="h-5 w-5 mb-1" />
              Jobs
            </Link>

            {user.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive('/admin') 
                    ? 'text-linkedin-500 bg-linkedin-50' 
                    : 'text-gray-600 hover:text-linkedin-500 hover:bg-gray-50'
                }`}
              >
                <Shield className="h-5 w-5 mb-1" />
                Admin
              </Link>
            )}

            {/* Notifications */}
            <button className="flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-linkedin-500 hover:bg-gray-50 transition-colors">
              <Bell className="h-5 w-5 mb-1" />
              Notifications
            </button>

            {/* Messages */}
            <button className="flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-linkedin-500 hover:bg-gray-50 transition-colors">
              <MessageCircle className="h-5 w-5 mb-1" />
              Messages
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-linkedin-500 hover:bg-gray-50 transition-colors"
              >
                <img
                  src={user.profilePicture || generateAvatarUrl(user.firstName, user.lastName)}
                  alt={formatFullName(user.firstName, user.lastName)}
                  className="h-5 w-5 rounded-full mb-1"
                />
                Me
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.profilePicture || generateAvatarUrl(user.firstName, user.lastName)}
                        alt={formatFullName(user.firstName, user.lastName)}
                        className="h-12 w-12 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatFullName(user.firstName, user.lastName)}
                        </p>
                        <p className="text-xs text-gray-500">{user.headline || 'No headline'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4 mr-3" />
                    View Profile
                  </Link>
                  
                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </button>
                  
                  <hr className="my-2" />
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;