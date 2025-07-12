# LINKDEV - LinkedIn Clone

[![Built with React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://reactjs.org/)
[![Backend Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)](https://nodejs.org/)
[![Database PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql)](https://postgresql.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)](https://typescriptlang.org/)

A full-stack LinkedIn clone built with modern web technologies. LINKDEV provides a professional networking platform with job posting, application management, user connections, and social feed features.

## 🚀 Features

### For Job Seekers
- ✅ **User Registration & Authentication** - Secure JWT-based authentication
- ✅ **Profile Management** - Complete profile creation with photo uploads
- ✅ **Job Search & Application** - Browse and apply to job listings
- ✅ **Application Tracking** - Monitor application status
- 🔄 **Professional Networking** - Connect with other professionals
- 🔄 **Social Feed** - Share updates and engage with posts

### For Recruiters
- ✅ **Recruiter Dashboard** - Manage job postings and applications
- ✅ **Job Posting** - Create detailed job listings
- ✅ **Applicant Management** - Review applications and manage hiring pipeline
- ✅ **Candidate Search** - Find potential candidates
- 🔄 **Team Collaboration** - Collaborate with hiring teams

### For Administrators
- ✅ **Admin Dashboard** - Platform analytics and management
- ✅ **User Management** - Manage user accounts and roles
- ✅ **Content Moderation** - Monitor and moderate platform content
- ✅ **System Monitoring** - Platform health and performance metrics

### Additional Features
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🔒 **Security First** - Secure authentication and data protection
- ⚡ **Real-time Updates** - Live notifications and updates
- 🎨 **Modern UI/UX** - Clean, professional interface design

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **TailwindCSS V4** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client
- **Vite** - Fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **PostgreSQL** - Relational database
- **Supabase** - Database hosting and management
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Helmet** - Security middleware

### Infrastructure
- **Render.com** - Backend hosting
- **Vercel.com** - Frontend hosting
- **Supabase** - Database hosting
- **GitHub** - Version control

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or bun package manager
- Git

### Clone Repository
```bash
git clone https://github.com/yourusername/linkdev.git
cd linkdev
```

### Backend Setup
```bash
cd backend
npm install
cp .env.txt .env
# Configure your environment variables in .env
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.txt .env
# Configure your environment variables in .env
npm run dev
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=your_supabase_database_url
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=LINKDEV
VITE_NODE_ENV=development
```

### Database Schema

The application automatically creates the following tables:
- `users` - User accounts and profiles
- `jobs` - Job postings
- `job_applications` - Job applications
- `posts` - Social media posts
- `comments` - Post comments
- `post_likes` - Post likes
- `connections` - User connections

## 🚀 Deployment

Detailed deployment instructions are available in [DEPLOYMENT.md](./docs/DEPLOYMENT.md).

### Quick Deploy

#### Render.com (Backend)
1. Connect GitHub repository
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Configure environment variables

#### Vercel.com (Frontend)
1. Connect GitHub repository
2. Set root directory: `frontend`
3. Framework preset: Vite
4. Configure environment variables

## 📱 Usage

### Getting Started
1. Register as a job seeker or recruiter
2. Complete your profile with professional information
3. Upload a profile picture
4. Start networking and applying to jobs

### For Job Seekers
1. Browse available job listings
2. Use filters to find relevant opportunities
3. Apply to jobs with your profile and cover letter
4. Track application status in your dashboard

### For Recruiters
1. Post job openings with detailed descriptions
2. Review incoming applications
3. Manage hiring pipeline
4. Connect with potential candidates

### For Admins
1. Access admin dashboard
2. Monitor platform metrics
3. Manage user accounts
4. Moderate content

## 🧪 Testing

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Integration Tests
```bash
npm run test:integration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Job Endpoints
- `GET /api/jobs` - Get job listings
- `POST /api/jobs` - Create job (recruiters only)
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs/:id/apply` - Apply to job

### Connection Endpoints
- `POST /api/connections/send` - Send connection request
- `PUT /api/connections/:id/accept` - Accept connection
- `GET /api/connections/my-connections` - Get connections

See full API documentation in [API.md](./docs/API.md).

## 🐛 Known Issues

- Connection system is partially implemented
- Post feed features are in development
- Real-time notifications pending
- Mobile app not yet available

## 🗺️ Roadmap

### Version 2.0
- [ ] Real-time messaging system
- [ ] Video call integration
- [ ] Advanced search filters
- [ ] Mobile application
- [ ] Email notifications

### Version 2.1
- [ ] Company pages
- [ ] Events and webinars
- [ ] Skills assessments
- [ ] Recommendation engine
- [ ] Analytics dashboard

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Lead Developer** - Full-stack development
- **UI/UX Designer** - Interface design
- **DevOps Engineer** - Infrastructure and deployment

## 🙏 Acknowledgments

- LinkedIn for inspiration
- React team for the amazing framework
- Supabase for database hosting
- TailwindCSS for styling system
- All open-source contributors

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@linkdev.com
- Documentation: [docs.linkdev.com](https://docs.linkdev.com)

---

**Built with ❤️ by the LINKDEV team**