const { supabase } = require('../lib/supabase');
const logger = require('../utils/logger');

/**
 * Process notification jobs
 * @param {Object} job - BullMQ job object
 * @param {string} job.data.type - Type of notification (email, sms, push, in_app)
 * @param {string} job.data.userId - ID of the user to notify
 * @param {Object} job.data.payload - Notification content and metadata
 * @param {Object} job.data.options - Additional notification options
 * @returns {Object} Processing result
 */
const processNotification = async (job) => {
  const { type, userId, payload, options = {} } = job.data;
  
  logger.info('Starting notification processing', {
    jobId: job.id,
    type,
    userId,
    payload: { ...payload, content: payload.content ? '[CONTENT]' : null }
  });

  const result = {
    success: true,
    type,
    userId,
    notificationId: null,
    sentVia: [],
    errors: []
  };

  try {
    // Validate user exists and get notification preferences
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, phone, notification_preferences')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    logger.info('User validated for notification', { 
      userId: user.id,
      email: user.email
    });

    // Create notification record in database
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        type: payload.notificationType || type,
        title: payload.title,
        message: payload.message,
        payload: payload.data || {},
        sent_via: null, // Will be updated after sending
        sent_at: null,  // Will be updated after sending
        is_read: false
      }])
      .select('*')
      .single();

    if (notificationError) {
      throw new Error(`Failed to create notification record: ${notificationError.message}`);
    }

    result.notificationId = notification.id;
    logger.info('Notification record created', { notificationId: notification.id });

    // Determine delivery methods based on type and user preferences
    const deliveryMethods = determineDeliveryMethods(type, user.notification_preferences, options);
    
    // Send notification via each method
    const sentMethods = [];
    for (const method of deliveryMethods) {
      try {
        const methodResult = await sendNotificationViaMethod(method, user, payload, options);
        if (methodResult.success) {
          sentMethods.push(method);
          logger.info(`Notification sent via ${method}`, { 
            notificationId: notification.id,
            method 
          });
        } else {
          result.errors.push({
            type: 'delivery_error',
            method,
            message: methodResult.error,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        logger.error(`Failed to send notification via ${method}`, {
          notificationId: notification.id,
          method,
          error: error.message
        });
        result.errors.push({
          type: 'delivery_error',
          method,
          message: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Update notification record with delivery status
    const updateData = {
      sent_via: sentMethods,
      sent_at: sentMethods.length > 0 ? new Date().toISOString() : null
    };

    await supabase
      .from('notifications')
      .update(updateData)
      .eq('id', notification.id);

    result.sentVia = sentMethods;

    if (sentMethods.length === 0) {
      throw new Error('Failed to send notification via any method');
    }

    logger.info('Notification processing completed', {
      jobId: job.id,
      notificationId: notification.id,
      sentVia: sentMethods,
      errorCount: result.errors.length
    });

    return result;

  } catch (error) {
    logger.error('Notification processing failed', {
      jobId: job.id,
      userId,
      type,
      error: error.message,
      stack: error.stack
    });

    result.success = false;
    result.errors.push({
      type: 'general',
      message: error.message,
      timestamp: new Date().toISOString()
    });

    // Update notification record to mark as failed if it was created
    if (result.notificationId) {
      await supabase
        .from('notifications')
        .update({
          sent_via: ['failed'],
          sent_at: new Date().toISOString()
        })
        .eq('id', result.notificationId);
    }

    throw error;
  }
};

/**
 * Determine which delivery methods to use based on notification type and user preferences
 * @param {string} type - Notification type
 * @param {Object} preferences - User notification preferences
 * @param {Object} options - Additional options
 * @returns {Array} Array of delivery methods
 */
const determineDeliveryMethods = (type, preferences = {}, options = {}) => {
  const methods = [];

  // Force specific method if provided in options
  if (options.forceMethod) {
    return [options.forceMethod];
  }

  // Default delivery methods based on notification type
  const defaultMethods = {
    'new_competitor_ad': ['email', 'in_app'],
    'price_alert': ['email', 'push', 'in_app'],
    'weekly_report': ['email'],
    'system_alert': ['email', 'in_app'],
    'welcome': ['email'],
    'password_reset': ['email'],
    'account_verification': ['email'],
    'subscription_expiry': ['email', 'in_app'],
    'data_ready': ['email', 'in_app']
  };

  const typeMethods = defaultMethods[type] || ['in_app'];

  // Filter based on user preferences
  for (const method of typeMethods) {
    const prefKey = `${method}_enabled`;
    if (preferences[prefKey] !== false) { // Default to enabled if not specified
      methods.push(method);
    }
  }

  // Ensure at least in_app notification if all others are disabled
  if (methods.length === 0) {
    methods.push('in_app');
  }

  return methods;
};

/**
 * Send notification via specific method
 * @param {string} method - Delivery method (email, sms, push, in_app)
 * @param {Object} user - User data
 * @param {Object} payload - Notification payload
 * @param {Object} options - Additional options
 * @returns {Object} Delivery result
 */
const sendNotificationViaMethod = async (method, user, payload, options = {}) => {
  logger.info(`Sending notification via ${method}`, {
    userId: user.id,
    method,
    title: payload.title
  });

  switch (method) {
    case 'email':
      return await sendEmailNotification(user, payload, options);
    case 'sms':
      return await sendSMSNotification(user, payload, options);
    case 'push':
      return await sendPushNotification(user, payload, options);
    case 'in_app':
      return await sendInAppNotification(user, payload, options);
    default:
      throw new Error(`Unsupported notification method: ${method}`);
  }
};

/**
 * Send email notification
 * @param {Object} user - User data
 * @param {Object} payload - Notification payload
 * @param {Object} options - Additional options
 * @returns {Object} Email delivery result
 */
const sendEmailNotification = async (user, payload, options = {}) => {
  try {
    if (!user.email) {
      throw new Error('User has no email address');
    }

    logger.info('Sending email notification', {
      userId: user.id,
      email: user.email,
      subject: payload.title
    });

    // In a real implementation, you would integrate with an email service
    // like SendGrid, AWS SES, Mailgun, etc.
    const emailResult = await simulateEmailSend({
      to: user.email,
      subject: payload.title,
      html: generateEmailHTML(payload),
      text: payload.message
    });

    if (emailResult.success) {
      logger.info('Email sent successfully', {
        userId: user.id,
        messageId: emailResult.messageId
      });
      return { success: true, messageId: emailResult.messageId };
    } else {
      throw new Error(emailResult.error);
    }

  } catch (error) {
    logger.error('Email notification failed', {
      userId: user.id,
      error: error.message
    });
    return { success: false, error: error.message };
  }
};

/**
 * Send SMS notification
 * @param {Object} user - User data
 * @param {Object} payload - Notification payload
 * @param {Object} options - Additional options
 * @returns {Object} SMS delivery result
 */
const sendSMSNotification = async (user, payload, options = {}) => {
  try {
    if (!user.phone) {
      throw new Error('User has no phone number');
    }

    logger.info('Sending SMS notification', {
      userId: user.id,
      phone: user.phone.replace(/\d(?=\d{4})/g, '*'), // Mask phone number in logs
      message: payload.title
    });

    // In a real implementation, you would integrate with an SMS service
    // like Twilio, AWS SNS, etc.
    const smsResult = await simulateSMSSend({
      to: user.phone,
      message: `${payload.title}\n\n${payload.message}`
    });

    if (smsResult.success) {
      logger.info('SMS sent successfully', {
        userId: user.id,
        messageId: smsResult.messageId
      });
      return { success: true, messageId: smsResult.messageId };
    } else {
      throw new Error(smsResult.error);
    }

  } catch (error) {
    logger.error('SMS notification failed', {
      userId: user.id,
      error: error.message
    });
    return { success: false, error: error.message };
  }
};

/**
 * Send push notification
 * @param {Object} user - User data
 * @param {Object} payload - Notification payload
 * @param {Object} options - Additional options
 * @returns {Object} Push delivery result
 */
const sendPushNotification = async (user, payload, options = {}) => {
  try {
    logger.info('Sending push notification', {
      userId: user.id,
      title: payload.title
    });

    // In a real implementation, you would integrate with a push service
    // like Firebase Cloud Messaging, Apple Push Notification Service, etc.
    const pushResult = await simulatePushSend({
      userId: user.id,
      title: payload.title,
      body: payload.message,
      data: payload.data || {}
    });

    if (pushResult.success) {
      logger.info('Push notification sent successfully', {
        userId: user.id,
        messageId: pushResult.messageId
      });
      return { success: true, messageId: pushResult.messageId };
    } else {
      throw new Error(pushResult.error);
    }

  } catch (error) {
    logger.error('Push notification failed', {
      userId: user.id,
      error: error.message
    });
    return { success: false, error: error.message };
  }
};

/**
 * Send in-app notification (already stored in database)
 * @param {Object} user - User data
 * @param {Object} payload - Notification payload
 * @param {Object} options - Additional options
 * @returns {Object} In-app delivery result
 */
const sendInAppNotification = async (user, payload, options = {}) => {
  try {
    logger.info('In-app notification ready', {
      userId: user.id,
      title: payload.title
    });

    // In-app notifications are already stored in the database
    // This method just confirms the delivery
    return { success: true, messageId: `in_app_${Date.now()}` };

  } catch (error) {
    logger.error('In-app notification failed', {
      userId: user.id,
      error: error.message
    });
    return { success: false, error: error.message };
  }
};

/**
 * Generate HTML content for email notifications
 * @param {Object} payload - Notification payload
 * @returns {string} HTML content
 */
const generateEmailHTML = (payload) => {
  const { title, message, data = {} } = payload;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .button { background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Spy Português</h1>
        </div>
        <div class="content">
          <h2>${title}</h2>
          <p>${message}</p>
          ${data.actionUrl ? `<p><a href="${data.actionUrl}" class="button">View Details</a></p>` : ''}
        </div>
        <div class="footer">
          <p>© 2024 Spy Português. All rights reserved.</p>
          <p>If you no longer wish to receive these emails, you can unsubscribe in your account settings.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Mock functions for simulation (these would be replaced with real service integrations)
const simulateEmailSend = async (emailData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate success/failure
  if (Math.random() > 0.1) { // 90% success rate
    return {
      success: true,
      messageId: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  } else {
    return {
      success: false,
      error: 'Email service temporarily unavailable'
    };
  }
};

const simulateSMSSend = async (smsData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (Math.random() > 0.05) { // 95% success rate
    return {
      success: true,
      messageId: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  } else {
    return {
      success: false,
      error: 'SMS service temporarily unavailable'
    };
  }
};

const simulatePushSend = async (pushData) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (Math.random() > 0.08) { // 92% success rate
    return {
      success: true,
      messageId: `push_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  } else {
    return {
      success: false,
      error: 'Push notification service temporarily unavailable'
    };
  }
};

module.exports = {
  processNotification,
  determineDeliveryMethods,
  sendNotificationViaMethod,
  sendEmailNotification,
  sendSMSNotification,
  sendPushNotification,
  sendInAppNotification
}; 