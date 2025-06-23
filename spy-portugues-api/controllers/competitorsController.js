const { supabase } = require('../lib/supabase');
const { asyncErrorHandler } = require('../middleware/errorHandler');
const { NotFoundError, ValidationError, DatabaseError } = require('../utils/errors');
const logger = require('../utils/logger');
const { scheduleCompetitor } = require('../queues/scheduler');


// Get all competitors with optional filtering
const getCompetitors = asyncErrorHandler(async (req, res) => {
  const { 
    limit = 20, 
    offset = 0, 
    active_only = false,
    search,
    sort_by = 'created_at',
    sort_order = 'desc'
  } = req.query;

  logger.info('Fetching competitors', {
    filters: { limit, offset, active_only, search, sort_by, sort_order },
    ip: req.ip
  });

  let query = supabase
    .from('competitors')
    .select('*', { count: 'exact' });

  // Apply filters
  if (active_only === 'true') {
    query = query.eq('is_active', true);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,website.ilike.%${search}%`);
  }

  // Apply sorting
  query = query.order(sort_by, { ascending: sort_order === 'asc' });

  // Apply pagination
  query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

  const { data, error, count } = await query;

  if (error) {
    logger.database('SELECT', 'competitors', { error: error.message, filters: { limit, offset, active_only, search } });
    throw new DatabaseError('Failed to fetch competitors', error);
  }

  logger.database('SELECT', 'competitors', { 
    count: data?.length || 0, 
    total: count,
    filters: { limit, offset, active_only, search }
  });

  res.json({
    data,
    pagination: {
      limit: parseInt(limit),
      offset: parseInt(offset),
      total: count
    }
  });
});

// Get single competitor by ID
const getCompetitorById = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('competitors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new NotFoundError('Competitor');
    }
    throw new DatabaseError('Failed to fetch competitor', error);
  }

  res.json({ data });
});

// Create new competitor
const createCompetitor = asyncErrorHandler(async (req, res) => {
  const {
    name,
    website,
    description,
    logo_url,
    facebook_url,
    instagram_url,
    tiktok_url,
    regions,
    property_types,
    is_active = true,
    metadata = {},
    schedule_cron = '0 */6 * * *'
  } = req.body;

  const { data, error } = await supabase
    .from('competitors')
    .insert([{
      name,
      website,
      description,
      logo_url,
      facebook_url,
      instagram_url,
      tiktok_url,
      regions,
      property_types,
      is_active,
      metadata,
      schedule_cron
    }])
    .select()
    .single();

  if (error) {
    throw new DatabaseError('Failed to create competitor', error);
  }

  if (schedule_cron) {
    try {
      await scheduleCompetitor(data.id, schedule_cron);
    } catch (err) {
      logger.error('Failed to schedule competitor', { error: err.message, competitorId: data.id });
    }
  }

  res.status(201).json({
    message: 'Competitor created successfully',
    data
  });
});

// Update competitor
const updateCompetitor = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  
  // Remove id from update data if present
  delete updateData.id;
  
  // Add updated_at timestamp
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('competitors')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new NotFoundError('Competitor');
    }
    throw new DatabaseError('Failed to update competitor', error);
  }

  if (updateData.schedule_cron) {
    try {
      await scheduleCompetitor(id, updateData.schedule_cron);
    } catch (err) {
      logger.error('Failed to reschedule competitor', { error: err.message, competitorId: id });
    }
  }


  res.json({ 
    message: 'Competitor updated successfully',
    data 
  });
});

// Delete competitor (soft delete)
const deleteCompetitor = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const { hard_delete = false } = req.query;

  if (hard_delete === 'true') {
    // Hard delete - completely remove from database
    const { error } = await supabase
      .from('competitors')
      .delete()
      .eq('id', id);

    if (error) {
      throw new DatabaseError('Failed to delete competitor', error);
    }
  } else {
    // Soft delete - mark as inactive
    const { data, error } = await supabase
      .from('competitors')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Competitor');
      }
      throw new DatabaseError('Failed to deactivate competitor', error);
    }
  }

  res.json({ 
    message: hard_delete === 'true' ? 'Competitor deleted successfully' : 'Competitor deactivated successfully'
  });
});

// Get competitor statistics
const getCompetitorStats = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  // Get basic stats
  const { data: competitor, error: competitorError } = await supabase
    .from('competitors')
    .select('name, created_at')
    .eq('id', id)
    .single();

  if (competitorError) {
    if (competitorError.code === 'PGRST116') {
      throw new NotFoundError('Competitor');
    }
    throw new DatabaseError('Failed to fetch competitor', competitorError);
  }

  // Get ads count
  const { count: adsCount, error: adsError } = await supabase
    .from('ads')
    .select('*', { count: 'exact', head: true })
    .eq('competitor_id', id);

  if (adsError) throw new DatabaseError('Failed to fetch ads count', adsError);

  // Get active ads count
  const { count: activeAdsCount, error: activeAdsError } = await supabase
    .from('ads')
    .select('*', { count: 'exact', head: true })
    .eq('competitor_id', id)
    .eq('is_active', true);

  if (activeAdsError) throw new DatabaseError('Failed to fetch active ads count', activeAdsError);

  // Get content analysis count
  const { count: contentCount, error: contentError } = await supabase
    .from('content')
    .select('*', { count: 'exact', head: true })
    .eq('competitor_id', id);

  if (contentError) throw new DatabaseError('Failed to fetch content count', contentError);

  // Get price tracking count
  const { count: priceCount, error: priceError } = await supabase
    .from('prices')
    .select('*', { count: 'exact', head: true })
    .eq('competitor_id', id);

  if (priceError) throw new DatabaseError('Failed to fetch price count', priceError);

  const stats = {
    competitor: competitor.name,
    tracking_since: competitor.created_at,
    total_ads: adsCount || 0,
    active_ads: activeAdsCount || 0,
    content_analyses: contentCount || 0,
    price_points: priceCount || 0
  };

  res.json({ data: stats });
});

module.exports = {
  getCompetitors,
  getCompetitorById,
  createCompetitor,
  updateCompetitor,
  deleteCompetitor,
  getCompetitorStats
}; 