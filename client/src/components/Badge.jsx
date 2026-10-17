import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rent: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    buy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    lost: 'bg-rose-50 text-rose-700 border-rose-200',
    found: 'bg-teal-50 text-teal-700 border-teal-200',
    highMatch: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
    mediumMatch: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold',
    lowMatch: 'bg-slate-100 text-slate-700 border-slate-300',
    resolved: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border transition-all ${
        variants[variant] || variants.default
      } ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
};
