
import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
      >
        {/* Bottom cube part (outline) */}
        <path 
          d="M20 55 L50 70 L80 55 L50 40 Z" 
          fill="none" 
          stroke="#000" 
          strokeWidth="2"
        />
        
        {/* Front face (outline) */}
        <path 
          d="M20 55 L20 75 L50 90 L50 70 Z" 
          fill="none" 
          stroke="#000" 
          strokeWidth="2"
        />
        
        {/* Right face (outline) */}
        <path 
          d="M50 70 L50 90 L80 75 L80 55 Z" 
          fill="none" 
          stroke="#000" 
          strokeWidth="2"
        />
        
        {/* Top cube part (blue gradient) */}
        <path 
          d="M20 35 L50 50 L80 35 L50 20 Z" 
          fill="url(#blueGradient)" 
        />
        
        {/* Front face of top cube */}
        <path 
          d="M20 35 L20 55 L50 70 L50 50 Z" 
          fill="none" 
          stroke="#000" 
          strokeWidth="2"
        />
        
        {/* Right face of top cube */}
        <path 
          d="M50 50 L50 70 L80 55 L80 35 Z" 
          fill="none" 
          stroke="#000" 
          strokeWidth="2"
        />

        {/* Define gradients */}
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#66B2FF" />
            <stop offset="100%" stopColor="#3399FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Logo;
