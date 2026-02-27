const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getAllCompanies,
  approveCompany,
  getAllJobs,
  getAllApplications,
  getDashboardStats
} = require('../controllers/adminController');

router.use(authenticate, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/companies', getAllCompanies);
router.put('/companies/:companyId/approve', approveCompany);
router.get('/jobs', getAllJobs);
router.get('/applications', getAllApplications);
// Note: Admin cannot modify applications - Company has final authority

module.exports = router;
