import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
  HiOutlineCheckCircle, 
  HiOutlineXCircle, 
  HiOutlineClock,
  HiOutlineOfficeBuilding,
  HiOutlineMail,
  HiOutlineUser
} from 'react-icons/hi';

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/admin/companies');
      setCompanies(res.data);
    } catch (err) {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (companyId, approved) => {
    try {
      await api.put(`/admin/companies/${companyId}/approve`, { approved });
      toast.success(approved ? 'Company approved!' : 'Company rejected.');
      fetchCompanies();
    } catch (err) {
      toast.error('Failed to update company');
    }
  };

  const filteredCompanies = companies.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'approved') return c.approved;
    if (filter === 'pending') return !c.approved;
    return true;
  });

  const pendingCount = companies.filter(c => !c.approved).length;
  const approvedCount = companies.filter(c => c.approved).length;

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
          <h1 className="text-2xl font-bold text-dark">Company Management</h1>
          <p className="text-maintext mt-1">Approve or reject company registrations</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-maintext border border-border hover:border-primary'
            }`}
          >
            All ({companies.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === 'pending'
                ? 'bg-warning text-white shadow-md'
                : 'bg-white text-maintext border border-border hover:border-warning'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === 'approved'
                ? 'bg-success text-white shadow-md'
                : 'bg-white text-maintext border border-border hover:border-success'
            }`}
          >
            Approved ({approvedCount})
          </button>
        </div>
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border p-12 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
            <HiOutlineOfficeBuilding className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-dark mb-2">No Companies Found</h3>
          <p className="text-maintext">
            {filter === 'pending' 
              ? 'No companies pending approval' 
              : filter === 'approved' 
                ? 'No approved companies yet'
                : 'No companies registered yet'}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all"
            >
              {/* Company Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg">
                    {company.companyName?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-dark truncate">{company.companyName}</h3>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium mt-1 ${
                      company.approved ? 'text-success' : 'text-warning'
                    }`}>
                      {company.approved ? (
                        <>
                          <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                          Approved
                        </>
                      ) : (
                        <>
                          <HiOutlineClock className="w-3.5 h-3.5" />
                          Pending Approval
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm text-maintext">
                  <HiOutlineUser className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{company.user?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-maintext">
                  <HiOutlineMail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{company.user?.email || 'N/A'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {!company.approved ? (
                  <>
                    <button
                      onClick={() => handleApprove(company.id, true)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-success text-white rounded-xl text-sm font-medium hover:bg-success/90 hover:shadow-lg hover:shadow-success/25 transition-all"
                    >
                      <HiOutlineCheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleApprove(company.id, false)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-danger/10 text-danger rounded-xl text-sm font-medium hover:bg-danger hover:text-white transition-all"
                    >
                      <HiOutlineXCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleApprove(company.id, false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-danger/10 text-danger rounded-xl text-sm font-medium hover:bg-danger hover:text-white transition-all"
                  >
                    <HiOutlineXCircle className="w-4 h-4" />
                    Revoke Approval
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCompanies;
