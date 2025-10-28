import { supabaseAdmin } from './supabase'

export interface UploadOptions {
  contentType?: string
  upsert?: boolean
  cacheControl?: string
}

export interface UploadResult {
  data: { path: string } | null
  error: Error | null
}

export interface PublicUrlResult {
  data: { publicUrl: string }
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: Buffer | File | ArrayBuffer,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, file, {
        contentType: options.contentType,
        upsert: options.upsert || false,
        cacheControl: options.cacheControl || '3600'
      })

    return { data, error }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

/**
 * Get public URL for a file in Supabase Storage
 */
export function getPublicUrl(bucket: string, path: string): PublicUrlResult {
  const { data } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(path)

  return { data }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(bucket: string, path: string) {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([path])

    return { data, error }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

/**
 * List files in a Supabase Storage path
 */
export async function listFiles(bucket: string, path: string = '') {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .list(path)

    return { data, error }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

/**
 * Download a file from Supabase Storage
 */
export async function downloadFile(bucket: string, path: string) {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .download(path)

    return { data, error }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

/**
 * Get signed URL for private file access
 */
export async function getSignedUrl(bucket: string, path: string, expiresIn: number = 3600) {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)

    return { data, error }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}
