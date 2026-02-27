const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getCompanyProfile,
  getCompanyStats,
  createJob,
  getMyJobs,
  getApplicants,
  updateApplicationStatus
} = require('../controllers/companyController');

router.use(authenticate, authorize('company'));

router.get('/profile', getCompanyProfile);
router.get('/stats', getCompanyStats);
router.post('/jobs', createJob);
router.get('/jobs', getMyJobs);
router.get('/jobs/:jobId/applicants', getApplicants);
router.put('/applications/:applicationId', updateApplicationStatus);

module.exports = router;
