import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import DashboardCard from '../../components/DashboardCard';
import StatusBadge from '../../components/StatusBadge';
import { 
  HiOutlineBriefcase, 
  HiOutlineUserGroup, 
  HiOutlineCheckCircle, 
  HiOutlineClipboardList,
  HiArrowRight,
  HiOutlineCalendar
} from 'react-icons/hi';

const CompanyDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          api.get('/company/stats'),
          api.get('/company/jobs'),
        ]);
        setStats(statsRes.data);
        setRecentJobs(jobsRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Recruiter Dashboard</h1>
          <p className="text-maintext mt-1">Manage your job postings and applicants</p>
        </div>
        <Link
          to="/company/post-job"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 transition-all group"
        >
          Post New Job
          <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Company Status */}
      {stats?.status === 'Pending' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-warning/10 border border-warning/30 rounded-2xl p-4 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
            <span className="text-xl">⏳</span>
          </div>
          <div>
            <p className="font-semibold text-dark">Account Pending Approval</p>
            <p className="text-sm text-maintext">Your company is awaiting admin verification. You can still create job postings.</p>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Company Status" 
          value={stats?.status || 'Pending'} 
          icon={stats?.status === 'Approved' ? HiOutlineCheckCircle : HiOutlineClipboardList}
          color={stats?.status === 'Approved' ? 'success' : 'warning'}
          subtitle="Verification"
        />
        <DashboardCard 
          title="Total Jobs" 
          value={stats?.totalJobs || 0} 
          icon={HiOutlineBriefcase} 
          color="primary"
          subtitle="Posted positions"
        />
        <DashboardCard 
          title="Active Jobs" 
          value={stats?.activeJobs || 0} 
          icon={HiOutlineBriefcase} 
          color="info"
          subtitle="Currently open"
        />
        <DashboardCard 
          title="Total Applicants" 
          value={stats?.totalApplications || 0} 
          icon={HiOutlineUserGroup} 
          color="accent"
          subtitle="Across all jobs"
        />
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-dark">Recent Job Postings</h2>
            <p className="text-sm text-maintext">Your latest job listings</p>
          </div>
          <Link 
            to="/company/jobs"
            className="text-sm text-primary font-semibold hover:text-primary-dark transition-colors"
          >
            View all →
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <HiOutlineBriefcase className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-dark mb-2">No jobs posted yet</h3>
            <p className="text-maintext text-sm mb-4">Create your first job posting to start receiving applications</p>
            <Link 
              to="/company/post-job"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors"
            >
              Post a Job
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark">Job Title</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark">Branch</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark">Deadline</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark">Applicants</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job, index) => (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-background transition-colors"
                  >
                    <td className="py-4 px-4">
                      <p className="font-semibold text-dark">{job.title}</p>
                    </td>
                    <td className="py-4 px-4 text-maintext">{job.branchRequired}</td>
                    <td className="py-4 px-4 text-maintext">
                      <span className="flex items-center gap-1.5">
                        <HiOutlineCalendar className="w-4 h-4" />
                        {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Open'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                        <HiOutlineUserGroup className="w-4 h-4" />
                        {job.applicationCount || 0}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={job.status || 'Open'} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
