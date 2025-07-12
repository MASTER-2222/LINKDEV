import { useAuth } from '../context/AuthContext';
import { formatFullName } from '../utils';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-lg relative">
          <div className="absolute -bottom-16 left-8">
            <img
              src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0077b5&color=fff&size=128`}
              alt={user ? formatFullName(user.firstName, user.lastName) : ''}
              className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 pb-8 px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user ? formatFullName(user.firstName, user.lastName) : 'User Profile'}
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                {user?.headline || 'Professional Headline'}
              </p>
              <p className="text-gray-500 mt-1">
                {user?.location || 'Location not specified'}
              </p>
              <p className="text-sm text-gray-500 mt-1 capitalize">
                {user?.role?.replace('_', ' ')} Account
              </p>
            </div>
            <button className="bg-linkedin-500 text-white px-6 py-2 rounded-lg hover:bg-linkedin-600 transition-colors">
              Edit Profile
            </button>
          </div>

          {/* About Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                {user?.about || 'No bio available. Click "Edit Profile" to add information about yourself.'}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Email:</span> {user?.email}
                </p>
                {user?.website && (
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Website:</span> {user.website}
                  </p>
                )}
                {user?.industry && (
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Industry:</span> {user.industry}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Details</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Account Type:</span> {user?.role?.replace('_', ' ')}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Member Since:</span> {
                    user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;