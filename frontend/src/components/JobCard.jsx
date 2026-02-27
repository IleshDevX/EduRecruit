import { motion } from 'framer-motion';
import { 
  HiOutlineBriefcase, 
  HiOutlineOfficeBuilding, 
  HiOutlineCalendar,
  HiOutlineAcademicCap,
  HiOutlineCurrencyRupee,
  HiOutlineLocationMarker,
  HiOutlineCheck,
  HiOutlineX
} from 'react-icons/hi';
import StatusBadge from './StatusBadge';

const JobCard = ({ job, onApply, applied = false, eligible = true }) => {
  const isExpired = job.deadline && new Date(job.deadline) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-xl transition-all duration-300 ${
        !eligible ? 'opacity-60' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <HiOutlineBriefcase className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-dark text-lg mb-1">{job.title}</h3>
            <div className="flex items-center gap-2 text-maintext text-sm">
              <HiOutlineOfficeBuilding className="w-4 h-4" />
              <span>{job.company?.companyName || job.companyName || 'Company'}</span>
            </div>
          </div>
        </div>
        {isExpired ? (
          <StatusBadge status="Closed" />
        ) : (
          <StatusBadge status={job.status || 'Open'} />
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="flex items-center gap-2 text-sm text-maintext">
          <HiOutlineAcademicCap className="w-4 h-4 text-primary" />
          <span>Min CGPA: <span className="font-semibold text-dark">{job.minCgpa}</span></span>
        </div>
        <div className="flex items-center gap-2 text-sm text-maintext">
          <HiOutlineCalendar className="w-4 h-4 text-primary" />
          <span>Deadline: <span className="font-semibold text-dark">
            {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Open'}
          </span></span>
        </div>
        <div className="flex items-center gap-2 text-sm text-maintext">
          <HiOutlineLocationMarker className="w-4 h-4 text-primary" />
          <span>Branch: <span className="font-semibold text-dark">{job.branchRequired}</span></span>
        </div>
        <div className="flex items-center gap-2 text-sm text-maintext">
          <HiOutlineX className="w-4 h-4 text-primary" />
          <span>Max Backlogs: <span className="font-semibold text-dark">{job.maxBacklogs}</span></span>
        </div>
      </div>

      {/* Eligibility Indicator */}
      {!eligible && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-danger/5 border border-danger/20 mb-4">
          <HiOutlineX className="w-5 h-5 text-danger" />
          <span className="text-sm text-danger font-medium">You don't meet the eligibility criteria</span>
        </div>
      )}

      {/* Action Button */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          {job.applicationCount !== undefined && (
            <span className="text-xs text-maintext">
              {job.applicationCount} applicant{job.applicationCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {applied ? (
          <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-success/10 text-success rounded-xl text-sm font-semibold">
            <HiOutlineCheck className="w-4 h-4" />
            Applied
          </span>
        ) : (
          <button
            onClick={() => onApply && onApply(job)}
            disabled={!eligible || isExpired}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              eligible && !isExpired
                ? 'bg-primary text-white hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25'
                : 'bg-border text-maintext cursor-not-allowed'
            }`}
          >
            {isExpired ? 'Deadline Passed' : eligible ? 'Apply Now' : 'Not Eligible'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default JobCard;
