import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 py-12 border-t border-neutral-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded bg-white text-neutral-900 flex items-center justify-center font-bold text-xs">
                BK
              </span>
              <span className="font-bold text-white text-sm tracking-tight">Book Kaaro</span>
            </div>
            <p className="text-neutral-400 max-w-md text-xs leading-relaxed">
              Equipping creators, founders, and community builders with structured digital toolkits, authentic messaging frameworks, and publishing consistency.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-neutral-400 text-xs font-medium">
            <a href="#generator-tool" className="hover:text-white transition-colors">
              Generator
            </a>
            <a href="#calendar-view" className="hover:text-white transition-colors">
              Content Calendar
            </a>
            <a href="#marketplace-kits" className="hover:text-white transition-colors">
              Marketplace Templates
            </a>
            <a href="#platform-rules" className="hover:text-white transition-colors">
              Publishing Standards
            </a>
            <a href="#faq-section" className="hover:text-white transition-colors">
              FAQ
            </a>
          </div>
        </div>

        {/* Ethical AI & Legal Disclaimer */}
        <div className="space-y-3 text-[11px] text-neutral-400 leading-relaxed">
          <p>
            <strong>Responsible AI Notice:</strong> Content generated through this platform represents algorithmic suggestions intended to assist ideation and drafting. Book Kaaro does not fabricate user testimonials, engagement statistics, or product claims, and does not promise virality or specific audience reach. Users maintain full responsibility for reviewing, editing, and publishing all content.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-neutral-400">
            <div>
              &copy; {new Date().getFullYear()} Book Kaaro. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>·</span>
              <span>Terms of Service</span>
              <span>·</span>
              <span>Community Standards</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
