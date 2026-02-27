import { motion } from 'framer-motion';

const DashboardCard = ({ title, value, icon: Icon, color = 'primary', subtitle, trend }) => {
  const colorStyles = {
    primary: {
      bg: 'bg-primary/10',
      icon: 'bg-primary text-white',
      text: 'text-primary',
    },
    secondary: {
      bg: 'bg-secondary/10',
      icon: 'bg-secondary text-white',
      text: 'text-secondary',
    },
    success: {
      bg: 'bg-success/10',
      icon: 'bg-success text-white',
      text: 'text-success',
    },
    warning: {
      bg: 'bg-warning/10',
      icon: 'bg-warning text-white',
      text: 'text-warning',
    },
    danger: {
      bg: 'bg-danger/10',
      icon: 'bg-danger text-white',
      text: 'text-danger',
    },
    info: {
      bg: 'bg-info/10',
      icon: 'bg-info text-white',
      text: 'text-info',
    },
    accent: {
      bg: 'bg-accent/10',
      icon: 'bg-accent text-white',
      text: 'text-accent',
    },
  };

  const style = colorStyles[color] || colorStyles.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-maintext mb-1">{title}</p>
          <p className="text-3xl font-bold text-dark">{value}</p>
          {subtitle && (
            <p className="text-xs text-maintext mt-2">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend > 0 ? 'text-success' : 'text-danger'}`}>
              <span>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
              <span className="text-maintext">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl ${style.icon} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardCard;
