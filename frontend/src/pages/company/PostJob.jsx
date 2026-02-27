import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiArrowLeft,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle
} from 'react-icons/hi';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    branchRequired: '',
    minCgpa: '',
    maxBacklogs: '',
    deadline: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, branchRequired, minCgpa, maxBacklogs } = formData;

    if (!title || !branchRequired || !minCgpa || maxBacklogs === '') {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/company/jobs', formData);
      toast.success('Job posted successfully!');
      navigate('/company/jobs');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-border transition-all"
        >
          <HiArrowLeft className="w-5 h-5 text-maintext" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-dark">Post New Job</h1>
          <p className="text-maintext mt-1">Create a new job listing for candidates</p>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-border p-8 shadow-lg shadow-primary/5"
      >
        {/* Form Header */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <HiOutlineBriefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-dark">Job Details</h2>
            <p className="text-sm text-maintext">Fill in the information below to create your job listing</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Job Title <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <HiOutlineBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-maintext" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Software Developer Intern"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-white text-dark placeholder-maintext/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              <span className="flex items-center gap-2">
                <HiOutlineDocumentText className="w-4 h-4 text-primary" />
                Job Description
              </span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe the role, responsibilities, and requirements..."
              className="w-full px-4 py-3.5 rounded-xl border border-border bg-white text-dark placeholder-maintext/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
            />
          </div>

          {/* Section Divider */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs font-medium text-maintext uppercase tracking-wider">Eligibility Criteria</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Grid: Branch & CGPA */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Required Branch <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <HiOutlineAcademicCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-maintext" />
                <select
                  name="branchRequired"
                  value={formData.branchRequired}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-white text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none"
                >
                  <option value="">Select Branch</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="All Branches">All Branches</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Minimum CGPA <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <HiOutlineChartBar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-maintext" />
                <input
                  type="number"
                  name="minCgpa"
                  value={formData.minCgpa}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="e.g., 7.0"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-white text-dark placeholder-maintext/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Grid: Backlogs & Deadline */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Maximum Backlogs Allowed <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <HiOutlineExclamationCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-maintext" />
                <input
                  type="number"
                  name="maxBacklogs"
                  value={formData.maxBacklogs}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 0"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-white text-dark placeholder-maintext/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Application Deadline
              </label>
              <div className="relative">
                <HiOutlineCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-maintext" />
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-white text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-border mt-8">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 transition-all"
            >
              <HiOutlineCheckCircle className="w-5 h-5" />
              {loading ? 'Posting...' : 'Post Job'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3.5 bg-background text-maintext rounded-xl font-semibold hover:bg-border transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PostJob;
