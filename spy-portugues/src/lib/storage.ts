import { supabase } from "./supabase";

// Storage bucket names
export const STORAGE_BUCKETS = {
  AD_CREATIVES: 'ad-creatives',
  SCREENSHOTS: 'screenshots',
  LOGOS: 'logos',
  USER_CONTENT: 'user-content'
} as const;

// TypeScript interfaces for storage operations
export interface UploadResult {
  path: string;
  fullPath: string;
  id: string;
}

export interface StorageError {
  message: string;
  statusCode?: string;
}

export interface FileUploadOptions {
  cacheControl?: string;
  contentType?: string;
  upsert?: boolean;
}

export interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    eTag: string;
    size: number;
    mimetype: string;
    cacheControl: string;
  };
}

// Allowed file types for each bucket
export const ALLOWED_FILE_TYPES = {
  [STORAGE_BUCKETS.AD_CREATIVES]: [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 
    'video/mp4', 'video/webm'
  ],
  [STORAGE_BUCKETS.SCREENSHOTS]: [
    'image/jpeg', 'image/png', 'image/webp'
  ],
  [STORAGE_BUCKETS.LOGOS]: [
    'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'
  ],
  [STORAGE_BUCKETS.USER_CONTENT]: [
    'image/jpeg', 'image/png', 'image/webp', 'application/pdf'
  ]
} as const;

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  [STORAGE_BUCKETS.AD_CREATIVES]: 52428800, // 50MB
  [STORAGE_BUCKETS.SCREENSHOTS]: 10485760,  // 10MB
  [STORAGE_BUCKETS.LOGOS]: 5242880,         // 5MB
  [STORAGE_BUCKETS.USER_CONTENT]: 10485760  // 10MB
} as const;

/**
 * Validate file before upload
 */
export function validateFile(
  file: File, 
  bucket: keyof typeof STORAGE_BUCKETS
): { valid: boolean; error?: string } {
  const bucketName = STORAGE_BUCKETS[bucket];
  const allowedTypes = ALLOWED_FILE_TYPES[bucketName];
  const sizeLimit = FILE_SIZE_LIMITS[bucketName];

  if (!allowedTypes.includes(file.type as any)) {
    return {
      valid: false,
      error: `File type ${file.type} not allowed for ${bucket}. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  if (file.size > sizeLimit) {
    return {
      valid: false,
      error: `File size ${file.size} bytes exceeds limit of ${sizeLimit} bytes for ${bucket}`
    };
  }

  return { valid: true };
}

/**
 * Generate a unique file path with user ID and timestamp
 */
export function generateFilePath(
  userId: string, 
  fileName: string, 
  folder?: string
): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const basePath = `${userId}/${timestamp}_${sanitizedFileName}`;
  
  return folder ? `${folder}/${basePath}` : basePath;
}

/**
 * Upload a file to a specific bucket
 */
export async function uploadFile(
  bucket: keyof typeof STORAGE_BUCKETS, 
  path: string, 
  file: File,
  options?: FileUploadOptions
): Promise<UploadResult> {
  const bucketName = STORAGE_BUCKETS[bucket];
  
  // Validate file
  const validation = validateFile(file, bucket);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, file, {
      cacheControl: options?.cacheControl || '3600',
      contentType: options?.contentType || file.type,
      upsert: options?.upsert || false
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return {
    path: data.path,
    fullPath: data.fullPath,
    id: data.id
  };
}

/**
 * Get a public URL for a file
 */
export function getPublicUrl(
  bucket: keyof typeof STORAGE_BUCKETS, 
  path: string
): string {
  const bucketName = STORAGE_BUCKETS[bucket];
  return supabase.storage.from(bucketName).getPublicUrl(path).data.publicUrl;
}

/**
 * Download a file
 */
export async function downloadFile(
  bucket: keyof typeof STORAGE_BUCKETS, 
  path: string
): Promise<Blob> {
  const bucketName = STORAGE_BUCKETS[bucket];
  const { data, error } = await supabase.storage.from(bucketName).download(path);
  
  if (error) {
    throw new Error(`Download failed: ${error.message}`);
  }
  
  return data;
}

/**
 * Delete a file
 */
export async function deleteFile(
  bucket: keyof typeof STORAGE_BUCKETS, 
  path: string
): Promise<void> {
  const bucketName = STORAGE_BUCKETS[bucket];
  const { error } = await supabase.storage.from(bucketName).remove([path]);
  
  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * List files in a bucket/folder
 */
export async function listFiles(
  bucket: keyof typeof STORAGE_BUCKETS,
  folder?: string,
  limit?: number,
  offset?: number
): Promise<StorageFile[]> {
  const bucketName = STORAGE_BUCKETS[bucket];
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(folder, {
      limit: limit || 100,
      offset: offset || 0,
      sortBy: { column: 'created_at', order: 'desc' }
    });

  if (error) {
    throw new Error(`List files failed: ${error.message}`);
  }

  return data || [];
}

/**
 * Get file metadata
 */
export async function getFileInfo(
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string
): Promise<StorageFile> {
  const bucketName = STORAGE_BUCKETS[bucket];
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list('', {
      search: path
    });

  if (error) {
    throw new Error(`Get file info failed: ${error.message}`);
  }

  const file = data?.find(f => f.name === path.split('/').pop());
  if (!file) {
    throw new Error(`File not found: ${path}`);
  }

  return file;
}

/**
 * Copy a file within the same bucket or to another bucket
 */
export async function copyFile(
  sourceBucket: keyof typeof STORAGE_BUCKETS,
  sourcePath: string,
  destinationBucket: keyof typeof STORAGE_BUCKETS,
  destinationPath: string
): Promise<UploadResult> {
  // Download from source
  const fileBlob = await downloadFile(sourceBucket, sourcePath);
  
  // Convert blob to file
  const file = new File([fileBlob], destinationPath.split('/').pop() || 'file');
  
  // Upload to destination
  return uploadFile(destinationBucket, destinationPath, file);
}

/**
 * Helper function to upload ad creative
 */
export async function uploadAdCreative(
  userId: string,
  file: File,
  competitorId?: string
): Promise<{ url: string; path: string }> {
  const folder = competitorId ? `competitor_${competitorId}` : 'general';
  const path = generateFilePath(userId, file.name, folder);
  
  const result = await uploadFile('AD_CREATIVES', path, file);
  const url = getPublicUrl('AD_CREATIVES', result.path);
  
  return { url, path: result.path };
}

/**
 * Helper function to upload screenshot
 */
export async function uploadScreenshot(
  userId: string,
  file: File,
  type: 'website' | 'app' | 'ad' = 'website'
): Promise<{ url: string; path: string }> {
  const folder = `${type}_screenshots`;
  const path = generateFilePath(userId, file.name, folder);
  
  const result = await uploadFile('SCREENSHOTS', path, file);
  const url = getPublicUrl('SCREENSHOTS', result.path);
  
  return { url, path: result.path };
}

/**
 * Helper function to upload competitor logo
 */
export async function uploadCompetitorLogo(
  userId: string,
  file: File,
  competitorId: string
): Promise<{ url: string; path: string }> {
  const path = generateFilePath(userId, file.name, `competitor_${competitorId}`);
  
  const result = await uploadFile('LOGOS', path, file);
  const url = getPublicUrl('LOGOS', result.path);
  
  return { url, path: result.path };
}
