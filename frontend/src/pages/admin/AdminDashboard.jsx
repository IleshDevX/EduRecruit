import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineUserGroup, 
  HiOutlineOfficeBuilding, 
  HiOutlineBriefcase, 
  HiOutlineClipboardList, 
  HiOutlineCheckCircle, 
  HiOutlineClock,
  HiOutlineTrendingUp
} from 'react-icons/hi';
import api from '../../services/api';
import DashboardCard from '../../components/DashboardCard';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const processedApps = (stats?.totalApplications || 0) - (stats?.pending || 0);
  const progressPercent = stats?.totalApplications 
    ? Math.round((processedApps / stats.totalApplications) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dark">Admin Dashboard</h1>
        <p className="text-maintext mt-1">Training & Placement Office — System Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={HiOutlineUserGroup}
          color="primary"
        />
        <DashboardCard
          title="Total Companies"
          value={stats?.totalCompanies || 0}
          icon={HiOutlineOfficeBuilding}
          color="secondary"
        />
        <DashboardCard
          title="Total Jobs"
          value={stats?.totalJobs || 0}
          icon={HiOutlineBriefcase}
          color="info"
        />
        <DashboardCard
          title="Total Applications"
          value={stats?.totalApplications || 0}
          icon={HiOutlineClipboardList}
          color="warning"
        />
        <DashboardCard
          title="Selected Candidates"
          value={stats?.selected || 0}
          icon={HiOutlineCheckCircle}
          color="success"
        />
        <DashboardCard
          title="Pending Review"
          value={stats?.pending || 0}
          icon={HiOutlineClock}
          color="danger"
        />
      </div>

      {/* Progress Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Placement Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <HiOutlineTrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-dark">Placement Progress</h2>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-maintext">Applications Processed</span>
                <span className="text-dark font-semibold">
                  {processedApps}/{stats?.totalApplications || 0}
                </span>
              </div>
              <div className="w-full bg-background rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-primary to-primary-light h-3 rounded-full"
                />
              </div>
              <p className="text-xs text-maintext mt-1">{progressPercent}% complete</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-maintext">Selection Rate</span>
                <span className="text-dark font-semibold">
                  {stats?.totalApplications 
                    ? Math.round(((stats?.selected || 0) / stats.totalApplications) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-background rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${stats?.totalApplications 
                      ? ((stats?.selected || 0) / stats.totalApplications) * 100 
                      : 0}%` 
                  }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="bg-gradient-to-r from-success to-emerald-400 h-3 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-border p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-dark mb-6">Quick Insights</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-background">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <HiOutlineCheckCircle className="w-4 h-4 text-success" />
                </div>
                <span className="text-maintext">Placement Rate</span>
              </div>
              <span className="text-lg font-bold text-success">
                {stats?.totalStudents 
                  ? Math.round(((stats?.selected || 0) / stats.totalStudents) * 100) 
                  : 0}%
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-background">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
                  <HiOutlineBriefcase className="w-4 h-4 text-info" />
                </div>
                <span className="text-maintext">Avg Applications/Job</span>
              </div>
              <span className="text-lg font-bold text-info">
                {stats?.totalJobs 
                  ? Math.round((stats?.totalApplications || 0) / stats.totalJobs)
                  : 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-background">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                  <HiOutlineClock className="w-4 h-4 text-warning" />
                </div>
                <span className="text-maintext">Pending Review</span>
              </div>
              <span className="text-lg font-bold text-warning">{stats?.pending || 0}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
