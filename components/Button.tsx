import React, { useState } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  onClick,
  ...props 
}) => {
  const [isRippling, setIsRippling] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsRippling(true);
    setTimeout(() => setIsRippling(false), 600); // Match animation duration
    if (onClick) onClick(e);
  };

  const baseStyles = "w-full py-4 px-8 rounded-full font-medium transition-all duration-500 transform active:scale-[0.98] flex items-center justify-center gap-2 text-base tracking-wide relative overflow-hidden";
  
  const variants = {
    primary: "bg-warm-800 text-warm-50 hover:bg-warm-900 shadow-[0_4px_20px_-4px_rgba(41,37,36,0.2)] hover:shadow-[0_8px_30px_-4px_rgba(41,37,36,0.3)] disabled:bg-warm-300 disabled:shadow-none",
    secondary: "bg-lavender-200 text-warm-900 hover:bg-lavender-300 hover:shadow-md disabled:bg-warm-100 disabled:text-warm-400",
    outline: "bg-transparent border border-warm-200 text-warm-600 hover:border-warm-400 hover:bg-white/30",
    ghost: "bg-transparent text-warm-500 hover:bg-warm-100/50 hover:text-warm-800",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {/* Ripple/Light Ring Effect */}
      {isRippling && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="w-full h-full bg-white/30 rounded-full animate-ripple"></span>
        </span>
      )}

      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="animate-pulse">Connecting...</span>
        </>
      ) : (
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      )}
    </button>
  );
};

export default Button;