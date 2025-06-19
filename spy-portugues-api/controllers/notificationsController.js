const { supabase } = require('../lib/supabase');

// Get all notifications with filtering and pagination
const getNotifications = async (req, res) => {
  try {
    const {
      limit = 20,
      offset = 0,
      user_id,
      type,
      is_read,
      sort_by = 'created_at',
      sort_order = 'desc',
      date_from,
      date_to
    } = req.query;

    let query = supabase
      .from('notifications')
      .select('*');

    // Apply filters
    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (is_read !== undefined) {
      query = query.eq('is_read', is_read === 'true');
    }

    if (date_from) {
      query = query.gte('created_at', date_from);
    }

    if (date_to) {
      query = query.lte('created_at', date_to);
    }

    // Apply sorting
    query = query.order(sort_by, { ascending: sort_order === 'asc' });

    // Apply pagination
    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({
        error: 'Failed to fetch notifications',
        details: error.message
      });
    }

    res.json({
      data,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: count
      }
    });
  } catch (err) {
    console.error('Unexpected error in getNotifications:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};

// Get single notification by ID
const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Notification not found' });
      }
      console.error('Error fetching notification:', error);
      return res.status(500).json({
        error: 'Failed to fetch notification',
        details: error.message
      });
    }

    res.json({ data });
  } catch (err) {
    console.error('Unexpected error in getNotificationById:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};

// Create new notification
const createNotification = async (req, res) => {
  try {
    const {
      user_id,
      type,
      title,
      message,
      payload = {},
      sent_via,
      sent_at
    } = req.body;

    // Validate required fields
    if (!user_id || !type || !title) {
      return res.status(400).json({
        error: 'Missing required fields: user_id, type, and title are required'
      });
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        user_id,
        type,
        title,
        message,
        payload,
        sent_via,
        sent_at: sent_at || new Date().toISOString()
      }])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return res.status(500).json({
        error: 'Failed to create notification',
        details: error.message
      });
    }

    res.status(201).json({
      message: 'Notification created successfully',
      data
    });
  } catch (err) {
    console.error('Unexpected error in createNotification:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};

// Update notification (mainly for marking as read)
const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Remove id from update data if present
    delete updateData.id;

    const { data, error } = await supabase
      .from('notifications')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Notification not found' });
      }
      console.error('Error updating notification:', error);
      return res.status(500).json({
        error: 'Failed to update notification',
        details: error.message
      });
    }

    res.json({
      message: 'Notification updated successfully',
      data
    });
  } catch (err) {
    console.error('Unexpected error in updateNotification:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting notification:', error);
      return res.status(500).json({
        error: 'Failed to delete notification',
        details: error.message
      });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    console.error('Unexpected error in deleteNotification:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Notification not found' });
      }
      console.error('Error marking notification as read:', error);
      return res.status(500).json({
        error: 'Failed to mark notification as read',
        details: error.message
      });
    }

    res.json({
      message: 'Notification marked as read',
      data
    });
  } catch (err) {
    console.error('Unexpected error in markAsRead:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};

// Mark all notifications as read for a user
const markAllAsRead = async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user_id)
      .eq('is_read', false)
      .select('*');

    if (error) {
      console.error('Error marking all notifications as read:', error);
      return res.status(500).json({
        error: 'Failed to mark all notifications as read',
        details: error.message
      });
    }

    res.json({
      message: `Marked ${data.length} notifications as read`,
      count: data.length
    });
  } catch (err) {
    console.error('Unexpected error in markAllAsRead:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};

// Get unread count for a user
const getUnreadCount = async (req, res) => {
  try {
    const { user_id } = req.params;

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .eq('is_read', false);

    if (error) {
      console.error('Error getting unread count:', error);
      return res.status(500).json({
        error: 'Failed to get unread count',
        details: error.message
      });
    }

    res.json({
      user_id,
      unread_count: count || 0
    });
  } catch (err) {
    console.error('Unexpected error in getUnreadCount:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};

module.exports = {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount
}; 