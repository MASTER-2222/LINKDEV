import { Response } from 'express';
import { pool } from '../config/database.js';
import { AuthRequest, JobFilters } from '../types/index.js';
import { createError, asyncHandler } from '../middleware/errorHandler.js';

const convertJobFromDb = (dbJob: any) => ({
  id: dbJob.id,
  title: dbJob.title,
  company: dbJob.company,
  location: dbJob.location,
  description: dbJob.description,
  requirements: dbJob.requirements,
  salary: dbJob.salary,
  jobType: dbJob.job_type,
  workMode: dbJob.work_mode,
  experienceLevel: dbJob.experience_level,
  recruiterId: dbJob.recruiter_id,
  isActive: dbJob.is_active,
  createdAt: dbJob.created_at,
  updatedAt: dbJob.updated_at,
});

const convertApplicationFromDb = (dbApp: any) => ({
  id: dbApp.id,
  jobId: dbApp.job_id,
  applicantId: dbApp.applicant_id,
  status: dbApp.status,
  coverLetter: dbApp.cover_letter,
  createdAt: dbApp.created_at,
  updatedAt: dbApp.updated_at,
});

export const getJobs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { 
    search, 
    location, 
    jobType, 
    workMode, 
    experienceLevel, 
    page = 1, 
    limit = 10 
  }: JobFilters = req.query;

  const offset = (Number(page) - 1) * Number(limit);
  let whereConditions = ['j.is_active = true'];
  const queryParams: any[] = [];

  if (search) {
    whereConditions.push(`(
      j.title ILIKE $${queryParams.length + 1} OR 
      j.company ILIKE $${queryParams.length + 1} OR 
      j.description ILIKE $${queryParams.length + 1}
    )`);
    queryParams.push(`%${search}%`);
  }

  if (location) {
    whereConditions.push(`j.location ILIKE $${queryParams.length + 1}`);
    queryParams.push(`%${location}%`);
  }

  if (jobType) {
    whereConditions.push(`j.job_type = $${queryParams.length + 1}`);
    queryParams.push(jobType);
  }

  if (workMode) {
    whereConditions.push(`j.work_mode = $${queryParams.length + 1}`);
    queryParams.push(workMode);
  }

  if (experienceLevel) {
    whereConditions.push(`j.experience_level = $${queryParams.length + 1}`);
    queryParams.push(experienceLevel);
  }

  // Count total jobs
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM jobs j WHERE ${whereConditions.join(' AND ')}`,
    queryParams
  );
  const total = parseInt(countResult.rows[0].count);

  // Get jobs with recruiter info
  const result = await pool.query(
    `SELECT j.*, 
            u.first_name as recruiter_first_name, 
            u.last_name as recruiter_last_name,
            u.profile_picture as recruiter_profile_picture
     FROM jobs j
     JOIN users u ON j.recruiter_id = u.id
     WHERE ${whereConditions.join(' AND ')}
     ORDER BY j.created_at DESC
     LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`,
    [...queryParams, limit, offset]
  );

  const jobs = result.rows.map(job => ({
    ...convertJobFromDb(job),
    recruiter: {
      id: job.recruiter_id,
      firstName: job.recruiter_first_name,
      lastName: job.recruiter_last_name,
      profilePicture: job.recruiter_profile_picture,
    },
  }));

  const totalPages = Math.ceil(total / Number(limit));

  res.json({
    success: true,
    data: {
      jobs,
      total,
      totalPages,
      currentPage: Number(page),
    },
  });
});

export const getJobById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { jobId } = req.params;

  const result = await pool.query(
    `SELECT j.*, 
            u.first_name as recruiter_first_name, 
            u.last_name as recruiter_last_name,
            u.profile_picture as recruiter_profile_picture,
            u.headline as recruiter_headline
     FROM jobs j
     JOIN users u ON j.recruiter_id = u.id
     WHERE j.id = $1`,
    [jobId]
  );

  if (result.rows.length === 0) {
    throw createError(404, 'Job not found');
  }

  const job = result.rows[0];
  const jobData = {
    ...convertJobFromDb(job),
    recruiter: {
      id: job.recruiter_id,
      firstName: job.recruiter_first_name,
      lastName: job.recruiter_last_name,
      profilePicture: job.recruiter_profile_picture,
      headline: job.recruiter_headline,
    },
  };

  res.json({
    success: true,
    data: jobData,
  });
});

export const createJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError(401, 'Authentication required');
  }

  if (req.user.role !== 'recruiter' && req.user.role !== 'admin') {
    throw createError(403, 'Only recruiters can create jobs');
  }

  const {
    title,
    company,
    location,
    description,
    requirements,
    salary,
    jobType,
    workMode,
    experienceLevel,
  } = req.body;

  // Validation
  if (!title || !company || !location || !description || !requirements || !jobType || !workMode || !experienceLevel) {
    throw createError(400, 'All required fields must be provided');
  }

  const result = await pool.query(
    `INSERT INTO jobs (
      title, company, location, description, requirements, salary,
      job_type, work_mode, experience_level, recruiter_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
    RETURNING *`,
    [title, company, location, description, requirements, salary, jobType, workMode, experienceLevel, req.user.id]
  );

  const job = convertJobFromDb(result.rows[0]);

  res.status(201).json({
    success: true,
    data: job,
    message: 'Job created successfully',
  });
});

export const updateJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError(401, 'Authentication required');
  }

  const { jobId } = req.params;

  // Check if job exists and user owns it
  const jobResult = await pool.query(
    'SELECT * FROM jobs WHERE id = $1',
    [jobId]
  );

  if (jobResult.rows.length === 0) {
    throw createError(404, 'Job not found');
  }

  const job = jobResult.rows[0];

  if (job.recruiter_id !== req.user.id && req.user.role !== 'admin') {
    throw createError(403, 'You can only update your own jobs');
  }

  const {
    title,
    company,
    location,
    description,
    requirements,
    salary,
    jobType,
    workMode,
    experienceLevel,
    isActive,
  } = req.body;

  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (title !== undefined) {
    updates.push(`title = $${paramCount++}`);
    values.push(title);
  }
  if (company !== undefined) {
    updates.push(`company = $${paramCount++}`);
    values.push(company);
  }
  if (location !== undefined) {
    updates.push(`location = $${paramCount++}`);
    values.push(location);
  }
  if (description !== undefined) {
    updates.push(`description = $${paramCount++}`);
    values.push(description);
  }
  if (requirements !== undefined) {
    updates.push(`requirements = $${paramCount++}`);
    values.push(requirements);
  }
  if (salary !== undefined) {
    updates.push(`salary = $${paramCount++}`);
    values.push(salary);
  }
  if (jobType !== undefined) {
    updates.push(`job_type = $${paramCount++}`);
    values.push(jobType);
  }
  if (workMode !== undefined) {
    updates.push(`work_mode = $${paramCount++}`);
    values.push(workMode);
  }
  if (experienceLevel !== undefined) {
    updates.push(`experience_level = $${paramCount++}`);
    values.push(experienceLevel);
  }
  if (isActive !== undefined) {
    updates.push(`is_active = $${paramCount++}`);
    values.push(isActive);
  }

  if (updates.length === 0) {
    throw createError(400, 'No fields to update');
  }

  values.push(jobId);

  const result = await pool.query(
    `UPDATE jobs SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  );

  const updatedJob = convertJobFromDb(result.rows[0]);

  res.json({
    success: true,
    data: updatedJob,
    message: 'Job updated successfully',
  });
});

