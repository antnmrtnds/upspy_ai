const { supabase } = require('../lib/supabase');
const logger = require('../utils/logger');
// Using built-in fetch or fallback for Node.js versions that don't have it
const fetch = globalThis.fetch || require('node-fetch');

/**
 * Process content collection jobs
 * @param {Object} job - BullMQ job object
 * @param {string} job.data.competitorId - ID of the competitor to collect content from
 * @param {Array} job.data.sources - Array of content sources to collect from
 * @param {Object} job.data.options - Additional collection options
 * @returns {Object} Processing result
 */
const processContentCollection = async (job) => {
  const { competitorId, sources = ['website', 'social'], options = {} } = job.data;
  
  logger.info('Starting content collection process', {
    jobId: job.id,
    competitorId,
    sources,
    options
  });

  const results = {
    success: true,
    competitorId,
    sources: [],
    totalContentCollected: 0,
    errors: []
  };

  try {
    // Validate competitor exists
    const { data: competitor, error: competitorError } = await supabase
      .from('competitors')
      .select('id, name, website, social_media_urls')
      .eq('id', competitorId)
      .single();

    if (competitorError || !competitor) {
      throw new Error(`Competitor with ID ${competitorId} not found`);
    }

    logger.info('Competitor validated for content collection', { 
      competitor: competitor.name 
    });

    // Process each content source
    for (const source of sources) {
      const sourceResult = await collectFromSource(competitor, source, options);
      results.sources.push(sourceResult);
      results.totalContentCollected += sourceResult.contentCollected;
      
      if (sourceResult.errors.length > 0) {
        results.errors.push(...sourceResult.errors);
      }
    }

    // Update competitor's last_content_collected timestamp
    await supabase
      .from('competitors')
      .update({ last_content_collected: new Date().toISOString() })
      .eq('id', competitorId);

    logger.info('Content collection completed', {
      jobId: job.id,
      competitorId,
      totalContentCollected: results.totalContentCollected,
      errorCount: results.errors.length
    });

    return results;

  } catch (error) {
    logger.error('Content collection failed', {
      jobId: job.id,
      competitorId,
      error: error.message,
      stack: error.stack
    });

    results.success = false;
    results.errors.push({
      type: 'general',
      message: error.message,
      timestamp: new Date().toISOString()
    });

    throw error;
  }
};

/**
 * Collect content from a specific source
 * @param {Object} competitor - Competitor data
 * @param {string} source - Source to collect from
 * @param {Object} options - Collection options
 * @returns {Object} Source collection result
 */
const collectFromSource = async (competitor, source, options = {}) => {
  const result = {
    source,
    contentCollected: 0,
    errors: [],
    timestamp: new Date().toISOString()
  };

  try {
    logger.info(`Collecting content from ${source} for competitor`, {
      competitorId: competitor.id,
      competitorName: competitor.name
    });

    switch (source.toLowerCase()) {
      case 'website':
        return await collectWebsiteContent(competitor, options);
      case 'social':
      case 'social_media':
        return await collectSocialMediaContent(competitor, options);
      case 'blog':
        return await collectBlogContent(competitor, options);
      case 'news':
        return await collectNewsContent(competitor, options);
      default:
        throw new Error(`Unsupported content source: ${source}`);
    }

  } catch (error) {
    logger.error(`Content collection failed for ${source}`, {
      competitorId: competitor.id,
      error: error.message
    });

    result.errors.push({
      type: 'source_error',
      source,
      message: error.message,
      timestamp: new Date().toISOString()
    });

    return result;
  }
};

/**
 * Collect content from competitor's website
 * @param {Object} competitor - Competitor data
 * @param {Object} options - Collection options
 * @returns {Object} Website collection result
 */
