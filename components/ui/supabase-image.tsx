'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

interface SupabaseImageProps extends Omit<ImageProps, 'src'> {
  src: string
  fallbackSrc?: string
  alt: string
}

/**
 * Image component with Supabase error handling and fallback
 */
export function SupabaseImage({ src, fallbackSrc, alt, ...props }: SupabaseImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      // Try fallback src first, then local path
      if (fallbackSrc) {
        setImgSrc(fallbackSrc)
      } else if (src.includes('supabase.co')) {
        // Convert Supabase URL back to local path
        const localPath = src.replace(/^https:\/\/[^\/]+\/storage\/v1\/object\/public\/assets\//, '/assets/')
        setImgSrc(localPath)
      }
    }
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
      unoptimized={hasError} // Disable optimization for fallback images
    />
  )
}
