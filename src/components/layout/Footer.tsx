import React from 'react';
import { FacebookIcon, YoutubeIcon } from '../ui/Icons';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-amber-900/50 py-12 text-slate-400 text-sm mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-sanskrit text-amber-500 text-2xl">प्रौ</span>
            <p className="font-english text-lg font-bold text-slate-100 tracking-widest uppercase">Technology Club</p>
          </div>
          <p className="text-xs leading-relaxed max-w-sm">Indian Institute of Technology Kharagpur, established in 1951. Cultivating social camaraderie and rich cultural interaction amongst faculty families.</p>
        </div>
        <div>
          <h4 className="font-bold text-slate-200 mb-4 uppercase tracking-wider text-xs">Reach Administration</h4>
          <div className="space-y-2 text-xs">
            <p>📍 Hijli, Kharagpur, West Bengal 721302</p>
            <p>✉️ <a href="mailto:techclub@hijli.iitkgp.ac.in" className="hover:text-amber-400 transition-colors">techclub@hijli.iitkgp.ac.in</a></p>
            <p>📞 +91 3222 281043</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-slate-200 mb-4 uppercase tracking-wider text-xs">Digital Footprints</h4>
          <div className="flex flex-col gap-3">
            <a href="https://www.facebook.com/groups/252061775131510" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-[#1877F2] transition-colors w-max">
              <FacebookIcon /> Facebook Members Group
            </a>
            <a href="https://www.youtube.com/@technologyclubiitkgp" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors w-max">
              <YoutubeIcon /> Official YouTube Archive
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 text-center text-xs flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>© 2026 Technology Club, IIT Kharagpur.</p>
        <p>Powered by React Workspace Systems.</p>
      </div>
    </footer>
  );
}
