import React from 'react';

export default function Badge({ children, color = 'blue', className = '' }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${colors[color]} ${className}`}>
      {children}
    </span>
  );
}
