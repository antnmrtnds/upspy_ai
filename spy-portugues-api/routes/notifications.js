const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount
} = require('../controllers/notificationsController');
const { notificationsValidation } = require('../middleware/validation');

// GET /api/notifications - Get all notifications with filtering and pagination
router.get('/', notificationsValidation.list, getNotifications);

// GET /api/notifications/:id - Get single notification by ID
router.get('/:id', notificationsValidation.getById, getNotificationById);

// GET /api/notifications/user/:user_id/unread-count - Get unread count for user
router.get('/user/:user_id/unread-count', getUnreadCount);

// POST /api/notifications - Create new notification
router.post('/', notificationsValidation.create, createNotification);

// PUT /api/notifications/:id - Update notification
router.put('/:id', notificationsValidation.update, updateNotification);

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', notificationsValidation.markAsRead, markAsRead);

// PUT /api/notifications/user/:user_id/read-all - Mark all notifications as read for user
router.put('/user/:user_id/read-all', markAllAsRead);

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', notificationsValidation.getById, deleteNotification);

module.exports = router; 