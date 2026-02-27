const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
require('dotenv').config();

const register = async (req, res) => {
  try {
    const { name, email, password, role, branch, cgpa, backlogs, skills, company_name } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password and role are required.' });
    }

    if (!['student', 'company'].includes(role)) {
      return res.status(400).json({ error: 'Role must be student or company.' });
    }

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Create role-specific record
    if (role === 'student') {
      await Student.create({
        user: user._id,
        branch: branch || '',
        cgpa: cgpa || 0,
        backlogs: backlogs || 0,
        skills: skills || '',
        resumeUrl: ''
      });
    } else if (role === 'company') {
      await Company.create({
        user: user._id,
        companyName: company_name || name,
        approved: false
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed.' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findOne({ user: user._id });
    } else if (user.role === 'company') {
      profile = await Company.findOne({ user: user._id });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile
    });
  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
};

module.exports = { register, login, getMe };
