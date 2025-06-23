const os = require('os');
const logger = require('../utils/logger');
const { adScraperQueue, contentCollectionQueue, notificationQueue } = require('./index');
const { supabase } = require('../lib/supabase');

/**
 * Schedule a recurring job using a cron pattern.
 * A deterministic jobId prevents duplicate scheduled jobs.
 */
const scheduleJob = async (queue, name, data, cron, jobId = `${name}:${cron}`, priority = 5) => {
  const options = { repeat: { cron }, jobId, priority };
  await queue.add(name, data, options);
  logger.info('Scheduled recurring job', { queue: queue.name, name, cron, jobId });
};

const removeCompetitorSchedule = async (competitorId) => {
  const repeatables = await adScraperQueue.getRepeatableJobs();
  for (const job of repeatables) {
    if (job.id === `scrape-competitor:${competitorId}`) {
      await adScraperQueue.removeRepeatableByKey(job.key);
      logger.info('Removed existing competitor schedule', { competitorId });
    }
  }
};

const scheduleCompetitor = async (competitorId, cron) => {
  await removeCompetitorSchedule(competitorId);
  await scheduleJob(
    adScraperQueue,
    'scrape-competitor',
    { competitorId },
    cron,
    `scrape-competitor:${competitorId}`,
    1
  );
};

const loadCompetitorSchedules = async () => {
  const { data, error } = await supabase
    .from('competitors')
    .select('id, schedule_cron')
    .eq('is_active', true)
    .not('schedule_cron', 'is', null);
  if (error) {
    logger.error('Failed to load competitor schedules', { error: error.message });
    return;
  }
  for (const comp of data) {
    if (comp.schedule_cron) {
      await scheduleCompetitor(comp.id, comp.schedule_cron);
    }
  }
};


/**
 * Trigger a job immediately with optional priority.
 */
const triggerJob = async (queue, name, data = {}, priority = 5) => {
  const job = await queue.add(name, data, { priority });
  logger.info('Manually triggered job', { queue: queue.name, name, jobId: job.id });
  return job;
};

let monitorInterval;
let healthInterval;
/**
 * Pause queues when system load is high and resume when it returns to normal.
 */
const monitorLoad = async (threshold = 2.5) => {
  const load = os.loadavg()[0];
  if (load > threshold) {
    await Promise.all([
      adScraperQueue.pause(true),
      contentCollectionQueue.pause(true),
      notificationQueue.pause(true),
    ]);
    logger.warn('Queues paused due to high system load', { load });
  } else {
    await Promise.all([
      adScraperQueue.resume(),
      contentCollectionQueue.resume(),
      notificationQueue.resume(),
    ]);
  }
};

const startLoadMonitor = (interval = 30000, threshold) => {
  if (monitorInterval) clearInterval(monitorInterval);
  monitorInterval = setInterval(() => monitorLoad(threshold), interval);
};

const stopLoadMonitor = () => {
  if (monitorInterval) clearInterval(monitorInterval);
};

const checkQueueHealth = async (backlog = 100, failures = 20) => {
  const queues = [adScraperQueue, contentCollectionQueue, notificationQueue];
  for (const q of queues) {
    const counts = await q.getJobCounts('wait', 'failed');
    if (counts.waiting > backlog) {
      await notificationQueue.add('queue-alert', {
        type: 'backlog',
        queue: q.name,
        waiting: counts.waiting,
      });
      logger.warn('Queue backlog alert', { queue: q.name, waiting: counts.waiting });
    }
    if (counts.failed > failures) {
      await notificationQueue.add('queue-alert', {
        type: 'failures',
        queue: q.name,
        failed: counts.failed,
      });
      logger.warn('Queue failure alert', { queue: q.name, failed: counts.failed });
    }
  }
};

const startQueueHealthMonitor = (interval = 60000, backlog, failures) => {
  if (healthInterval) clearInterval(healthInterval);
  healthInterval = setInterval(() => checkQueueHealth(backlog, failures), interval);
};

const stopQueueHealthMonitor = () => {
  if (healthInterval) clearInterval(healthInterval);
};

module.exports = {
  scheduleJob,
  triggerJob,
  startLoadMonitor,
  stopLoadMonitor,
  startQueueHealthMonitor,
  stopQueueHealthMonitor,
  scheduleCompetitor,
  removeCompetitorSchedule,
  loadCompetitorSchedules,
};