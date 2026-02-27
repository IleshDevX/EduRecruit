import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';
import StatusBadge from '../../components/StatusBadge';
import StepProgress from '../../components/StepProgress';
import { 
  HiOutlineBriefcase, 
  HiOutlineOfficeBuilding, 
  HiOutlineCalendar,
  HiOutlineClipboardList
} from 'react-icons/hi';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/student/applications');
      setApplications(res.data);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
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
      <div>
        <h1 className="text-2xl font-bold text-dark">My Applications</h1>
        <p className="text-maintext mt-1">Track the status of your job applications</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', count: applications.length, color: 'bg-primary' },
          { label: 'Applied', count: applications.filter(a => a.status === 'Applied').length, color: 'bg-info' },
          { label: 'Shortlisted', count: applications.filter(a => a.status === 'Shortlisted').length, color: 'bg-warning' },
          { label: 'Interview', count: applications.filter(a => a.status === 'Interview').length, color: 'bg-secondary' },
          { label: 'Selected', count: applications.filter(a => a.status === 'Selected').length, color: 'bg-success' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-border p-4 text-center shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-white font-bold mx-auto mb-2`}>
              {stat.count}
            </div>
            <p className="text-sm text-maintext font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <HiOutlineClipboardList className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-dark mb-2">No applications yet</h3>
          <p className="text-maintext text-sm">Start applying to jobs to see your applications here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Job Info */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                    <HiOutlineBriefcase className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-dark text-lg">{app.job?.title}</h3>
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-maintext">
                      <span className="flex items-center gap-1.5">
                        <HiOutlineOfficeBuilding className="w-4 h-4" />
                        {app.job?.company?.companyName}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <HiOutlineCalendar className="w-4 h-4" />
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="lg:flex-shrink-0">
                  <StepProgress currentStatus={app.status} />
                </div>
              </div>

              {/* Status Message */}
              {(app.status === 'Selected' || app.status === 'Rejected') && (
                <div className={`mt-4 p-4 rounded-xl ${
                  app.status === 'Selected' 
                    ? 'bg-success/10 border border-success/20' 
                    : 'bg-danger/10 border border-danger/20'
                }`}>
                  <p className={`text-sm font-medium ${
                    app.status === 'Selected' ? 'text-success' : 'text-danger'
                  }`}>
                    {app.status === 'Selected' 
                      ? '🎉 Congratulations! You have been selected for this position.'
                      : 'Unfortunately, your application was not successful this time.'}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentApplications;
