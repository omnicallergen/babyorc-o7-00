
import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  className = '',
  showText = false // Changed default to false
}) => {
  const sizes = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  const logoSizes = {
    small: 'w-20',
    medium: 'w-28',
    large: 'w-36'
  };

  // If not showing text, just return the icon
  if (!showText) {
    return (
      <div className={`relative ${sizes[size]} ${className}`}>
        <svg 
          viewBox="0 0 42 49" 
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <g>
            <path fillRule="evenodd" clipRule="evenodd" d="M37.5,38.3c4-2.5,4.2-8.2,0.4-11l-12.3-8.9c-2.2-1.6-5.1-1.7-7.3-0.3L4.5,26.5c-4,2.5-4.2,8.2-0.4,11
              l12.3,8.9c2.2,1.6,5.1,1.7,7.3,0.3L37.5,38.3z M22.8,45.2l13.8-8.5c2.9-1.8,3.1-6,0.3-8l-12.3-8.9c-1.6-1.2-3.7-1.2-5.4-0.2L5.4,28
              c-2.9,1.8-3.1,6-0.3,8L17.4,45C19,46.2,21.1,46.3,22.8,45.2z"/>
            <path fill="#C0EAFD" d="M37.9,20.1c3.8,2.8,3.6,8.5-0.4,11l-13.8,8.5c-2.3,1.4-5.2,1.3-7.3-0.3L4.1,30.3c-3.8-2.8-3.6-8.5,0.4-11
              l13.8-8.5c2.3-1.4,5.2-1.3,7.3,0.3L37.9,20.1z"/>
            <g>
              <g>
                <clipPath id="SVGID_2_">
                  <path d="M37.9,11.5c3.8,2.8,3.6,8.5-0.4,11l-13.8,8.5c-2.3,1.4-5.2,1.3-7.3-0.3L4.1,21.7c-3.8-2.8-3.6-8.5,0.4-11
                    l13.8-8.5c2.3-1.4,5.2-1.3,7.3,0.3L37.9,11.5z"/>
                </clipPath>
                <g clipPath="url(#SVGID_2_)">
                  <rect x="-3.6" y="-3.7" width="49.3" height="40.6" fill="#2B8EFF" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    );
  }

  // Full logo with text if showText is true
  return (
    <div className={`flex items-center ${className}`}>
      <div className={`relative ${sizes[size]}`}>
        <svg 
          viewBox="0 0 42 49" 
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <g>
            <path fillRule="evenodd" clipRule="evenodd" d="M37.5,38.3c4-2.5,4.2-8.2,0.4-11l-12.3-8.9c-2.2-1.6-5.1-1.7-7.3-0.3L4.5,26.5c-4,2.5-4.2,8.2-0.4,11
              l12.3,8.9c2.2,1.6,5.1,1.7,7.3,0.3L37.5,38.3z M22.8,45.2l13.8-8.5c2.9-1.8,3.1-6,0.3-8l-12.3-8.9c-1.6-1.2-3.7-1.2-5.4-0.2L5.4,28
              c-2.9,1.8-3.1,6-0.3,8L17.4,45C19,46.2,21.1,46.3,22.8,45.2z"/>
            <path fill="#C0EAFD" d="M37.9,20.1c3.8,2.8,3.6,8.5-0.4,11l-13.8,8.5c-2.3,1.4-5.2,1.3-7.3-0.3L4.1,30.3c-3.8-2.8-3.6-8.5,0.4-11
              l13.8-8.5c2.3-1.4,5.2-1.3,7.3,0.3L37.9,20.1z"/>
            <g>
              <g>
                <clipPath id="SVGID_2_">
                  <path d="M37.9,11.5c3.8,2.8,3.6,8.5-0.4,11l-13.8,8.5c-2.3,1.4-5.2,1.3-7.3-0.3L4.1,21.7c-3.8-2.8-3.6-8.5,0.4-11
                    l13.8-8.5c2.3-1.4,5.2-1.3,7.3,0.3L37.9,11.5z"/>
                </clipPath>
                <g clipPath="url(#SVGID_2_)">
                  <rect x="-3.6" y="-3.7" width="49.3" height="40.6" fill="#2B8EFF" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
      <div className={`ml-2 ${size === 'small' ? 'text-sm' : size === 'large' ? 'text-xl' : 'text-base'}`}>
        <span className="font-bold text-black dark:text-white">go:</span>
        <span className="font-light text-black dark:text-white">lofty</span>
      </div>
    </div>
  );
};

export default Logo;
