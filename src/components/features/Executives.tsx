'use client';
import React, { useRef } from 'react';
import { getMediaUrl } from '@/lib/client-utils';
import { EditPenIcon } from '../ui/Icons';

export default function Executives({ clubData, updateCMSField, isAdmin, handleMediaUpload }: any) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-amber-950 font-english uppercase tracking-widest mb-2">Executive Committee</h2>
        <p className="text-slate-500">Guiding the cultural and social vision of the faculty family.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(clubData.executives || []).map((exec: any, idx: number) => (
          <div key={exec.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group relative">
            <div className="aspect-[3/4] relative bg-slate-100 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 via-transparent to-transparent opacity-60 z-10"></div>
              <img src={getMediaUrl(exec.photoUrl)} alt={exec.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              
              {isAdmin && (
                <label className="absolute top-3 right-3 bg-white text-slate-800 p-2 rounded-full cursor-pointer shadow-lg hover:bg-amber-100 z-40 transition-transform hover:scale-110">
                  <EditPenIcon />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleMediaUpload(e, idx, 'executives')} />
                </label>
              )}
            </div>
            <div className="p-4 text-center">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">{exec.role}</p>
              {isAdmin ? (
                <input 
                  type="text" 
                  value={exec.name} 
                  onChange={(e) => {
                    const newExecs = [...clubData.executives];
                    newExecs[idx].name = e.target.value;
                    updateCMSField('executives', newExecs);
                  }}
                  className="text-lg font-bold text-slate-800 text-center w-full border-b border-amber-300 focus:outline-none focus:border-amber-600 bg-amber-50 rounded px-1" 
                />
              ) : (
                <h4 className="text-lg font-bold text-slate-800">{exec.name}</h4>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
