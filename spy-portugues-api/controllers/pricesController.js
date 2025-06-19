const { supabase } = require('../lib/supabase');

// Get all prices with filtering and pagination
const getPrices = async (req, res) => {
  try {
    const {
      limit = 20,
      offset = 0,
      competitor_id,
      property_type,
      region,
      min_price,
      max_price,
      min_price_per_sqm,
      max_price_per_sqm,
      source_type,
      sort_by = 'detected_at',
      sort_order = 'desc',
      date_from,
      date_to
    } = req.query;

    let query = supabase
      .from('prices')
      .select('*');

    // Apply filters
    if (competitor_id) {
      query = query.eq('competitor_id', competitor_id);
    }

    if (property_type) {
      query = query.eq('property_type', property_type);
    }

    if (region) {
      query = query.eq('region', region);
    }

    if (source_type) {
      query = query.eq('source_type', source_type);
    }

    if (min_price) {
      query = query.gte('price_eur', parseFloat(min_price));
    }

    if (max_price) {
      query = query.lte('price_eur', parseFloat(max_price));
    }

    if (min_price_per_sqm) {
      query = query.gte('price_per_sqm_eur', parseFloat(min_price_per_sqm));
    }

    if (max_price_per_sqm) {
      query = query.lte('price_per_sqm_eur', parseFloat(max_price_per_sqm));
    }

    if (date_from) {
      query = query.gte('detected_at', date_from);
    }

    if (date_to) {
      query = query.lte('detected_at', date_to);
    }

    // Apply sorting
    query = query.order(sort_by, { ascending: sort_order === 'asc' });

    // Apply pagination
    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching prices:', error);
      return res.status(500).json({
        error: 'Failed to fetch prices',
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
    console.error('Unexpected error in getPrices:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};

// Get single price by ID
const getPriceById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('prices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Price record not found' });
      }
      console.error('Error fetching price:', error);
      return res.status(500).json({
        error: 'Failed to fetch price',
        details: error.message
      });
    }

    res.json({ data });
  } catch (err) {
    console.error('Unexpected error in getPriceById:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};

// Create new price record
const createPrice = async (req, res) => {
  try {
    const {
      competitor_id,
      user_id,
      source_type,
      source_id,
      property_type,
      region,
      price_eur,
      price_per_sqm_eur,
      property_size_sqm,
      price_context,
      detected_at,
      metadata = {}
    } = req.body;

    // Validate required fields
    if (!competitor_id || !source_type || !price_eur) {
      return res.status(400).json({
        error: 'Missing required fields: competitor_id, source_type, and price_eur are required'
      });
    }

    // Verify competitor exists
    const { data: competitor, error: competitorError } = await supabase
      .from('competitors')
      .select('id')
      .eq('id', competitor_id)
      .single();

    if (competitorError || !competitor) {
      return res.status(400).json({
        error: 'Invalid competitor_id: competitor does not exist'
      });
    }

    // Calculate price per sqm if missing but size is provided
    let calculatedPricePerSqm = price_per_sqm_eur;
    if (!calculatedPricePerSqm && property_size_sqm && property_size_sqm > 0) {
      calculatedPricePerSqm = (price_eur / property_size_sqm).toFixed(2);
    }

    const { data, error } = await supabase
      .from('prices')
      .insert([{
        competitor_id,
        user_id,
        source_type,
        source_id,
        property_type,
        region,
        price_eur: parseFloat(price_eur),
        price_per_sqm_eur: calculatedPricePerSqm ? parseFloat(calculatedPricePerSqm) : null,
        property_size_sqm: property_size_sqm ? parseInt(property_size_sqm) : null,
        price_context,
        detected_at: detected_at || new Date().toISOString(),
        metadata
      }])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating price:', error);
      return res.status(500).json({
        error: 'Failed to create price record',
        details: error.message
      });
    }

    res.status(201).json({
      message: 'Price record created successfully',
      data
    });
  } catch (err) {
    console.error('Unexpected error in createPrice:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};

// Update price record
const updatePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Remove id from update data if present
    delete updateData.id;

    // Recalculate price per sqm if relevant fields are updated
    if (updateData.price_eur !== undefined || updateData.property_size_sqm !== undefined) {
      // Get current data to fill in missing values
      const { data: currentData } = await supabase
        .from('prices')
        .select('price_eur, property_size_sqm')
        .eq('id', id)
        .single();

      if (currentData) {
        const price = updateData.price_eur !== undefined ? updateData.price_eur : currentData.price_eur;
        const size = updateData.property_size_sqm !== undefined ? updateData.property_size_sqm : currentData.property_size_sqm;

        if (price && size && size > 0) {
          updateData.price_per_sqm_eur = (price / size).toFixed(2);
        }
      }
    }

    // Convert numeric fields
    if (updateData.price_eur !== undefined) {
      updateData.price_eur = parseFloat(updateData.price_eur);
    }
    if (updateData.price_per_sqm_eur !== undefined) {
      updateData.price_per_sqm_eur = parseFloat(updateData.price_per_sqm_eur);
    }
    if (updateData.property_size_sqm !== undefined) {
      updateData.property_size_sqm = parseInt(updateData.property_size_sqm);
    }

    const { data, error } = await supabase
      .from('prices')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Price record not found' });
      }
      console.error('Error updating price:', error);
      return res.status(500).json({
        error: 'Failed to update price record',
        details: error.message
      });
    }

    res.json({
      message: 'Price record updated successfully',
      data
    });
  } catch (err) {
    console.error('Unexpected error in updatePrice:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};

// Delete price record
const deletePrice = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('prices')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting price:', error);
      return res.status(500).json({
        error: 'Failed to delete price record',
        details: error.message
      });
    }

    res.json({ message: 'Price record deleted successfully' });
  } catch (err) {
    console.error('Unexpected error in deletePrice:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};

// Get prices by competitor
const getPricesByCompetitor = async (req, res) => {
  try {
    const { competitor_id } = req.params;
    const {
      limit = 20,
      offset = 0,
      property_type,
      region,
      sort_by = 'detected_at',
      sort_order = 'desc'
    } = req.query;

    let query = supabase
      .from('prices')
      .select('*')
      .eq('competitor_id', competitor_id);

    if (property_type) {
      query = query.eq('property_type', property_type);
    }

    if (region) {
      query = query.eq('region', region);
    }

    query = query
      .order(sort_by, { ascending: sort_order === 'asc' })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching prices by competitor:', error);
      return res.status(500).json({
        error: 'Failed to fetch prices',
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
    console.error('Unexpected error in getPricesByCompetitor:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};

// Get price analytics and trends
const getPriceAnalytics = async (req, res) => {
  try {
    const {
      competitor_id,
      property_type,
      region,
      date_from,
      date_to
    } = req.query;

    let query = supabase
      .from('prices')
      .select('*');

    // Apply filters
    if (competitor_id) {
      query = query.eq('competitor_id', competitor_id);
    }

    if (property_type) {
      query = query.eq('property_type', property_type);
    }

    if (region) {
      query = query.eq('region', region);
    }

    if (date_from) {
      query = query.gte('detected_at', date_from);
    }

    if (date_to) {
      query = query.lte('detected_at', date_to);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching price analytics:', error);
      return res.status(500).json({
        error: 'Failed to fetch price analytics',
        details: error.message
      });
    }

    // Calculate analytics
    const validPrices = data.filter(item => item.price_eur && item.price_eur > 0);
    const validPricesPerSqm = data.filter(item => item.price_per_sqm_eur && item.price_per_sqm_eur > 0);

    const analytics = {
      total_records: data.length,
      price_statistics: {
        count: validPrices.length,
        min: validPrices.length > 0 ? Math.min(...validPrices.map(p => p.price_eur)) : 0,
        max: validPrices.length > 0 ? Math.max(...validPrices.map(p => p.price_eur)) : 0,
        avg: validPrices.length > 0 ? 
          (validPrices.reduce((sum, p) => sum + p.price_eur, 0) / validPrices.length).toFixed(2) : 0,
        median: validPrices.length > 0 ? calculateMedian(validPrices.map(p => p.price_eur)) : 0
      },
      price_per_sqm_statistics: {
        count: validPricesPerSqm.length,
        min: validPricesPerSqm.length > 0 ? Math.min(...validPricesPerSqm.map(p => p.price_per_sqm_eur)) : 0,
        max: validPricesPerSqm.length > 0 ? Math.max(...validPricesPerSqm.map(p => p.price_per_sqm_eur)) : 0,
        avg: validPricesPerSqm.length > 0 ? 
          (validPricesPerSqm.reduce((sum, p) => sum + p.price_per_sqm_eur, 0) / validPricesPerSqm.length).toFixed(2) : 0,
        median: validPricesPerSqm.length > 0 ? calculateMedian(validPricesPerSqm.map(p => p.price_per_sqm_eur)) : 0
      },
      property_type_breakdown: {},
      region_breakdown: {},
      source_type_breakdown: {},
      recent_prices: data
        .sort((a, b) => new Date(b.detected_at) - new Date(a.detected_at))
        .slice(0, 10)
        .map(price => ({
          id: price.id,
          price_eur: price.price_eur,
          price_per_sqm_eur: price.price_per_sqm_eur,
          property_type: price.property_type,
          region: price.region,
          detected_at: price.detected_at,
          price_context: price.price_context?.substring(0, 100) + 
            (price.price_context?.length > 100 ? '...' : '')
        }))
    };

    // Property type breakdown
    data.forEach(item => {
      if (item.property_type) {
        if (!analytics.property_type_breakdown[item.property_type]) {
          analytics.property_type_breakdown[item.property_type] = {
            count: 0,
            avg_price: 0,
            avg_price_per_sqm: 0
          };
        }
        analytics.property_type_breakdown[item.property_type].count++;
      }
    });

    // Calculate averages for property types
    Object.keys(analytics.property_type_breakdown).forEach(type => {
      const typeData = data.filter(item => item.property_type === type && item.price_eur);
      const typeDataPerSqm = data.filter(item => item.property_type === type && item.price_per_sqm_eur);
      
      analytics.property_type_breakdown[type].avg_price = typeData.length > 0 ?
        (typeData.reduce((sum, item) => sum + item.price_eur, 0) / typeData.length).toFixed(2) : 0;
      
      analytics.property_type_breakdown[type].avg_price_per_sqm = typeDataPerSqm.length > 0 ?
        (typeDataPerSqm.reduce((sum, item) => sum + item.price_per_sqm_eur, 0) / typeDataPerSqm.length).toFixed(2) : 0;
    });

    // Region breakdown
    data.forEach(item => {
      if (item.region) {
        if (!analytics.region_breakdown[item.region]) {
          analytics.region_breakdown[item.region] = {
            count: 0,
            avg_price: 0,
            avg_price_per_sqm: 0
          };
        }
        analytics.region_breakdown[item.region].count++;
      }
    });

    // Calculate averages for regions
    Object.keys(analytics.region_breakdown).forEach(region => {
      const regionData = data.filter(item => item.region === region && item.price_eur);
      const regionDataPerSqm = data.filter(item => item.region === region && item.price_per_sqm_eur);
      
      analytics.region_breakdown[region].avg_price = regionData.length > 0 ?
        (regionData.reduce((sum, item) => sum + item.price_eur, 0) / regionData.length).toFixed(2) : 0;
      
      analytics.region_breakdown[region].avg_price_per_sqm = regionDataPerSqm.length > 0 ?
        (regionDataPerSqm.reduce((sum, item) => sum + item.price_per_sqm_eur, 0) / regionDataPerSqm.length).toFixed(2) : 0;
    });

    // Source type breakdown
    data.forEach(item => {
      if (item.source_type) {
        analytics.source_type_breakdown[item.source_type] = 
          (analytics.source_type_breakdown[item.source_type] || 0) + 1;
      }
    });

    res.json({ data: analytics });
  } catch (err) {
    console.error('Unexpected error in getPriceAnalytics:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};

// Helper function to calculate median
function calculateMedian(numbers) {
  const sorted = numbers.sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return ((sorted[middle - 1] + sorted[middle]) / 2).toFixed(2);
  } else {
    return sorted[middle].toFixed(2);
  }
}

module.exports = {
  getPrices,
  getPriceById,
  createPrice,
  updatePrice,
  deletePrice,
  getPricesByCompetitor,
  getPriceAnalytics
}; 