export const deleteJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError(401, 'Authentication required');
  }

  const { jobId } = req.params;

  // Check if job exists and user owns it
  const jobResult = await pool.query(
    'SELECT * FROM jobs WHERE id = $1',
    [jobId]
  );

  if (jobResult.rows.length === 0) {
    throw createError(404, 'Job not found');
  }

  const job = jobResult.rows[0];

  if (job.recruiter_id !== req.user.id && req.user.role !== 'admin') {
    throw createError(403, 'You can only delete your own jobs');
  }

  await pool.query('DELETE FROM jobs WHERE id = $1', [jobId]);

  res.json({
    success: true,
    message: 'Job deleted successfully',
  });
});

export const getMyJobs = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError(401, 'Authentication required');
  }

  if (req.user.role !== 'recruiter' && req.user.role !== 'admin') {
    throw createError(403, 'Only recruiters can view their jobs');
  }

  const result = await pool.query(
    'SELECT * FROM jobs WHERE recruiter_id = $1 ORDER BY created_at DESC',
    [req.user.id]
  );

  const jobs = result.rows.map(convertJobFromDb);

  res.json({
    success: true,
    data: jobs,
  });
});

export const applyToJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError(401, 'Authentication required');
  }

  if (req.user.role !== 'job_seeker') {
    throw createError(403, 'Only job seekers can apply to jobs');
  }

  const { jobId } = req.params;
  const { coverLetter } = req.body;

  // Check if job exists and is active
  const jobResult = await pool.query(
    'SELECT * FROM jobs WHERE id = $1 AND is_active = true',
    [jobId]
  );

  if (jobResult.rows.length === 0) {
    throw createError(404, 'Job not found or not active');
  }

  // Check if user already applied
  const existingApplication = await pool.query(
    'SELECT id FROM job_applications WHERE job_id = $1 AND applicant_id = $2',
    [jobId, req.user.id]
  );

  if (existingApplication.rows.length > 0) {
    throw createError(409, 'You have already applied to this job');
  }

  const result = await pool.query(
    `INSERT INTO job_applications (job_id, applicant_id, cover_letter) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [jobId, req.user.id, coverLetter]
  );

  const application = convertApplicationFromDb(result.rows[0]);

  res.status(201).json({
    success: true,
    data: application,
    message: 'Application submitted successfully',
  });
});

export const getMyApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError(401, 'Authentication required');
  }

  const result = await pool.query(
    `SELECT ja.*, 
            j.title, j.company, j.location, j.job_type, j.work_mode,
            u.first_name as recruiter_first_name, u.last_name as recruiter_last_name
     FROM job_applications ja
     JOIN jobs j ON ja.job_id = j.id
     JOIN users u ON j.recruiter_id = u.id
     WHERE ja.applicant_id = $1
     ORDER BY ja.created_at DESC`,
    [req.user.id]
  );

  const applications = result.rows.map(app => ({
    ...convertApplicationFromDb(app),
    job: {
      id: app.job_id,
      title: app.title,
      company: app.company,
      location: app.location,
      jobType: app.job_type,
      workMode: app.work_mode,
      recruiter: {
        firstName: app.recruiter_first_name,
        lastName: app.recruiter_last_name,
      },
    },
  }));

  res.json({
    success: true,
    data: applications,
  });
});

export const getJobApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError(401, 'Authentication required');
  }

  const { jobId } = req.params;

  // Check if job exists and user owns it
  const jobResult = await pool.query(
    'SELECT * FROM jobs WHERE id = $1',
    [jobId]
  );

  if (jobResult.rows.length === 0) {
    throw createError(404, 'Job not found');
  }

  const job = jobResult.rows[0];

  if (job.recruiter_id !== req.user.id && req.user.role !== 'admin') {
    throw createError(403, 'You can only view applications for your own jobs');
  }

  const result = await pool.query(
    `SELECT ja.*, 
            u.first_name, u.last_name, u.email, u.profile_picture, u.headline, u.resume
     FROM job_applications ja
     JOIN users u ON ja.applicant_id = u.id
     WHERE ja.job_id = $1
     ORDER BY ja.created_at DESC`,
    [jobId]
  );

  const applications = result.rows.map(app => ({
    ...convertApplicationFromDb(app),
    applicant: {
      id: app.applicant_id,
      firstName: app.first_name,
      lastName: app.last_name,
      email: app.email,
      profilePicture: app.profile_picture,
      headline: app.headline,
      resume: app.resume,
    },
  }));

  res.json({
    success: true,
    data: applications,
  });
});

export const updateApplicationStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError(401, 'Authentication required');
  }

  const { applicationId } = req.params;
  const { status } = req.body;

  if (!['pending', 'reviewing', 'interview', 'accepted', 'rejected'].includes(status)) {
    throw createError(400, 'Invalid status');
  }

  // Check if application exists and user owns the job
  const result = await pool.query(
    `SELECT ja.*, j.recruiter_id 
     FROM job_applications ja
     JOIN jobs j ON ja.job_id = j.id
     WHERE ja.id = $1`,
    [applicationId]
  );

  if (result.rows.length === 0) {
    throw createError(404, 'Application not found');
  }

  const application = result.rows[0];

  if (application.recruiter_id !== req.user.id && req.user.role !== 'admin') {
    throw createError(403, 'You can only update applications for your own jobs');
  }

  const updateResult = await pool.query(
    'UPDATE job_applications SET status = $1 WHERE id = $2 RETURNING *',
    [status, applicationId]
  );

  const updatedApplication = convertApplicationFromDb(updateResult.rows[0]);

  res.json({
    success: true,
    data: updatedApplication,
    message: 'Application status updated successfully',
  });
});