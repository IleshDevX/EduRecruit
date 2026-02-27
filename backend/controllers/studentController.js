const Student = require('../models/Student');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');
const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('user', 'name email');
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }
    res.json(student);
  } catch (err) {
    console.error('GetProfile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, branch, cgpa, backlogs, skills } = req.body;
    
    // Update user name if provided
    if (name) {
      await User.findByIdAndUpdate(req.user.id, { name });
    }
    
    const student = await Student.findOneAndUpdate(
      { user: req.user.id },
      { branch, cgpa, backlogs, skills },
      { new: true }
    ).populate('user', 'name email');

    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    res.json({ message: 'Profile updated.', student });
  } catch (err) {
    console.error('UpdateProfile error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Store file path locally
    const resumeUrl = `/uploads/${req.file.filename}`;

    const student = await Student.findOneAndUpdate(
      { user: req.user.id },
      { resumeUrl },
      { new: true }
    );

    res.json({ message: 'Resume uploaded.', resumeUrl: student.resumeUrl });
  } catch (err) {
    console.error('UploadResume error:', err);
    res.status(500).json({ error: 'Failed to upload resume.' });
  }
};

const getEligibleJobs = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    // Get all jobs from approved companies
    const approvedCompanies = await Company.find({ approved: true }).select('_id');
    const approvedCompanyIds = approvedCompanies.map(c => c._id);

    const jobs = await Job.find({ company: { $in: approvedCompanyIds } })
      .populate({
        path: 'company',
        populate: { path: 'user', select: 'name' }
      })
      .sort({ createdAt: -1 });

    // Get student's applications
    const applications = await Application.find({ student: student._id });
    const appliedJobIds = applications.map(a => a.job.toString());

    // Mark eligibility and applied status
    const jobsWithEligibility = jobs.map(job => {
      const isEligible = 
        student.cgpa >= job.minCgpa &&
        (job.branchRequired === 'All' || job.branchRequired === student.branch) &&
        student.backlogs <= job.maxBacklogs;

      return {
        ...job.toObject(),
        eligible: isEligible,
        applied: appliedJobIds.includes(job._id.toString())
      };
    });

    res.json(jobsWithEligibility);
  } catch (err) {
    console.error('GetEligibleJobs error:', err);
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
};

const applyForJob = async (req, res) => {
  try {
    const { jobId, job_id } = req.body;  // Support both field names
    const actualJobId = jobId || job_id;

    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    const job = await Job.findById(actualJobId).populate('company');
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    if (!job.company.approved) {
      return res.status(400).json({ error: 'Company not approved.' });
    }

    // Check eligibility
    const isEligible = 
      student.cgpa >= job.minCgpa &&
      (job.branchRequired === 'All' || job.branchRequired === student.branch) &&
      student.backlogs <= job.maxBacklogs;

    if (!isEligible) {
      return res.status(400).json({ error: 'You are not eligible for this job.' });
    }

    // Check if already applied
    const existing = await Application.findOne({ student: student._id, job: actualJobId });
    if (existing) {
      return res.status(409).json({ error: 'Already applied for this job.' });
    }

    const application = await Application.create({
      student: student._id,
      job: actualJobId,
      status: 'Applied'
    });

    res.status(201).json({ message: 'Application submitted.', application });
  } catch (err) {
    console.error('ApplyForJob error:', err);
    res.status(500).json({ error: 'Failed to apply.' });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    const applications = await Application.find({ student: student._id })
      .populate({
        path: 'job',
        populate: {
          path: 'company',
          populate: { path: 'user', select: 'name' }
        }
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error('GetMyApplications error:', err);
    res.status(500).json({ error: 'Failed to fetch applications.' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadResume,
  getEligibleJobs,
  applyForJob,
  getMyApplications
};
