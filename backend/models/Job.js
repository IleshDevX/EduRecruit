const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  minCgpa: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  branchRequired: {
    type: String,
    default: 'All'
  },
  maxBacklogs: {
    type: Number,
    default: 0,
    min: 0
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Closed'],
    default: 'Active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true, transform: (doc, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } },
  toObject: { virtuals: true, transform: (doc, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } }
});

module.exports = mongoose.model('Job', jobSchema);
