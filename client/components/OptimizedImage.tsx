import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  placeholderSrc?: string;
}

export function OptimizedImage({
  src,
  alt,
  sizes = '100vw',
  className,
  placeholderSrc,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc || src);

  useEffect(() => {
    // Reset states when src changes
    setLoaded(false);
    setError(false);
    setCurrentSrc(placeholderSrc || src);
  }, [src, placeholderSrc]);

  // Generate srcSet if the URL contains a pattern for responsive images
  const srcSet = src.includes('[width]')
    ? [320, 640, 768, 1024, 1280]
        .map(width => src.replace('[width]', width.toString()) + ` ${width}w`)
        .join(', ')
    : undefined;

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <img
        src={currentSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          error ? 'opacity-0' : ''
        )}
        onLoad={() => {
          setLoaded(true);
          setCurrentSrc(src);
        }}
        onError={() => {
          setError(true);
          console.error(`Failed to load image: ${src}`);
        }}
        {...props}
      />

      {/* Loading state */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <span className="text-sm text-gray-500">Failed to load image</span>
        </div>
      )}
    </div>
  );
}

/**
 * Preload critical images
 */
export function preloadImage(src: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
}

/**
 * Preload a set of critical images
 */
export function preloadImages(srcs: string[]): void {
  srcs.forEach(preloadImage);
}