const collectWebsiteContent = async (competitor, options = {}) => {
  const result = {
    source: 'website',
    contentCollected: 0,
    errors: [],
    timestamp: new Date().toISOString()
  };

  try {
    if (!competitor.website) {
      throw new Error('No website URL available for competitor');
    }

    logger.info('Starting website content collection', { 
      competitorId: competitor.id,
      website: competitor.website 
    });

    // Simulate content collection from website
    const websiteContent = await simulateWebsiteContentFetch(competitor);
    
    // Store content in database
    for (const contentData of websiteContent) {
      const { data: savedContent, error } = await supabase
        .from('content')
        .insert([{
          competitor_id: competitor.id,
          source: 'website',
          type: contentData.type,
          title: contentData.title,
          content: contentData.content,
          url: contentData.url,
          author: contentData.author,
          published_at: contentData.published_at,
          keywords: contentData.keywords,
          metadata: contentData.metadata,
          collected_at: new Date().toISOString()
        }])
        .select('id')
        .single();

      if (error) {
        logger.error('Failed to save website content', { error: error.message, contentData });
        result.errors.push({
          type: 'database_error',
          message: `Failed to save content: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      } else {
        result.contentCollected++;
        logger.debug('Website content saved', { contentId: savedContent.id });
      }
    }

    logger.info('Website content collection completed', {
      competitorId: competitor.id,
      contentCollected: result.contentCollected
    });

    return result;

  } catch (error) {
    logger.error('Website content collection failed', {
      competitorId: competitor.id,
      error: error.message
    });

    result.errors.push({
      type: 'collection_error',
      message: error.message,
      timestamp: new Date().toISOString()
    });

    return result;
  }
};

/**
 * Collect content from competitor's social media
 * @param {Object} competitor - Competitor data
 * @param {Object} options - Collection options
 * @returns {Object} Social media collection result
 */
const collectSocialMediaContent = async (competitor, options = {}) => {
  const result = {
    source: 'social_media',
    contentCollected: 0,
    errors: [],
    timestamp: new Date().toISOString()
  };

  try {
    logger.info('Starting social media content collection', { 
      competitorId: competitor.id,
      socialUrls: competitor.social_media_urls 
    });

    if (!competitor.social_media_urls || Object.keys(competitor.social_media_urls).length === 0) {
      throw new Error('No social media URLs available for competitor');
    }

    // Simulate content collection from social media
    const socialContent = await simulateSocialMediaContentFetch(competitor);
    
    // Store content in database
    for (const contentData of socialContent) {
      const { data: savedContent, error } = await supabase
        .from('content')
        .insert([{
          competitor_id: competitor.id,
          source: 'social_media',
          type: contentData.type,
          title: contentData.title,
          content: contentData.content,
          url: contentData.url,
          author: contentData.author,
          published_at: contentData.published_at,
          keywords: contentData.keywords,
          metadata: contentData.metadata,
          collected_at: new Date().toISOString()
        }])
        .select('id')
        .single();

      if (error) {
        logger.error('Failed to save social media content', { error: error.message, contentData });
        result.errors.push({
          type: 'database_error',
          message: `Failed to save content: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      } else {
        result.contentCollected++;
        logger.debug('Social media content saved', { contentId: savedContent.id });
      }
    }

    logger.info('Social media content collection completed', {
      competitorId: competitor.id,
      contentCollected: result.contentCollected
    });

    return result;

  } catch (error) {
    logger.error('Social media content collection failed', {
      competitorId: competitor.id,
      error: error.message
    });

    result.errors.push({
      type: 'collection_error',
      message: error.message,
      timestamp: new Date().toISOString()
    });

    return result;
  }
};

/**
 * Collect blog content from competitor
 * @param {Object} competitor - Competitor data
 * @param {Object} options - Collection options
 * @returns {Object} Blog collection result
 */
const collectBlogContent = async (competitor, options = {}) => {
  const result = {
    source: 'blog',
    contentCollected: 0,
    errors: [],
    timestamp: new Date().toISOString()
  };

  try {
    logger.info('Starting blog content collection', { competitorId: competitor.id });

    // Simulate blog content collection
    const blogContent = await simulateBlogContentFetch(competitor);
    
    // Store content in database
    for (const contentData of blogContent) {
      const { data: savedContent, error } = await supabase
        .from('content')
        .insert([{
          competitor_id: competitor.id,
          source: 'blog',
          type: contentData.type,
          title: contentData.title,
          content: contentData.content,
          url: contentData.url,
          author: contentData.author,
          published_at: contentData.published_at,
          keywords: contentData.keywords,
          metadata: contentData.metadata,
          collected_at: new Date().toISOString()
        }])
        .select('id')
        .single();

      if (error) {
        result.errors.push({
          type: 'database_error',
          message: `Failed to save content: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      } else {
        result.contentCollected++;
      }
    }

    return result;

  } catch (error) {
    result.errors.push({
      type: 'collection_error',
      message: error.message,
      timestamp: new Date().toISOString()
    });

    return result;
  }
};

/**
 * Collect news content about competitor
 * @param {Object} competitor - Competitor data
 * @param {Object} options - Collection options
 * @returns {Object} News collection result
 */
const collectNewsContent = async (competitor, options = {}) => {
  const result = {
    source: 'news',
    contentCollected: 0,
    errors: [],
    timestamp: new Date().toISOString()
  };

  try {
    logger.info('Starting news content collection', { competitorId: competitor.id });

    // Simulate news content collection
    const newsContent = await simulateNewsContentFetch(competitor);
    
    // Store content in database
    for (const contentData of newsContent) {
      const { data: savedContent, error } = await supabase
        .from('content')
        .insert([{
          competitor_id: competitor.id,
          source: 'news',
          type: contentData.type,
          title: contentData.title,
          content: contentData.content,
          url: contentData.url,
          author: contentData.author,
          published_at: contentData.published_at,
          keywords: contentData.keywords,
          metadata: contentData.metadata,
          collected_at: new Date().toISOString()
        }])
        .select('id')
        .single();

      if (error) {
        result.errors.push({
          type: 'database_error',
          message: `Failed to save content: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      } else {
        result.contentCollected++;
      }
    }

    return result;

  } catch (error) {
    result.errors.push({
      type: 'collection_error',
      message: error.message,
      timestamp: new Date().toISOString()
    });

    return result;
  }
};

// Mock functions for simulation (these would be replaced with real collection logic)
const simulateWebsiteContentFetch = async (competitor) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return [
    {
      type: 'page',
      title: `About ${competitor.name}`,
      content: `Learn more about ${competitor.name} and our services in the real estate market. We provide comprehensive property solutions...`,
      url: `${competitor.website}/about`,
      author: null,
      published_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      keywords: ['about', 'company', 'real estate', 'services'],
      metadata: {
        wordCount: 450,
        language: 'pt',
        readingTime: '2 minutes'
      }
    },
    {
      type: 'property_listing',
      title: 'Premium Properties in Lisbon',
      content: 'Discover our exclusive collection of premium properties in the heart of Lisbon...',
      url: `${competitor.website}/properties/lisbon`,
      author: null,
      published_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      keywords: ['properties', 'lisbon', 'premium', 'real estate'],
      metadata: {
        propertyCount: 15,
        location: 'Lisbon',
        priceRange: '€500,000 - €2,000,000'
      }
    },
    {
      type: 'service_page',
      title: 'Real Estate Consulting Services',
      content: 'Our expert team provides comprehensive real estate consulting services...',
      url: `${competitor.website}/services/consulting`,
      author: null,
      published_at: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
      keywords: ['consulting', 'services', 'expert', 'real estate'],
      metadata: {
        serviceType: 'consulting',
        expertise: ['investment', 'valuation', 'market analysis']
      }
    }
  ];
};

const simulateSocialMediaContentFetch = async (competitor) => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const platforms = ['facebook', 'instagram', 'linkedin'];
  const content = [];
  
  for (const platform of platforms) {
    const url = competitor.social_media_urls?.[platform];
    if (url) {
      content.push({
        type: 'social_post',
        title: `${competitor.name} - Latest Update`,
        content: `🏠 New properties available! Check out our latest listings in prime locations. #RealEstate #Portugal #Investment`,
        url: `${url}/posts/123456`,
        author: competitor.name,
        published_at: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
        keywords: ['properties', 'investment', 'portugal'],
        metadata: {
          platform,
          engagement: {
            likes: Math.floor(Math.random() * 100),
            shares: Math.floor(Math.random() * 20),
            comments: Math.floor(Math.random() * 15)
          }
        }
      });
    }
  }
  
  return content;
};

const simulateBlogContentFetch = async (competitor) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      type: 'blog_post',
      title: '2024 Real Estate Market Trends in Portugal',
      content: 'The Portuguese real estate market continues to show strong growth in 2024. Key trends include...',
      url: `${competitor.website}/blog/2024-market-trends`,
      author: 'Market Analysis Team',
      published_at: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
      keywords: ['market trends', '2024', 'portugal', 'real estate', 'analysis'],
      metadata: {
        category: 'market-analysis',
        readingTime: '5 minutes',
        tags: ['trends', 'market', 'investment']
      }
    },
    {
      type: 'blog_post',
      title: 'Guide to Buying Property in Lisbon',
      content: 'Complete guide for international buyers looking to invest in Lisbon real estate...',
      url: `${competitor.website}/blog/buying-guide-lisbon`,
      author: 'Investment Specialists',
      published_at: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString(),
      keywords: ['buying guide', 'lisbon', 'property', 'investment', 'international'],
      metadata: {
        category: 'guides',
        readingTime: '8 minutes',
        tags: ['guide', 'buying', 'lisbon']
      }
    }
  ];
};

const simulateNewsContentFetch = async (competitor) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      type: 'news_article',
      title: `${competitor.name} Expands Operations to Northern Portugal`,
      content: `Real estate company ${competitor.name} announced expansion plans to Northern Portugal, focusing on Porto and surrounding areas...`,
      url: 'https://realestate-news.pt/expansion-northern-portugal',
      author: 'Real Estate News Portugal',
      published_at: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
      keywords: ['expansion', 'northern portugal', 'porto', 'real estate'],
      metadata: {
        source: 'Real Estate News Portugal',
        category: 'business news',
        sentiment: 'positive'
      }
    }
  ];
};

module.exports = {
  processContentCollection,
  collectFromSource,
  collectWebsiteContent,
  collectSocialMediaContent,
  collectBlogContent,
  collectNewsContent
}; 