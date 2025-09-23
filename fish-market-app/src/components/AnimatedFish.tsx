'use client';

import React from 'react';

interface AnimatedFishProps {
  type?: 'floating' | 'swimming' | 'bubble';
  size?: 'small' | 'medium' | 'large';
  delay?: number;
  className?: string;
}

const AnimatedFish: React.FC<AnimatedFishProps> = ({ 
  type = 'floating', 
  size = 'medium', 
  delay = 0,
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'w-8 h-8';
      case 'large': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  };

  const getAnimationClass = () => {
    switch (type) {
      case 'swimming': return 'fish-swim';
      case 'bubble': return 'bubble-animation';
      default: return 'fish-animation';
    }
  };

  if (type === 'bubble') {
    return (
      <div 
        className={`bubble ${getSizeClasses()} ${getAnimationClass()} ${className}`}
        style={{ animationDelay: `${delay}s` }}
      />
    );
  }

  return (
    <div 
      className={`${getSizeClasses()} ${getAnimationClass()} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <svg 
        viewBox="0 0 100 60" 
        className="w-full h-full text-blue-400 opacity-60"
        fill="currentColor"
      >
        <path d="M85 30c0-11-6-20-15-20s-15 9-15 20c0 11 6 20 15 20s15-9 15-20zM70 25c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5z"/>
        <path d="M15 30c0-11 6-20 15-20s15 9 15 20c0 11-6 20-15 20s-15-9-15-20zM30 25c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5z"/>
        <path d="M50 30c0-11 6-20 15-20s15 9 15 20c0 11-6 20-15 20s-15-9-15-20zM65 25c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5z"/>
        <path d="M5 30c0-11 6-20 15-20s15 9 15 20c0 11-6 20-15 20s-15-9-15-20zM20 25c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5z"/>
        <path d="M35 15c-2 0-4 1-4 3s2 3 4 3 4-1 4-3-2-3-4-3z"/>
        <path d="M45 15c-2 0-4 1-4 3s2 3 4 3 4-1 4-3-2-3-4-3z"/>
        <path d="M55 15c-2 0-4 1-4 3s2 3 4 3 4-1 4-3-2-3-4-3z"/>
        <path d="M65 15c-2 0-4 1-4 3s2 3 4 3 4-1 4-3-2-3-4-3z"/>
        <path d="M75 15c-2 0-4 1-4 3s2 3 4 3 4-1 4-3-2-3-4-3z"/>
        <path d="M25 45c-2 0-4 1-4 3s2 3 4 3 4-1 4-3-2-3-4-3z"/>
        <path d="M35 45c-2 0-4 1-4 3s2 3 4 3 4-1 4-3-2-3-4-3z"/>
        <path d="M45 45c-2 0-4 1-4 3s2 3 4 3 4-1 4-3-2-3-4-3z"/>
        <path d="M55 45c-2 0-4 1-4 3s2 3 4 3 4-1 4-3-2-3-4-3z"/>
        <path d="M65 45c-2 0-4 1-4 3s2 3 4 3 4-1 4-3-2-3-4-3z"/>
        <path d="M75 45c-2 0-4 1-4 3s2 3 4 3 4-1 4-3-2-3-4-3z"/>
      </svg>
    </div>
  );
};

export default AnimatedFish;
