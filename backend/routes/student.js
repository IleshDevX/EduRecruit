const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  uploadResume,
  getEligibleJobs,
  applyForJob,
  getMyApplications
} = require('../controllers/studentController');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + '.pdf');
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed.'), false);
    }
  }
});

router.use(authenticate, authorize('student'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/resume', upload.single('resume'), uploadResume);
router.get('/jobs', getEligibleJobs);
router.post('/apply', applyForJob);
router.get('/applications', getMyApplications);

module.exports = router;
