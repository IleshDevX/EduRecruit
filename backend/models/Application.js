const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
    default: 'Applied'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true, transform: (doc, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } },
  toObject: { virtuals: true, transform: (doc, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } }
});

// Compound index to ensure one application per student per job
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
