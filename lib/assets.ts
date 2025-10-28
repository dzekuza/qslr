/**
 * Get Supabase Storage URL for assets
 */
export function getAssetUrl(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  
  // If Supabase is not configured, use local path
  if (!supabaseUrl) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL not found, falling back to local path')
    return path.startsWith('/') ? path : `/${path}`
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  return `${supabaseUrl}/storage/v1/object/public/assets/${cleanPath}`
}

/**
 * Get asset URL with fallback to local path
 */
export function getAssetUrlWithFallback(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  
  // If Supabase is not configured, use local path
  if (!supabaseUrl) {
    return path.startsWith('/') ? path : `/${path}`
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  return `${supabaseUrl}/storage/v1/object/public/assets/${cleanPath}`
}

/**
 * Get Supabase Storage URL for product images
 */
export function getProductImageUrl(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL not found, falling back to local path')
    return path
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  return `${supabaseUrl}/storage/v1/object/public/product-images/${cleanPath}`
}

/**
 * Get Supabase Storage URL for product attachments
 */
export function getProductAttachmentUrl(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL not found, falling back to local path')
    return path
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  return `${supabaseUrl}/storage/v1/object/public/product-attachments/${cleanPath}`
}

/**
 * Get Supabase Storage URL for vendor logos
 */
export function getVendorLogoUrl(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL not found, falling back to local path')
    return path
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  return `${supabaseUrl}/storage/v1/object/public/vendor-logos/${cleanPath}`
}
