import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
  HiOutlineBriefcase,
  HiOutlineOfficeBuilding,
  HiOutlineAcademicCap,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineClock
} from 'react-icons/hi';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/admin/jobs');
        setJobs(res.data);
      } catch (err) {
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

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
      <div>
        <h1 className="text-2xl font-bold text-dark">Job Monitoring</h1>
        <p className="text-maintext mt-1">Overview of all job postings across companies</p>
      </div>

      {/* Jobs Table */}
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
          <p className="text-maintext">No companies have posted jobs yet</p>
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
                  <th className="text-left py-4 px-6 font-semibold text-dark text-sm">Job Title</th>
                  <th className="text-left py-4 px-6 font-semibold text-dark text-sm">Company</th>
                  <th className="text-left py-4 px-6 font-semibold text-dark text-sm">Branch</th>
                  <th className="text-left py-4 px-6 font-semibold text-dark text-sm">Min CGPA</th>
                  <th className="text-left py-4 px-6 font-semibold text-dark text-sm">Max Backlogs</th>
                  <th className="text-left py-4 px-6 font-semibold text-dark text-sm">Deadline</th>
                  <th className="text-left py-4 px-6 font-semibold text-dark text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/50 hover:bg-background/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <HiOutlineBriefcase className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-dark">{job.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <HiOutlineOfficeBuilding className="w-4 h-4 text-maintext" />
                        <span className="text-maintext">{job.company?.companyName || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <HiOutlineAcademicCap className="w-4 h-4 text-maintext" />
                        <span className="text-maintext">{job.branchRequired}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-maintext">{job.minCgpa}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-maintext">{job.maxBacklogs}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-maintext">
                        <HiOutlineCalendar className="w-4 h-4" />
                        <span>{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Open'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {job.status === 'Active' || job.approved ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success/10 text-success text-xs font-medium">
                          <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warning/10 text-warning text-xs font-medium">
                          <HiOutlineClock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-border bg-background/50">
            <p className="text-sm text-maintext">
              Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminJobs;
