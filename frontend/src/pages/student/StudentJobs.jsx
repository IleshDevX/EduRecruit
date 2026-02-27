import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';
import JobCard from '../../components/JobCard';
import Modal from '../../components/Modal';
import { HiOutlineSearch, HiOutlineFilter, HiOutlineBriefcase } from 'react-icons/hi';

const StudentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEligible, setFilterEligible] = useState(false);
  const [confirmJob, setConfirmJob] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/student/jobs');
      setJobs(res.data);
    } catch (err) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!confirmJob) return;
    setApplying(true);
    try {
      await api.post('/student/apply', { jobId: confirmJob.id });
      toast.success('Application submitted successfully!');
      setConfirmJob(null);
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEligible = !filterEligible || job.eligible;
    return matchesSearch && matchesEligible;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dark">Browse Jobs</h1>
        <p className="text-maintext mt-1">Find opportunities that match your profile</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-maintext" />
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-dark placeholder-maintext focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
          <button
            onClick={() => setFilterEligible(!filterEligible)}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
              filterEligible
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'bg-background text-maintext hover:bg-border'
            }`}
          >
            <HiOutlineFilter className="w-5 h-5" />
            Eligible Only
          </button>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm text-maintext">
          <span>{filteredJobs.length} jobs found</span>
          <span className="w-1 h-1 bg-maintext rounded-full"></span>
          <span>{filteredJobs.filter(j => j.eligible).length} you're eligible for</span>
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <HiOutlineBriefcase className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-dark mb-2">No jobs found</h3>
          <p className="text-maintext text-sm">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <JobCard
                job={job}
                eligible={job.eligible}
                applied={job.applied}
                onApply={(job) => setConfirmJob(job)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!confirmJob}
        onClose={() => setConfirmJob(null)}
        title="Confirm Application"
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <h3 className="font-bold text-dark text-lg">{confirmJob?.title}</h3>
            <p className="text-maintext">{confirmJob?.company?.companyName}</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-dark">Job Requirements:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-background">
                <p className="text-maintext">Min CGPA</p>
                <p className="font-bold text-dark">{confirmJob?.minCgpa}</p>
              </div>
              <div className="p-3 rounded-lg bg-background">
                <p className="text-maintext">Max Backlogs</p>
                <p className="font-bold text-dark">{confirmJob?.maxBacklogs}</p>
              </div>
              <div className="p-3 rounded-lg bg-background">
                <p className="text-maintext">Branch</p>
                <p className="font-bold text-dark">{confirmJob?.branchRequired}</p>
              </div>
              <div className="p-3 rounded-lg bg-background">
                <p className="text-maintext">Deadline</p>
                <p className="font-bold text-dark">
                  {confirmJob?.deadline ? new Date(confirmJob.deadline).toLocaleDateString() : 'Open'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleApply}
              disabled={applying}
              className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 transition-all"
            >
              {applying ? 'Submitting...' : 'Confirm Application'}
            </button>
            <button
              onClick={() => setConfirmJob(null)}
              className="flex-1 py-3 bg-background text-maintext rounded-xl font-semibold hover:bg-border transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentJobs;
