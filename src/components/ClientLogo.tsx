import { useRef, useEffect, useState } from 'react';

interface ClientLogoProps {
  src: string;
  alt: string;
  index: number;
}

const ClientLogo = ({ src, alt, index }: ClientLogoProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // const observer = new IntersectionObserver(
    //   ([entry]) => {
    //     if (entry.isIntersecting) {
    //       setIsInView(true);
    //       observer.disconnect();
    //     }
    //   },
    //   {
    //     rootMargin: '50px',
    //     threshold: 0.1
    //   }
    // );

    if (imgRef.current) {
      // observer.observe(imgRef.current);
    }

    // return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
      {/* {isInView && ( */}
        <img
          ref={imgRef}
          width={100}
          height={40}
          loading="lazy"
          src={src}
          alt={alt}
          className={`h-full w-auto object-contain transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          // onLoad={handleLoad}
        />
      {/* )} */}
    </div>
  );
};

export default ClientLogo; 