const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  branch: {
    type: String,
    default: ''
  },
  cgpa: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  backlogs: {
    type: Number,
    default: 0,
    min: 0
  },
  skills: {
    type: String,
    default: ''
  },
  resumeUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true, transform: (doc, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } },
  toObject: { virtuals: true, transform: (doc, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } }
});

module.exports = mongoose.model('Student', studentSchema);
