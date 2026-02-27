import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';
import StatusBadge from '../../components/StatusBadge';
import {
  HiOutlineClipboardList,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineOfficeBuilding,
  HiOutlineEye
} from 'react-icons/hi';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/admin/applications');
      setApplications(res.data);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = applications.filter((a) => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const filters = ['all', 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

  const getFilterColor = (f, isActive) => {
    if (!isActive) return 'bg-white text-maintext border border-border hover:border-primary';
    switch (f) {
      case 'Applied': return 'bg-info text-white shadow-md';
      case 'Shortlisted': return 'bg-secondary text-white shadow-md';
      case 'Interview': return 'bg-warning text-white shadow-md';
      case 'Selected': return 'bg-success text-white shadow-md';
      case 'Rejected': return 'bg-danger text-white shadow-md';
      default: return 'bg-primary text-white shadow-md';
    }
  };

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
          <h1 className="text-2xl font-bold text-dark">Application Overview</h1>
          <p className="text-maintext mt-1">Monitor all placement applications</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-maintext">Total Applications</p>
          <p className="text-2xl font-bold text-dark">{applications.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${getFilterColor(f, filter === f)}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Applications Table */}
      {filteredApps.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border p-12 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
            <HiOutlineClipboardList className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-dark mb-2">No Applications Found</h3>
          <p className="text-maintext">
            {filter === 'all' 
              ? 'No applications have been submitted yet' 
              : `No applications with "${filter}" status`}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-background border-b border-border">
                  <th className="text-left py-4 px-6 font-semibold text-dark text-sm">Student</th>
                  <th className="text-left py-4 px-6 font-semibold text-dark text-sm">Job</th>
                  <th className="text-left py-4 px-6 font-semibold text-dark text-sm">Company</th>
                  <th className="text-left py-4 px-6 font-semibold text-dark text-sm">CGPA</th>
                  <th className="text-left py-4 px-6 font-semibold text-dark text-sm">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-dark text-sm">Resume</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app, i) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border/50 hover:bg-background/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-bold text-sm">
                            {app.student?.name?.charAt(0) || 'S'}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-dark truncate">{app.student?.name || 'N/A'}</p>
                          <p className="text-xs text-maintext truncate">{app.student?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <HiOutlineBriefcase className="w-4 h-4 text-maintext flex-shrink-0" />
                        <span className="text-maintext truncate max-w-[150px]">{app.job?.title || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <HiOutlineOfficeBuilding className="w-4 h-4 text-maintext flex-shrink-0" />
                        <span className="text-maintext truncate max-w-[120px]">{app.job?.company?.companyName || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-maintext">{app.student?.cgpa || 'N/A'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-4 px-6">
                      {app.student?.resume ? (
                        <a
                          href={`${BACKEND}${app.student.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                        >
                          <HiOutlineEye className="w-3.5 h-3.5" />
                          View
                        </a>
                      ) : (
                        <span className="text-xs text-maintext/50 italic">No resume</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-border bg-background/50 flex items-center justify-between">
            <p className="text-sm text-maintext">
              Showing {filteredApps.length} of {applications.length} application{applications.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-maintext/70">
              * Admin view is read-only. Hiring decisions are managed by recruiters.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminApplications;
