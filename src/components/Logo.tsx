
import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  className = '',
  showText = true
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

  // If showing just the icon without text
  if (!showText) {
    return (
      <div className={`relative ${sizes[size]} ${className}`}>
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top cube - Blue gradient */}
          <path 
            d="M20 20 L50 35 L80 20 L50 5 Z" 
            fill="url(#blueGradient)" 
            className="drop-shadow-md"
          />
          
          {/* Middle face of top cube */}
          <path 
            d="M20 20 L20 40 L50 55 L50 35 Z" 
            fill="url(#blueGradientLight)" 
            className="drop-shadow-md"
          />
          
          {/* Right face of top cube */}
          <path 
            d="M50 35 L50 55 L80 40 L80 20 Z" 
            fill="url(#blueGradientDark)" 
            className="drop-shadow-md"
          />
          
          {/* Bottom cube - Light blue */}
          <path 
            d="M20 40 L50 55 L80 40 L50 25 Z" 
            fill="#D6E8FF" 
            opacity="0.7"
            className="drop-shadow-sm"
          />
          
          {/* Middle face of bottom cube */}
          <path 
            d="M20 40 L20 60 L50 75 L50 55 Z" 
            fill="#C5E0FF" 
            opacity="0.6"
            className="drop-shadow-sm"
          />
          
          {/* Right face of bottom cube */}
          <path 
            d="M50 55 L50 75 L80 60 L80 40 Z" 
            fill="#B3D7FF" 
            opacity="0.6"
            className="drop-shadow-sm"
          />

          {/* Define gradients */}
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2B8EFF" />
              <stop offset="100%" stopColor="#7CD4FD" />
            </linearGradient>
            <linearGradient id="blueGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3E97FF" />
              <stop offset="100%" stopColor="#6ACFFE" />
            </linearGradient>
            <linearGradient id="blueGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1F85FA" />
              <stop offset="100%" stopColor="#55C5FC" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Full logo with text
  return (
    <div className={`flex items-center ${className}`}>
      <div className={`relative ${sizes[size]}`}>
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top cube - Blue gradient */}
          <path 
            d="M20 20 L50 35 L80 20 L50 5 Z" 
            fill="url(#blueGradient)" 
            className="drop-shadow-md"
          />
          
          {/* Middle face of top cube */}
          <path 
            d="M20 20 L20 40 L50 55 L50 35 Z" 
            fill="url(#blueGradientLight)" 
            className="drop-shadow-md"
          />
          
          {/* Right face of top cube */}
          <path 
            d="M50 35 L50 55 L80 40 L80 20 Z" 
            fill="url(#blueGradientDark)" 
            className="drop-shadow-md"
          />
          
          {/* Bottom cube - Light blue */}
          <path 
            d="M20 40 L50 55 L80 40 L50 25 Z" 
            fill="#D6E8FF" 
            opacity="0.7"
            className="drop-shadow-sm"
          />
          
          {/* Middle face of bottom cube */}
          <path 
            d="M20 40 L20 60 L50 75 L50 55 Z" 
            fill="#C5E0FF" 
            opacity="0.6"
            className="drop-shadow-sm"
          />
          
          {/* Right face of bottom cube */}
          <path 
            d="M50 55 L50 75 L80 60 L80 40 Z" 
            fill="#B3D7FF" 
            opacity="0.6"
            className="drop-shadow-sm"
          />

          {/* Define gradients */}
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2B8EFF" />
              <stop offset="100%" stopColor="#7CD4FD" />
            </linearGradient>
            <linearGradient id="blueGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3E97FF" />
              <stop offset="100%" stopColor="#6ACFFE" />
            </linearGradient>
            <linearGradient id="blueGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1F85FA" />
              <stop offset="100%" stopColor="#55C5FC" />
            </linearGradient>
          </defs>
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
