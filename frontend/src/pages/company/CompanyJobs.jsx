import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus,
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlineEye,
  HiOutlineDocumentDownload,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineAcademicCap,
  HiOutlineExclamation
} from 'react-icons/hi';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const CompanyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicantsModal, setApplicantsModal] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, action: null, appId: null });
  const [profileModal, setProfileModal] = useState({ open: false, student: null });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/company/jobs');
      setJobs(res.data);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const openApplicants = (job) => {
    setSelectedJob(job);
    setApplicantsModal(true);
  };

  const updateStatus = async (appId, status) => {
    try {
      await api.put(`/company/applications/${appId}`, { status });
      const res = await api.get('/company/jobs');
      setJobs(res.data);
      const updatedJob = res.data.find((j) => j._id === selectedJob._id);
      if (updatedJob) setSelectedJob(updatedJob);
      toast.success(`Status updated to ${status}`);
      setConfirm({ open: false, action: null, appId: null });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    }
  };

  const handleFinalDecision = (appId, action) => {
    setConfirm({ open: true, action, appId });
  };

  const confirmDecision = () => {
    if (confirm.appId && confirm.action) {
      updateStatus(confirm.appId, confirm.action);
    }
  };

  const getStatusOptions = (currentStatus) => {
    switch (currentStatus) {
      case 'Applied':
        return [
          { status: 'Shortlisted', label: 'Shortlist', icon: HiOutlineCheck, color: 'bg-info hover:bg-info/90' },
          { status: 'Rejected', label: 'Reject', icon: HiOutlineX, color: 'bg-danger hover:bg-danger/90', isFinal: true }
        ];
      case 'Shortlisted':
        return [
          { status: 'Interview', label: 'Schedule Interview', icon: HiOutlineClock, color: 'bg-warning hover:bg-warning/90' },
          { status: 'Rejected', label: 'Reject', icon: HiOutlineX, color: 'bg-danger hover:bg-danger/90', isFinal: true }
        ];
      case 'Interview':
        return [
          { status: 'Selected', label: 'Select', icon: HiOutlineCheck, color: 'bg-success hover:bg-success/90', isFinal: true },
          { status: 'Rejected', label: 'Reject', icon: HiOutlineX, color: 'bg-danger hover:bg-danger/90', isFinal: true }
        ];
      default:
        return [];
    }
  };

  const isFinalStatus = (status) => ['Selected', 'Rejected'].includes(status);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Manage Jobs</h1>
          <p className="text-maintext mt-1">View and manage your job postings</p>
        </div>
        <Link
          to="/company/post-job"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Post New Job
        </Link>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border p-12 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
            <HiOutlineBriefcase className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-dark mb-2">No Jobs Posted</h3>
          <p className="text-maintext mb-6">Start by creating your first job listing</p>
          <Link
            to="/company/post-job"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Post Your First Job
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-border p-6 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary group-hover:to-primary-dark transition-all">
                      <HiOutlineBriefcase className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-dark group-hover:text-primary transition-colors">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 text-primary text-sm font-medium">
                          <HiOutlineAcademicCap className="w-4 h-4" />
                          {job.branchRequired}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background text-maintext text-sm font-medium">
                          Min CGPA: {job.minCgpa}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background text-maintext text-sm font-medium">
                          Max Backlogs: {job.maxBacklogs}
                        </span>
                        {job.deadline && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warning/10 text-warning text-sm font-medium">
                            <HiOutlineCalendar className="w-4 h-4" />
                            {new Date(job.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {job.description && (
                        <p className="text-maintext mt-3 line-clamp-2">{job.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                    job.approved 
                      ? 'bg-gradient-to-r from-success/10 to-success/5 text-success border border-success/20' 
                      : 'bg-gradient-to-r from-warning/10 to-warning/5 text-warning border border-warning/20'
                  }`}>
                    {job.approved ? (
                      <><HiOutlineCheck className="w-4 h-4" /> Approved</>
                    ) : (
                      <><HiOutlineClock className="w-4 h-4" /> Pending Approval</>
                    )}
                  </div>
                  <button
                    onClick={() => openApplicants(job)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all group/btn"
                  >
                    <HiOutlineUsers className="w-5 h-5 text-primary" />
                    <span className="font-bold text-dark group-hover/btn:text-primary transition-colors">{job.applications?.length || 0}</span>
                    <span className="text-sm text-maintext">Applicants</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Applicants Modal */}
      <Modal
        isOpen={applicantsModal}
        onClose={() => setApplicantsModal(false)}
        title={`Applicants - ${selectedJob?.title}`}
        size="xl"
      >
        {selectedJob?.applications?.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-background flex items-center justify-center">
              <HiOutlineUsers className="w-8 h-8 text-maintext" />
            </div>
            <p className="text-maintext">No applicants yet</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {selectedJob?.applications?.map((app) => (
              <motion.div
                key={app.id || app._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-5 rounded-xl border ${
                  isFinalStatus(app.status) 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-border'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Candidate Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold">
                          {app.student?.name?.charAt(0) || 'S'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-dark">{app.student?.name || 'Student'}</h4>
                        <p className="text-sm text-maintext">{app.student?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-maintext ml-13">
                      {app.student?.branch && (
                        <span className="px-2.5 py-1 rounded-lg bg-background">
                          {app.student.branch}
                        </span>
                      )}
                      {app.student?.cgpa && (
                        <span className="px-2.5 py-1 rounded-lg bg-background">
                          CGPA: {app.student.cgpa}
                        </span>
                      )}
                      {app.student?.backlogs !== undefined && (
                        <span className="px-2.5 py-1 rounded-lg bg-background">
                          Backlogs: {app.student.backlogs}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.status} />
                    {isFinalStatus(app.status) && (
                      <span className="text-xs text-maintext bg-background px-2 py-1 rounded-lg">
                        Final
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-3">
                  {/* View Profile - Always show */}
                  <button
                    onClick={() => setProfileModal({ open: true, student: app.student })}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-colors"
                  >
                    <HiOutlineEye className="w-4 h-4" />
                    View Profile
                  </button>

                  {/* Download Resume - Always show */}
                  {app.student?.resume ? (
                    <a
                      href={`${BACKEND}${app.student.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary hover:bg-primary/5 border border-primary/20 transition-colors"
                    >
                      <HiOutlineDocumentDownload className="w-4 h-4" />
                      View Resume
                    </a>
                  ) : (
                    <span className="text-sm text-maintext/60 italic">No resume uploaded</span>
                  )}

                  {/* Status Actions - Only if not final */}
                  {!isFinalStatus(app.status) && (
                    <div className="flex items-center gap-2 ml-auto">
                      {getStatusOptions(app.status).map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.status}
                            onClick={() =>
                              opt.isFinal
                                ? handleFinalDecision(app.id || app._id, opt.status)
                                : updateStatus(app.id || app._id, opt.status)
                            }
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white ${opt.color} transition-all`}
                          >
                            <Icon className="w-4 h-4" />
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, action: null, appId: null })}
        title="Confirm Decision"
        size="sm"
      >
        <div className="py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-warning/10 flex items-center justify-center">
            <HiOutlineExclamation className="w-8 h-8 text-warning" />
          </div>
          <p className="text-center text-dark mb-2 font-medium">
            Are you sure you want to {confirm.action === 'Selected' ? 'select' : 'reject'} this candidate?
          </p>
          <p className="text-center text-sm text-maintext mb-6">
            This action is final and cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setConfirm({ open: false, action: null, appId: null })}
              className="px-6 py-2.5 rounded-xl font-medium text-maintext hover:bg-background border border-border transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDecision}
              className={`px-6 py-2.5 rounded-xl font-medium text-white ${
                confirm.action === 'Selected' ? 'bg-success hover:bg-success/90' : 'bg-danger hover:bg-danger/90'
              } transition-colors`}
            >
              {confirm.action === 'Selected' ? 'Confirm Selection' : 'Confirm Rejection'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Student Profile Modal */}
      <Modal
        isOpen={profileModal.open}
        onClose={() => setProfileModal({ open: false, student: null })}
        title="Candidate Profile"
        size="md"
      >
        {profileModal.student && (
          <div className="py-4">
            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {profileModal.student.name?.charAt(0) || 'S'}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark">{profileModal.student.name || 'Student'}</h3>
                <p className="text-maintext">{profileModal.student.email}</p>
              </div>
            </div>

            {/* Profile Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-background">
                <p className="text-sm text-maintext mb-1">Branch</p>
                <p className="font-semibold text-dark">{profileModal.student.branch || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-xl bg-background">
                <p className="text-sm text-maintext mb-1">CGPA</p>
                <p className="font-semibold text-dark">{profileModal.student.cgpa || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-xl bg-background">
                <p className="text-sm text-maintext mb-1">Backlogs</p>
                <p className="font-semibold text-dark">{profileModal.student.backlogs ?? 'N/A'}</p>
              </div>
              <div className="p-4 rounded-xl bg-background">
                <p className="text-sm text-maintext mb-1">Phone</p>
                <p className="font-semibold text-dark">{profileModal.student.phone || 'N/A'}</p>
              </div>
            </div>

            {/* Resume Link */}
            {profileModal.student.resume && (
              <div className="mt-6 pt-6 border-t border-border">
                <a
                  href={`${BACKEND}${profileModal.student.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl text-white bg-gradient-to-r from-primary to-primary-dark font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  <HiOutlineDocumentDownload className="w-5 h-5" />
                  View / Download Resume
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CompanyJobs;
