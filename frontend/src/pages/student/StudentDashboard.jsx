import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  HiOutlineBriefcase, 
  HiOutlineClipboardList, 
  HiOutlineCheckCircle, 
  HiOutlineClock,
  HiArrowRight,
  HiOutlineTrendingUp,
  HiOutlineCalendar
} from 'react-icons/hi';
import api from '../../services/api';
import DashboardCard from '../../components/DashboardCard';
import StepProgress from '../../components/StepProgress';
import StatusBadge from '../../components/StatusBadge';

const StudentDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          api.get('/student/applications'),
          api.get('/student/jobs'),
        ]);
        setApplications(appsRes.data);
        setJobs(jobsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    totalJobs: jobs.filter(j => j.eligible).length,
    applied: applications.length,
    shortlisted: applications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview').length,
    selected: applications.filter(a => a.status === 'Selected').length,
  };

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
          <h1 className="text-2xl font-bold text-dark">Dashboard</h1>
          <p className="text-maintext mt-1">Track your placement journey</p>
        </div>
        <Link
          to="/student/jobs"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 transition-all group"
        >
          Browse Jobs
          <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Eligible Jobs" 
          value={stats.totalJobs} 
          icon={HiOutlineBriefcase} 
          color="primary"
          subtitle="Jobs matching your profile"
        />
        <DashboardCard 
          title="Applications" 
          value={stats.applied} 
          icon={HiOutlineClipboardList} 
          color="info"
          subtitle="Total submitted"
        />
        <DashboardCard 
          title="In Progress" 
          value={stats.shortlisted} 
          icon={HiOutlineClock} 
          color="warning"
          subtitle="Shortlisted & Interview"
        />
        <DashboardCard 
          title="Selected" 
          value={stats.selected} 
          icon={HiOutlineCheckCircle} 
          color="success"
          subtitle="Placement offers"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-dark">Recent Applications</h2>
              <p className="text-sm text-maintext">Your latest job applications</p>
            </div>
            <Link 
              to="/student/applications"
              className="text-sm text-primary font-semibold hover:text-primary-dark transition-colors"
            >
              View all →
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <HiOutlineClipboardList className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-dark mb-2">No applications yet</h3>
              <p className="text-maintext text-sm mb-4">Start applying to jobs that match your profile</p>
              <Link 
                to="/student/jobs"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 4).map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-background border border-border hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4 mb-3 md:mb-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <HiOutlineBriefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark">{app.job?.title}</h3>
                      <p className="text-sm text-maintext">{app.job?.company?.companyName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={app.status} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats / Activity */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="text-lg font-bold text-dark mb-6">Application Status</h2>
          
          <div className="space-y-4">
            {[
              { label: 'Applied', count: applications.filter(a => a.status === 'Applied').length, color: 'bg-info' },
              { label: 'Shortlisted', count: applications.filter(a => a.status === 'Shortlisted').length, color: 'bg-warning' },
              { label: 'Interview', count: applications.filter(a => a.status === 'Interview').length, color: 'bg-secondary' },
              { label: 'Selected', count: applications.filter(a => a.status === 'Selected').length, color: 'bg-success' },
              { label: 'Rejected', count: applications.filter(a => a.status === 'Rejected').length, color: 'bg-danger' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-maintext">{item.label}</span>
                </div>
                <span className="font-bold text-dark">{item.count}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-maintext">Success Rate</span>
              <span className="font-bold text-primary">
                {applications.length > 0 
                  ? Math.round((stats.selected / applications.length) * 100) 
                  : 0}%
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-border overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${applications.length > 0 ? (stats.selected / applications.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
