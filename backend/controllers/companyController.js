const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const Student = require('../models/Student');

const getCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id });
    if (!company) {
      return res.status(404).json({ error: 'Company profile not found.' });
    }
    res.json(company);
  } catch (err) {
    console.error('GetCompanyProfile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
};

const getCompanyStats = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id });
    if (!company) {
      return res.status(404).json({ error: 'Company profile not found.' });
    }

    // Get all jobs for this company
    const jobs = await Job.find({ company: company._id });
    const jobIds = jobs.map(j => j._id);

    // Get all applications for company's jobs
    const applications = await Application.find({ job: { $in: jobIds } });

    // Calculate stats
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.status === 'Active').length;
    const totalApplicants = applications.length;
    const selectedCount = applications.filter(a => a.status === 'Selected').length;

    res.json({
      status: company.approved ? 'Approved' : 'Pending',
      totalJobs,
      activeJobs,
      totalApplicants,
      selectedCount,
      companyName: company.companyName
    });
  } catch (err) {
    console.error('GetCompanyStats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
};

const createJob = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id });
    if (!company) {
      return res.status(404).json({ error: 'Company profile not found.' });
    }

    if (!company.approved) {
      return res.status(403).json({ error: 'Company not approved yet. Wait for admin approval.' });
    }

    const { title, description, minCgpa, branchRequired, maxBacklogs, deadline } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    const job = await Job.create({
      company: company._id,
      title,
      description,
      minCgpa: minCgpa || 0,
      branchRequired: branchRequired || 'All',
      maxBacklogs: maxBacklogs || 0,
      deadline: deadline || null
    });

    res.status(201).json({ message: 'Job posted successfully.', job });
  } catch (err) {
    console.error('CreateJob error:', err);
    res.status(500).json({ error: 'Failed to create job.' });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id });
    if (!company) {
      return res.status(404).json({ error: 'Company profile not found.' });
    }

    const jobs = await Job.find({ company: company._id }).sort({ createdAt: -1 });

    // Get applications with full student data for each job
    const jobsWithApplications = await Promise.all(jobs.map(async (job) => {
      const applications = await Application.find({ job: job._id })
        .populate({
          path: 'student',
          select: 'branch cgpa backlogs phone resume user',
          populate: { path: 'user', select: 'name email' }
        })
        .sort({ createdAt: -1 });

      // Transform applications to include student data at top level for easy access
      const transformedApplications = applications.map(app => {
        const appObj = app.toObject();
        if (appObj.student && appObj.student.user) {
          appObj.student = {
            ...appObj.student,
            name: appObj.student.user.name,
            email: appObj.student.user.email
          };
        }
        return appObj;
      });

      return {
        ...job.toObject(),
        applications: transformedApplications,
        applicationCount: applications.length,
        approved: company.approved  // Include company's approval status
      };
    }));

    res.json(jobsWithApplications);
  } catch (err) {
    console.error('GetMyJobs error:', err);
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
};

const getApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    const company = await Company.findOne({ user: req.user.id });
    if (!company) {
      return res.status(404).json({ error: 'Company profile not found.' });
    }

    const job = await Job.findById(jobId);
    if (!job || job.company.toString() !== company._id.toString()) {
      return res.status(404).json({ error: 'Job not found or access denied.' });
    }

    const applications = await Application.find({ job: jobId })
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error('GetApplicants error:', err);
    res.status(500).json({ error: 'Failed to fetch applicants.' });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Valid statuses
    const validStatuses = ['Shortlisted', 'Interview', 'Selected', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Use: ${validStatuses.join(', ')}.` });
    }

    const company = await Company.findOne({ user: req.user.id });
    if (!company) {
      return res.status(404).json({ error: 'Company profile not found.' });
    }

    const application = await Application.findById(applicationId).populate('job');
    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    if (application.job.company.toString() !== company._id.toString()) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const currentStatus = application.status;
    
    // Final statuses cannot be changed (LOCKED)
    if (currentStatus === 'Selected' || currentStatus === 'Rejected') {
      return res.status(400).json({ error: `Status is locked. Cannot change from "${currentStatus}" - final decision already made.` });
    }

    // Validate status transition flow
    const allowedTransitions = {
      'Applied': ['Shortlisted', 'Rejected'],
      'Shortlisted': ['Interview', 'Rejected'],
      'Interview': ['Selected', 'Rejected']
    };

    const allowed = allowedTransitions[currentStatus] || [];
    if (!allowed.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid transition. From "${currentStatus}" you can only move to: ${allowed.join(' or ')}.` 
      });
    }

    application.status = status;
    await application.save();

    // Populate for response
    await application.populate({
      path: 'student',
      populate: { path: 'user', select: 'name email' }
    });

    // Create notification for student
    try {
      const student = await Student.findById(application.student._id || application.student);
      if (student && student.user) {
        const statusMessages = {
          'Shortlisted': 'Congratulations! You have been shortlisted',
          'Interview': 'You have been scheduled for an interview',
          'Selected': 'Congratulations! You have been selected',
          'Rejected': 'Your application status has been updated'
        };

        await Notification.create({
          user: student.user,
          type: 'application_status',
          title: status === 'Selected' ? '🎉 You got selected!' : 
                 status === 'Rejected' ? 'Application Update' :
                 `Application ${status}`,
          message: `${statusMessages[status]} for ${application.job.title} at ${company.companyName}`,
          data: {
            applicationId: application._id,
            jobId: application.job._id,
            status: status
          }
        });
      }
    } catch (notifErr) {
      console.error('Failed to create notification:', notifErr);
    }

    res.json({ message: `Application status updated to ${status}.`, application });
  } catch (err) {
    console.error('UpdateApplicationStatus error:', err);
    res.status(500).json({ error: 'Failed to update application.' });
  }
};

module.exports = {
  getCompanyProfile,
  getCompanyStats,
  createJob,
  getMyJobs,
  getApplicants,
  updateApplicationStatus
};
