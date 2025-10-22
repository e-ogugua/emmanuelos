import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void
  loading?: 'lazy' | 'eager'
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

/**
 * Optimized Image component with proper error handling and performance optimizations
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  onError,
  loading = 'lazy',
  placeholder = 'empty',
  blurDataURL
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      loading={loading}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      onError={(e) => {
        console.warn(`Failed to load image: ${src}`)
        onError?.(e)
      }}
      quality={85} // Optimize image quality for better performance
    />
  )
}
