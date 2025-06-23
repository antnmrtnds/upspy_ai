const { processAdScraping } = require('./adScrapingProcessor');
const { processContentCollection } = require('./contentCollectionProcessor');
const { 
  processNotification,
  determineDeliveryMethods,
  sendNotificationViaMethod,
  sendEmailNotification,
  sendSMSNotification,
  sendPushNotification,
  sendInAppNotification
} = require('./notificationProcessor');

module.exports = {
  // Ad Scraping Processor
  processAdScraping,
  
  // Content Collection Processor
  processContentCollection,
  
  // Notification Processor
  processNotification,
  determineDeliveryMethods,
  sendNotificationViaMethod,
  sendEmailNotification,
  sendSMSNotification,
  sendPushNotification,
  sendInAppNotification
}; 