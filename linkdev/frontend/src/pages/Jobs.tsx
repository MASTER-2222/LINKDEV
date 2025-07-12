import { useState } from 'react';
import { Search, MapPin, Briefcase, Clock, Building } from 'lucide-react';

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  // Sample jobs data - will be replaced with real API data
  const sampleJobs = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      jobType: 'Full-time',
      workMode: 'Remote',
      salary: '$120,000 - $150,000',
      postedDate: '2 days ago',
      description: 'We are looking for a skilled Frontend Developer to join our team...',
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'New York, NY',
      jobType: 'Full-time',
      workMode: 'Hybrid',
      salary: '$130,000 - $160,000',
      postedDate: '1 week ago',
      description: 'Join our growing team as a Product Manager...',
    },
    {
      id: '3',
      title: 'UX Designer',
      company: 'Design Studio',
      location: 'Austin, TX',
      jobType: 'Contract',
      workMode: 'On-site',
      salary: '$80,000 - $100,000',
      postedDate: '3 days ago',
      description: 'We need a creative UX Designer to help us...',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Your Next Opportunity</h1>
        <p className="text-gray-600 mt-2">Discover amazing job opportunities that match your skills</p>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Job title, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-500 focus:border-transparent"
            />
          </div>

          <button className="bg-linkedin-500 text-white px-6 py-3 rounded-lg hover:bg-linkedin-600 transition-colors">
            Search Jobs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Job Type</h4>
                <div className="space-y-2">
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-linkedin-500 focus:ring-linkedin-500" />
                      <span className="ml-2 text-sm text-gray-600">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Work Mode</h4>
                <div className="space-y-2">
                  {['Remote', 'On-site', 'Hybrid'].map((mode) => (
                    <label key={mode} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-linkedin-500 focus:ring-linkedin-500" />
                      <span className="ml-2 text-sm text-gray-600">{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Experience Level</h4>
                <div className="space-y-2">
                  {['Entry', 'Mid', 'Senior', 'Executive'].map((level) => (
                    <label key={level} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-linkedin-500 focus:ring-linkedin-500" />
                      <span className="ml-2 text-sm text-gray-600">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {sampleJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-linkedin-500 cursor-pointer">
                      {job.title}
                    </h3>
                    <p className="text-lg text-gray-700 mt-1">{job.company}</p>
                  </div>
                  <span className="text-sm text-gray-500">{job.postedDate}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {job.jobType}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-1" />
                    {job.workMode}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {job.salary}
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                <div className="flex space-x-3">
                  <button className="bg-linkedin-500 text-white px-4 py-2 rounded-lg hover:bg-linkedin-600 transition-colors">
                    Apply Now
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Save Job
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              Load More Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;