import React from 'react';
import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled, 
  className = '', 
  type = 'button' 
}) {
  const baseClasses = 'transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center';
  
  const variants = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg shadow-float',
    secondary: 'bg-white border border-surface-200 text-surface-800 hover:bg-surface-50 rounded-lg',
    ghost: 'text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg',
    danger: 'bg-red-500 hover:bg-red-600 text-white rounded-lg'
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  function createRipple(e) {
    const button = e.currentTarget
    const ripple = document.createElement('span')
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${e.clientX - rect.left - size/2}px;
      top: ${e.clientY - rect.top - size/2}px;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-expand 0.5s ease-out forwards;
      pointer-events: none;
    `
    button.style.position = 'relative'
    button.style.overflow = 'hidden'
    button.appendChild(ripple)
    setTimeout(() => ripple.remove(), 500)
  }

  const handleClick = (e) => {
    createRipple(e);
    if (onClick) onClick(e);
  };

  if (disabled) {
    return (
      <button type={type} className={classes} disabled onClick={handleClick}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}
