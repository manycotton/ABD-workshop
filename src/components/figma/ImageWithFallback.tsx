'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function ImageWithFallback({ src, alt, className, width, height }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      width={width || 64}
      height={height || 64}
      onError={() => {
        setImgSrc('/placeholder-avatar.png');
      }}
    />
  );
}