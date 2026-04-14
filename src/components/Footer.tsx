import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative py-8 bg-black border-t border-white/5 w-full">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[11px] text-white/60 font-medium">
          ©2026 Joey Yap Private Limited. All rights reserved
        </p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] text-white/60 font-medium">
          <a href="https://home.joeyyap.com/terms-and-conditions/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Term of Service</a>
          <span className="opacity-30">|</span>
          <a href="https://home.joeyyap.com/disclaimer/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Disclaimer</a>
          <span className="opacity-30">|</span>
          <a href="https://home.joeyyap.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a>
          <span className="opacity-30">|</span>
          <a href="https://home.joeyyap.com/contact-us/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};
