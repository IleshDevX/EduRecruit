const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { authenticate } = require('../middleware/auth');

// Get user's notifications
router.get('/', authenticate, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get unread count
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      user: req.user.id, 
      read: false 
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch count' });
  }
});

// Mark notification as read
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Mark all as read
router.put('/mark-all-read', authenticate, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// Delete a notification
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await Notification.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

module.exports = router;
