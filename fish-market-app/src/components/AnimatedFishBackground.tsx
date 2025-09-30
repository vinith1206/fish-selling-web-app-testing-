'use client';

import React from 'react';

const AnimatedFishBackground: React.FC = () => {
  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {/* Nemo Fish */}
      <div 
        style={{
          position: 'absolute',
          left: '20%',
          top: '30%',
          fontSize: '40px',
          opacity: 0.8,
          animation: 'swimLeft 8s linear infinite',
          zIndex: 1001,
        }}
      >
        🐠
      </div>
      
      {/* Dory Fish */}
      <div 
        style={{
          position: 'absolute',
          left: '60%',
          top: '50%',
          fontSize: '35px',
          opacity: 0.7,
          animation: 'swimRight 10s linear infinite',
          zIndex: 1001,
        }}
      >
        🐟
      </div>
      
      {/* Goldfish */}
      <div 
        style={{
          position: 'absolute',
          left: '80%',
          top: '70%',
          fontSize: '30px',
          opacity: 0.6,
          animation: 'swimLeft 12s linear infinite',
          zIndex: 1001,
        }}
      >
        🐡
      </div>
      
      {/* Betta Fish */}
      <div 
        style={{
          position: 'absolute',
          left: '10%',
          top: '60%',
          fontSize: '35px',
          opacity: 0.9,
          animation: 'swimRight 9s linear infinite',
          zIndex: 1001,
        }}
      >
        🦈
      </div>
      
      {/* Angelfish */}
      <div 
        style={{
          position: 'absolute',
          left: '40%',
          top: '20%',
          fontSize: '32px',
          opacity: 0.8,
          animation: 'swimLeft 11s linear infinite',
          zIndex: 1001,
        }}
      >
        🐠
      </div>
      
      {/* Tetra */}
      <div 
        style={{
          position: 'absolute',
          left: '70%',
          top: '40%',
          fontSize: '28px',
          opacity: 0.7,
          animation: 'swimRight 7s linear infinite',
          zIndex: 1001,
        }}
      >
        🐟
      </div>
      
      {/* Guppy */}
      <div 
        style={{
          position: 'absolute',
          left: '30%',
          top: '75%',
          fontSize: '25px',
          opacity: 0.6,
          animation: 'swimLeft 13s linear infinite',
          zIndex: 1001,
        }}
      >
        🐡
      </div>
      
      {/* Discus */}
      <div 
        style={{
          position: 'absolute',
          left: '50%',
          top: '15%',
          fontSize: '38px',
          opacity: 0.8,
          animation: 'swimRight 9s linear infinite',
          zIndex: 1001,
        }}
      >
        🦈
      </div>
      
      {/* Clownfish */}
      <div 
        style={{
          position: 'absolute',
          left: '85%',
          top: '25%',
          fontSize: '33px',
          opacity: 0.7,
          animation: 'swimLeft 10s linear infinite',
          zIndex: 1001,
        }}
      >
        🐠
      </div>
      
      {/* Tang Fish */}
      <div 
        style={{
          position: 'absolute',
          left: '15%',
          top: '45%',
          fontSize: '29px',
          opacity: 0.6,
          animation: 'swimRight 8s linear infinite',
          zIndex: 1001,
        }}
      >
        🐟
      </div>
      
      {/* Puffer Fish */}
      <div 
        style={{
          position: 'absolute',
          left: '75%',
          top: '55%',
          fontSize: '31px',
          opacity: 0.8,
          animation: 'swimLeft 11s linear infinite',
          zIndex: 1001,
        }}
      >
        🐡
      </div>
      
      {/* Shark */}
      <div 
        style={{
          position: 'absolute',
          left: '5%',
          top: '35%',
          fontSize: '42px',
          opacity: 0.9,
          animation: 'swimRight 12s linear infinite',
          zIndex: 1001,
        }}
      >
        🦈
      </div>
      
      {/* Small School Fish */}
      <div 
        style={{
          position: 'absolute',
          left: '45%',
          top: '65%',
          fontSize: '22px',
          opacity: 0.5,
          animation: 'swimLeft 14s linear infinite',
          zIndex: 1001,
        }}
      >
        🐠
      </div>
      
      {/* Another School Fish */}
      <div 
        style={{
          position: 'absolute',
          left: '55%',
          top: '65%',
          fontSize: '20px',
          opacity: 0.5,
          animation: 'swimLeft 14s linear infinite',
          animationDelay: '1s',
          zIndex: 1001,
        }}
      >
        🐟
      </div>
      
      {/* Third School Fish */}
      <div 
        style={{
          position: 'absolute',
          left: '65%',
          top: '65%',
          fontSize: '18px',
          opacity: 0.5,
          animation: 'swimLeft 14s linear infinite',
          animationDelay: '2s',
          zIndex: 1001,
        }}
      >
        🐡
      </div>
      
      {/* Large Angelfish */}
      <div 
        style={{
          position: 'absolute',
          left: '90%',
          top: '45%',
          fontSize: '36px',
          opacity: 0.7,
          animation: 'swimLeft 15s linear infinite',
          zIndex: 1001,
        }}
      >
        🐠
      </div>
      
      {/* Bottom Swimmer */}
      <div 
        style={{
          position: 'absolute',
          left: '25%',
          top: '80%',
          fontSize: '27px',
          opacity: 0.6,
          animation: 'swimRight 10s linear infinite',
          zIndex: 1001,
        }}
      >
        🐟
      </div>
      
      <style jsx>{`
        @keyframes swimLeft {
          0% {
            transform: translateX(100vw);
          }
          100% {
            transform: translateX(-100px);
          }
        }
        
        @keyframes swimRight {
          0% {
            transform: translateX(-100px);
          }
          100% {
            transform: translateX(100vw);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedFishBackground;