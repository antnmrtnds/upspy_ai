const { supabase } = require('../lib/supabase');
const { asyncErrorHandler } = require('../middleware/errorHandler');
const { DatabaseError, NotFoundError } = require('../utils/errors');

// Get all ads with filtering and pagination
const getAds = asyncErrorHandler(async (req, res) => {
  const {
    limit = 20,
    offset = 0,
    competitor_id,
    active_only = false,
    search,
    platform,
    sort_by = 'created_at',
    sort_order = 'desc',
    date_from,
    date_to
  } = req.query;

  let query = supabase
    .from('ads')
    .select('*');

  // Apply filters
  if (competitor_id) {
    query = query.eq('competitor_id', competitor_id);
  }

  if (active_only === 'true') {
    query = query.eq('is_active', true);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (platform) {
    query = query.eq('platform', platform);
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
    throw new DatabaseError('Failed to fetch ads', error);
  }

  res.json({
    data,
    pagination: {
      limit: parseInt(limit),
      offset: parseInt(offset),
      total: count
    }
  });
});

// Get single ad by ID
const getAdById = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new NotFoundError('Ad');
    }
    throw new DatabaseError('Failed to fetch ad', error);
  }

  res.json({ data });
});

// Create new ad
const createAd = asyncErrorHandler(async (req, res) => {
  const {
    competitor_id,
    title,
    description,
    image_url,
    video_url,
    landing_page_url,
    platform,
    ad_type,
    target_audience,
    keywords,
    call_to_action,
    is_active = true
  } = req.body;

  // Verify competitor exists
  const { data: competitor, error: competitorError } = await supabase
    .from('competitors')
    .select('id')
    .eq('id', competitor_id)
    .single();

  if (competitorError || !competitor) {
    throw new NotFoundError('Competitor');
  }

  const { data, error } = await supabase
    .from('ads')
    .insert([{
      competitor_id,
      title,
      description,
      image_url,
      video_url,
      landing_page_url,
      platform,
      ad_type,
      target_audience,
      keywords,
      call_to_action,
      is_active
    }])
    .select('*')
    .single();

  if (error) {
    throw new DatabaseError('Failed to create ad', error);
  }

  res.status(201).json({
    message: 'Ad created successfully',
    data
  });
});

// Update ad
const updateAd = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  // Remove id from update data if present
  delete updateData.id;

  // Add updated_at timestamp
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('ads')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new NotFoundError('Ad');
    }
    throw new DatabaseError('Failed to update ad', error);
  }

  res.json({
    message: 'Ad updated successfully',
    data
  });
});

// Delete ad (soft delete)
const deleteAd = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const { hard_delete = false } = req.query;

  if (hard_delete === 'true') {
    // Hard delete - completely remove from database
    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', id);

    if (error) {
      throw new DatabaseError('Failed to delete ad', error);
    }
  } else {
    // Soft delete - mark as inactive
    const { data, error } = await supabase
      .from('ads')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Ad');
      }
      throw new DatabaseError('Failed to deactivate ad', error);
    }
  }

  res.json({
    message: hard_delete === 'true' ? 'Ad deleted successfully' : 'Ad deactivated successfully'
  });
});

// Get ads by competitor
const getAdsByCompetitor = asyncErrorHandler(async (req, res) => {
  const { competitor_id } = req.params;
  const {
    limit = 20,
    offset = 0,
    active_only = false,
    platform,
    sort_by = 'created_at',
    sort_order = 'desc'
  } = req.query;

  // Verify competitor exists
  const { data: competitor, error: competitorError } = await supabase
    .from('competitors')
    .select('name')
    .eq('id', competitor_id)
    .single();

  if (competitorError || !competitor) {
    throw new NotFoundError('Competitor');
  }

  let query = supabase
    .from('ads')
    .select('*')
    .eq('competitor_id', competitor_id);

  // Apply filters
  if (active_only === 'true') {
    query = query.eq('is_active', true);
  }

  if (platform) {
    query = query.eq('platform', platform);
  }

  // Apply sorting
  query = query.order(sort_by, { ascending: sort_order === 'asc' });

  // Apply pagination
  query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

  const { data, error, count } = await query;

  if (error) {
    throw new DatabaseError('Failed to fetch competitor ads', error);
  }

  res.json({
    competitor: competitor.name,
    data,
    pagination: {
      limit: parseInt(limit),
      offset: parseInt(offset),
      total: count
    }
  });
});

// Get ad analytics/statistics
const getAdAnalytics = asyncErrorHandler(async (req, res) => {
  const { 
    competitor_id,
    date_from,
    date_to,
    platform 
  } = req.query;

  let query = supabase
    .from('ads')
    .select('platform, ad_type, created_at, is_active');

  // Apply filters
  if (competitor_id) {
    query = query.eq('competitor_id', competitor_id);
  }

  if (platform) {
    query = query.eq('platform', platform);
  }

  if (date_from) {
    query = query.gte('created_at', date_from);
  }

  if (date_to) {
    query = query.lte('created_at', date_to);
  }

  const { data, error } = await query;

  if (error) {
    throw new DatabaseError('Failed to fetch ad analytics', error);
  }

  // Process analytics
  const analytics = {
    total_ads: data.length,
    active_ads: data.filter(ad => ad.is_active).length,
    inactive_ads: data.filter(ad => !ad.is_active).length,
    by_platform: {},
    by_ad_type: {},
    timeline: {}
  };

  // Group by platform
  data.forEach(ad => {
    analytics.by_platform[ad.platform] = (analytics.by_platform[ad.platform] || 0) + 1;
  });

  // Group by ad type
  data.forEach(ad => {
    if (ad.ad_type) {
      analytics.by_ad_type[ad.ad_type] = (analytics.by_ad_type[ad.ad_type] || 0) + 1;
    }
  });

  // Group by month for timeline
  data.forEach(ad => {
    const month = ad.created_at.substring(0, 7); // YYYY-MM
    analytics.timeline[month] = (analytics.timeline[month] || 0) + 1;
  });

  res.json({ data: analytics });
});

module.exports = {
  getAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
  getAdsByCompetitor,
  getAdAnalytics
}; 