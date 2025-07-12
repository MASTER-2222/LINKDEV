import { useAuth } from '../context/AuthContext';
import { formatFullName } from '../utils';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <img
                src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0077b5&color=fff&size=100`}
                alt={user ? formatFullName(user.firstName, user.lastName) : ''}
                className="h-20 w-20 rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900">
                {user ? formatFullName(user.firstName, user.lastName) : 'User'}
              </h3>
              <p className="text-sm text-gray-600">{user?.headline || 'Professional'}</p>
              <p className="text-xs text-gray-500 mt-2 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Welcome to LINKDEV, {user?.firstName}! 🎉
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">🚀 Your LinkedIn Clone is Ready!</h3>
              <p className="text-blue-800 text-sm">
                This is a fully functional LinkedIn clone built with React, TypeScript, Express.js, and PostgreSQL. 
                Explore the features:
              </p>
              <ul className="mt-3 text-sm text-blue-700 space-y-1">
                <li>• Browse and apply to jobs</li>
                <li>• Connect with other professionals</li>
                <li>• Share posts and updates</li>
                <li>• Manage your professional profile</li>
                {user?.role === 'recruiter' && <li>• Post jobs and manage applications</li>}
                {user?.role === 'admin' && <li>• Access admin dashboard for platform management</li>}
              </ul>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user?.role === 'job_seeker' && (
                <button className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="text-blue-600 font-medium">Browse Jobs</div>
                  <div className="text-blue-500 text-sm">Find your next opportunity</div>
                </button>
              )}
              
              {user?.role === 'recruiter' && (
                <button className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="text-green-600 font-medium">Post a Job</div>
                  <div className="text-green-500 text-sm">Find great candidates</div>
                </button>
              )}

              <button className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="text-purple-600 font-medium">Update Profile</div>
                <div className="text-purple-500 text-sm">Keep your info current</div>
              </button>

              <button className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors">
                <div className="text-indigo-600 font-medium">Connect</div>
                <div className="text-indigo-500 text-sm">Grow your network</div>
              </button>

              <button className="p-4 bg-pink-50 border border-pink-200 rounded-lg hover:bg-pink-100 transition-colors">
                <div className="text-pink-600 font-medium">Share Update</div>
                <div className="text-pink-500 text-sm">Post to your feed</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Authentication</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Jobs System</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Ready
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Connections</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  ⚠ Coming Soon
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Posts Feed</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  ⚠ Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;