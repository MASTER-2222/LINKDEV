import { useState } from 'react';
import { Search, UserPlus, Users, Mail } from 'lucide-react';

const Network = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample network data - will be replaced with real API data
  const sampleConnections = [
    {
      id: '1',
      firstName: 'Jane',
      lastName: 'Smith',
      headline: 'Senior Software Engineer at Google',
      profilePicture: null,
      location: 'Mountain View, CA',
      mutualConnections: 12,
    },
    {
      id: '2',
      firstName: 'John',
      lastName: 'Doe',
      headline: 'Product Manager at Microsoft',
      profilePicture: null,
      location: 'Seattle, WA',
      mutualConnections: 8,
    },
    {
      id: '3',
      firstName: 'Sarah',
      lastName: 'Johnson',
      headline: 'UX Designer at Apple',
      profilePicture: null,
      location: 'Cupertino, CA',
      mutualConnections: 5,
    },
  ];

  const pendingRequests = [
    {
      id: '4',
      firstName: 'Mike',
      lastName: 'Wilson',
      headline: 'Data Scientist at Facebook',
      profilePicture: null,
      location: 'Menlo Park, CA',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Network</h1>
        <p className="text-gray-600 mt-2">Manage your professional connections and discover new opportunities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Connections</span>
                <span className="text-lg font-semibold text-linkedin-500">127</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Requests</span>
                <span className="text-lg font-semibold text-yellow-500">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sent Requests</span>
                <span className="text-lg font-semibold text-blue-500">5</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-2 bg-linkedin-500 text-white rounded-lg hover:bg-linkedin-600 transition-colors">
                <UserPlus className="h-4 w-4 mr-2" />
                Find People
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Mail className="h-4 w-4 mr-2" />
                Import Contacts
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for people..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-500 focus:border-transparent"
                />
              </div>
              <button className="bg-linkedin-500 text-white px-6 py-3 rounded-lg hover:bg-linkedin-600 transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pending Requests ({pendingRequests.length})
              </h3>
              <div className="space-y-4">
                {pendingRequests.map((person) => (
                  <div key={person.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={person.profilePicture || `https://ui-avatars.com/api/?name=${person.firstName}+${person.lastName}&background=0077b5&color=fff&size=48`}
                        alt={`${person.firstName} ${person.lastName}`}
                        className="h-12 w-12 rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {person.firstName} {person.lastName}
                        </h4>
                        <p className="text-sm text-gray-600">{person.headline}</p>
                        <p className="text-xs text-gray-500">{person.location}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-linkedin-500 text-white px-4 py-2 rounded-lg hover:bg-linkedin-600 transition-colors">
                        Accept
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* People You May Know */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              People You May Know
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sampleConnections.map((person) => (
                <div key={person.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={person.profilePicture || `https://ui-avatars.com/api/?name=${person.firstName}+${person.lastName}&background=0077b5&color=fff&size=48`}
                      alt={`${person.firstName} ${person.lastName}`}
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {person.firstName} {person.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">{person.headline}</p>
                      <p className="text-xs text-gray-500">{person.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Users className="h-3 w-3 mr-1" />
                    {person.mutualConnections} mutual connections
                  </div>

                  <button className="w-full flex items-center justify-center px-4 py-2 border border-linkedin-500 text-linkedin-500 rounded-lg hover:bg-linkedin-50 transition-colors">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Network;