const { supabase } = require('../lib/supabase');
const { asyncErrorHandler } = require('../middleware/errorHandler');
const { NotFoundError, ValidationError, DatabaseError } = require('../utils/errors');

// Get all content with filtering and pagination
const getContent = asyncErrorHandler(async (req, res) => {
  const {
    limit = 20,
    offset = 0,
    competitor_id,
    platform,
    search,
    sort_by = 'posted_at',
    sort_order = 'desc',
    date_from,
    date_to,
    min_engagement_rate,
    max_engagement_rate,
    property_type,
    region
  } = req.query;

  let query = supabase
    .from('content')
    .select('*', { count: 'exact' });

  // Apply filters
  if (competitor_id) {
    query = query.eq('competitor_id', competitor_id);
  }

  if (platform) {
    query = query.eq('platform', platform);
  }

  if (search) {
    query = query.or(`caption.ilike.%${search}%,hashtags.cs.{${search}}`);
  }

  if (date_from) {
    query = query.gte('posted_at', date_from);
  }

  if (date_to) {
    query = query.lte('posted_at', date_to);
  }

  if (min_engagement_rate) {
    query = query.gte('engagement_rate', parseFloat(min_engagement_rate));
  }

  if (max_engagement_rate) {
    query = query.lte('engagement_rate', parseFloat(max_engagement_rate));
  }

  if (property_type) {
    query = query.contains('property_types', [property_type]);
  }

  if (region) {
    query = query.contains('regions', [region]);
  }

  // Apply sorting
  query = query.order(sort_by, { ascending: sort_order === 'asc' });

  // Apply pagination
  query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

  const { data, error, count } = await query;

  if (error) {
    throw new DatabaseError('Failed to fetch content', error);
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

// Get single content by ID
const getContentById = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new NotFoundError('Content');
    }
    throw new DatabaseError('Failed to fetch content', error);
  }

  res.json({ data });
});

// Create new content
const createContent = asyncErrorHandler(async (req, res) => {
  const {
    competitor_id,
    user_id,
    platform,
    post_id,
    post_url,
    media_url,
    media_type,
    caption,
    hashtags = [],
    likes = 0,
    comments = 0,
    shares = 0,
    views = 0,
    engagement_rate,
    posted_at,
    regions = [],
    property_types = [],
    performance_score,
    metadata = {}
  } = req.body;

  // Validate required fields
  if (!competitor_id || !platform) {
    throw new ValidationError('Missing required fields: competitor_id and platform are required');
  }

  // Verify competitor exists
  const { data: competitor, error: competitorError } = await supabase
    .from('competitors')
    .select('id')
    .eq('id', competitor_id)
    .single();

  if (competitorError || !competitor) {
    throw new ValidationError('Invalid competitor_id: competitor does not exist');
  }

  // Calculate engagement rate if metrics are provided
  let calculatedEngagementRate = engagement_rate;
  if (!calculatedEngagementRate && (likes || comments || shares) && views > 0) {
    calculatedEngagementRate = ((likes + comments + shares) / views * 100).toFixed(2);
  }

  const { data, error } = await supabase
    .from('content')
    .insert([{
      competitor_id,
      user_id,
      platform,
      post_id,
      post_url,
      media_url,
      media_type,
      caption,
      hashtags,
      likes,
      comments,
      shares,
      views,
      engagement_rate: calculatedEngagementRate,
      posted_at,
      regions,
      property_types,
      performance_score,
      metadata
    }])
    .select('*')
    .single();

  if (error) {
    throw new DatabaseError('Failed to create content', error);
  }

  res.status(201).json({
    message: 'Content created successfully',
    data
  });
});

