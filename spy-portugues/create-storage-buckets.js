// Script to create storage buckets using Supabase client
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createStorageBuckets() {
  console.log('Creating storage buckets...');
  
  const buckets = [
    {
      id: 'ad-creatives',
      name: 'ad-creatives',
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
    },
    {
      id: 'screenshots',
      name: 'screenshots', 
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
    },
    {
      id: 'logos',
      name: 'logos',
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']
    },
    {
      id: 'user-content',
      name: 'user-content',
      public: false,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    }
  ];

  for (const bucket of buckets) {
    try {
      console.log(`Creating bucket: ${bucket.id}`);
      
      const { data, error } = await supabase.storage.createBucket(bucket.id, {
        public: bucket.public,
        fileSizeLimit: bucket.fileSizeLimit,
        allowedMimeTypes: bucket.allowedMimeTypes
      });
      
      if (error) {
        if (error.message.includes('already exists')) {
          console.log(`✓ Bucket ${bucket.id} already exists`);
        } else {
          console.error(`✗ Error creating bucket ${bucket.id}:`, error);
        }
      } else {
        console.log(`✓ Successfully created bucket ${bucket.id}`);
      }
    } catch (err) {
      console.error(`✗ Exception creating bucket ${bucket.id}:`, err);
    }
  }
  
  // List all buckets to verify
  console.log('\nListing all buckets...');
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
    } else {
      console.log('Available buckets:');
      buckets.forEach(bucket => {
        console.log(`- ${bucket.name} (public: ${bucket.public})`);
      });
    }
  } catch (err) {
    console.error('Exception listing buckets:', err);
  }
}

createStorageBuckets(); 