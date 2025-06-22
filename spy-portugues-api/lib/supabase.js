const { createClient } = require('@supabase/supabase-js');

// Validate environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

if (process.env.NODE_ENV !== 'test') {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}

let supabase = null;
if (process.env.NODE_ENV !== 'test') {
  // Create Supabase client with service role key for backend operations
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
} else {
  // Simple mock for tests
  class MockQuery {
    select() { return this; }
    eq() { return this; }
    or() { return this; }
    order() { return this; }
    range() { return Promise.resolve({ data: [], error: null, count: 0 }); }
    limit() { return this; }
    insert() { return Promise.resolve({ data: {}, error: null }); }
    single() { return Promise.resolve({ data: {}, error: null }); }
  }

  supabase = {
    from: () => new MockQuery(),
  };
}

// Test connection function
const testConnection = async () => {
  if (process.env.NODE_ENV === 'test') {
    return true;
  }
  try {
    const { data, error } = await supabase
      .from('competitors')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection established successfully');
    return true;
  } catch (err) {
    console.error('Supabase connection error:', err.message);
    return false;
  }
};

module.exports = {
  supabase,
  testConnection
}; 