// Update content
const updateContent = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  // Remove id from update data if present
  delete updateData.id;

  // Add updated_at timestamp
  updateData.updated_at = new Date().toISOString();

  // Recalculate engagement rate if metrics are updated
  if (updateData.likes !== undefined || updateData.comments !== undefined || 
      updateData.shares !== undefined || updateData.views !== undefined) {
    
    // Get current data to fill in missing values
    const { data: currentData, error: currentError } = await supabase
      .from('content')
      .select('likes, comments, shares, views')
      .eq('id', id)
      .single();

    if (currentError) {
      if (currentError.code === 'PGRST116') {
        throw new NotFoundError('Content');
      }
      throw new DatabaseError('Failed to fetch current content data', currentError);
    }

    const likes = updateData.likes !== undefined ? updateData.likes : currentData.likes;
    const comments = updateData.comments !== undefined ? updateData.comments : currentData.comments;
    const shares = updateData.shares !== undefined ? updateData.shares : currentData.shares;
    const views = updateData.views !== undefined ? updateData.views : currentData.views;

    if (views > 0) {
      updateData.engagement_rate = ((likes + comments + shares) / views * 100).toFixed(2);
    }
  }

  const { data, error } = await supabase
    .from('content')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new NotFoundError('Content');
    }
    throw new DatabaseError('Failed to update content', error);
  }

  res.json({
    message: 'Content updated successfully',
    data
  });
});

// Delete content
const deleteContent = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('content')
    .delete()
    .eq('id', id);

  if (error) {
    if (error.code === 'PGRST116') {
      throw new NotFoundError('Content');
    }
    throw new DatabaseError('Failed to delete content', error);
  }

  res.json({
    message: 'Content deleted successfully'
  });
});

// Get content by competitor
const getContentByCompetitor = asyncErrorHandler(async (req, res) => {
  const { competitor_id } = req.params;
  const { 
    limit = 20, 
    offset = 0,
    platform,
    sort_by = 'posted_at',
    sort_order = 'desc'
  } = req.query;

  // Verify competitor exists
  const { data: competitor, error: competitorError } = await supabase
    .from('competitors')
    .select('id')
    .eq('id', competitor_id)
    .single();

  if (competitorError || !competitor) {
    throw new NotFoundError('Competitor');
  }

  let query = supabase
    .from('content')
    .select('*', { count: 'exact' })
    .eq('competitor_id', competitor_id);

  if (platform) {
    query = query.eq('platform', platform);
  }

  // Apply sorting
  query = query.order(sort_by, { ascending: sort_order === 'asc' });

  // Apply pagination
  query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

  const { data, error, count } = await query;

  if (error) {
    throw new DatabaseError('Failed to fetch competitor content', error);
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

// Get content analytics
const getContentAnalytics = asyncErrorHandler(async (req, res) => {
  const { competitor_id } = req.params;
  const { platform, date_from, date_to } = req.query;

  // Verify competitor exists
  const { data: competitor, error: competitorError } = await supabase
    .from('competitors')
    .select('id')
    .eq('id', competitor_id)
    .single();

  if (competitorError || !competitor) {
    throw new NotFoundError('Competitor');
  }

  let query = supabase
    .from('content')
    .select(`
      platform,
      count(*),
      avg(engagement_rate),
      sum(likes),
      sum(comments),
      sum(shares),
      sum(views)
    `)
    .eq('competitor_id', competitor_id);

  if (platform) {
    query = query.eq('platform', platform);
  }

  if (date_from) {
    query = query.gte('posted_at', date_from);
  }

  if (date_to) {
    query = query.lte('posted_at', date_to);
  }

  query = query.group('platform');

  const { data, error } = await query;

  if (error) {
    throw new DatabaseError('Failed to fetch content analytics', error);
  }

  const analytics = data.map(row => ({
    platform: row.platform,
    total_posts: parseInt(row.count),
    avg_engagement_rate: parseFloat(row.avg).toFixed(2),
    total_likes: parseInt(row.sum_likes),
    total_comments: parseInt(row.sum_comments),
    total_shares: parseInt(row.sum_shares),
    total_views: parseInt(row.sum_views)
  }));

  res.json({ data: analytics });
});

module.exports = {
  getContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  getContentByCompetitor,
  getContentAnalytics
}; 