import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-lavender-50 via-peach-50 to-misty-50 font-sans text-warm-800 selection:bg-lavender-200 selection:text-warm-900">
      
      {/* Atmospheric Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-lavender-200/40 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-misty-200/40 rounded-full blur-[120px] animate-float-delayed"></div>
        <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-peach-200/30 rounded-full blur-[80px] animate-pulse-slow"></div>
      </div>

      <main className="relative z-10 w-full min-h-screen flex flex-col">
        {children}
      </main>
      
    </div>
  );
};

export default Layout;