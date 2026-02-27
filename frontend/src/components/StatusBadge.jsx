const StatusBadge = ({ status, size = 'md' }) => {
  const statusStyles = {
    // Application statuses
    'Applied': {
      bg: 'bg-info/10',
      text: 'text-info',
      border: 'border-info/20',
      dot: 'bg-info',
    },
    'Shortlisted': {
      bg: 'bg-warning/10',
      text: 'text-warning',
      border: 'border-warning/20',
      dot: 'bg-warning',
    },
    'Interview': {
      bg: 'bg-secondary/10',
      text: 'text-secondary',
      border: 'border-secondary/20',
      dot: 'bg-secondary',
    },
    'Selected': {
      bg: 'bg-success/10',
      text: 'text-success',
      border: 'border-success/20',
      dot: 'bg-success',
    },
    'Rejected': {
      bg: 'bg-danger/10',
      text: 'text-danger',
      border: 'border-danger/20',
      dot: 'bg-danger',
    },
    // Company statuses
    'Approved': {
      bg: 'bg-success/10',
      text: 'text-success',
      border: 'border-success/20',
      dot: 'bg-success',
    },
    'Pending': {
      bg: 'bg-warning/10',
      text: 'text-warning',
      border: 'border-warning/20',
      dot: 'bg-warning',
    },
    // Job statuses
    'Open': {
      bg: 'bg-primary/10',
      text: 'text-primary',
      border: 'border-primary/20',
      dot: 'bg-primary',
    },
    'Closed': {
      bg: 'bg-maintext/10',
      text: 'text-maintext',
      border: 'border-maintext/20',
      dot: 'bg-maintext',
    },
    'Active': {
      bg: 'bg-success/10',
      text: 'text-success',
      border: 'border-success/20',
      dot: 'bg-success',
    },
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const style = statusStyles[status] || statusStyles['Pending'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${style.bg} ${style.text} ${style.border} ${sizeStyles[size]}`}
    >
      <span className={`${dotSizes[size]} rounded-full ${style.dot}`}></span>
      {status}
    </span>
  );
};

export default StatusBadge;
