import { Router } from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} from '../controllers/jobController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getJobs);
router.get('/:jobId', getJobById);

// Protected routes - Job seekers
router.post('/:jobId/apply', authenticate, authorize('job_seeker'), applyToJob);
router.get('/my-applications', authenticate, getMyApplications);

// Protected routes - Recruiters
router.post('/', authenticate, authorize('recruiter', 'admin'), createJob);
router.put('/:jobId', authenticate, updateJob);
router.delete('/:jobId', authenticate, deleteJob);
router.get('/my-jobs', authenticate, authorize('recruiter', 'admin'), getMyJobs);
router.get('/:jobId/applications', authenticate, getJobApplications);
router.put('/applications/:applicationId/status', authenticate, updateApplicationStatus);

export default router;