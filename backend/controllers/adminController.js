const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

// Get ALL companies (for admin management page)
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate('user', 'name email')
      .sort({ approved: 1, createdAt: -1 }); // Pending first, then by date

    res.json(companies);
  } catch (err) {
    console.error('GetAllCompanies error:', err);
    res.status(500).json({ error: 'Failed to fetch companies.' });
  }
};

const approveCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { approved } = req.body;

    const company = await Company.findByIdAndUpdate(
      companyId,
      { approved },
      { new: true }
    ).populate('user', 'name email');

    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
    }

    res.json({ 
      message: approved ? 'Company approved.' : 'Company rejected.', 
      company 
    });
  } catch (err) {
    console.error('ApproveCompany error:', err);
    res.status(500).json({ error: 'Failed to update company.' });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate({
        path: 'company',
        populate: { path: 'user', select: 'name' }
      })
      .sort({ createdAt: -1 });

    // Get application counts
    const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
      const applicationCount = await Application.countDocuments({ job: job._id });
      return {
        ...job.toObject(),
        applicationCount
      };
    }));

    res.json(jobsWithCounts);
  } catch (err) {
    console.error('GetAllJobs error:', err);
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email' }
      })
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
    console.error('GetAllApplications error:', err);
    res.status(500).json({ error: 'Failed to fetch applications.' });
  }
};

// Admin can only view - not modify applications (Company has final authority)

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalCompanies,
      approvedCompanies,
      pendingCompanies,
      totalJobs,
      totalApplications,
      selectedCount,
      rejectedCount,
      pendingReview
    ] = await Promise.all([
      Student.countDocuments(),
      Company.countDocuments(),
      Company.countDocuments({ approved: true }),
      Company.countDocuments({ approved: false }),
      Job.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: 'Selected' }),
      Application.countDocuments({ status: 'Rejected' }),
      Application.countDocuments({ status: 'Applied' })  // Pending review = Applied status
    ]);

    res.json({
      totalStudents,
      totalCompanies,
      approvedCompanies,
      pendingCompanies,
      totalJobs,
      totalApplications,
      selected: selectedCount,
      rejected: rejectedCount,
      pending: pendingReview
    });
  } catch (err) {
    console.error('GetDashboardStats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
};

module.exports = {
  getAllCompanies,
  approveCompany,
  getAllJobs,
  getAllApplications,
  getDashboardStats
};
