'use client';
import React, { useRef, useState } from 'react';
import { getMediaUrl } from '@/lib/client-utils';
import { CalendarIcon, PlusIcon, TrashIcon, FacebookIcon, YoutubeIcon, EditPenIcon } from '../ui/Icons';

export default function FrontDesk({
  clubData, isAdmin, updateCMSField, setActiveTab, triggerFeedback, handleMediaUpload, 
  deleteAnnouncement, addAnnouncement, deleteEvent, addEvent
}: any) {
  // Jigsaw Drag & Interaction States
  const [gridDragState, setGridDragState] = useState({ sourceId: null, targetId: null, startX: 0, startY: 0 });
  const [enlargedFrame, setEnlargedFrame] = useState<any>(null);

  const jigsawInterlocks: any = [
    { right: 'out', bottom: 'in' },
    { left: 'in', bottom: 'out', right: 'in' },
    { left: 'in', bottom: 'in' },
    { top: 'out', right: 'out' },
    { top: 'in', left: 'out', bottom: 'out' },
    { top: 'out', right: 'in', left: 'in' },
    { left: 'out', top: 'in', right: 'out' }
  ];

  const handleGridPointerDown = (e: any, id: string) => {
    if (e.target.tagName && (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'button')) return;
    e.stopPropagation();
    
    setGridDragState({
      sourceId: id as any, targetId: null,
      startX: e.clientX || (e.touches && e.touches[0].clientX) || 0,
      startY: e.clientY || (e.touches && e.touches[0].clientY) || 0
    });
  };

  const handleGridPointerUp = (e: any) => {
    if (!gridDragState.sourceId) return;
    
    const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0;
    const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY) || 0;
    const dx = clientX - gridDragState.startX;
    const dy = clientY - gridDragState.startY;
    
    if (gridDragState.sourceId && gridDragState.targetId && gridDragState.sourceId !== gridDragState.targetId) {
      const newFrames = [...clubData.galleryFrames];
      const sourceIdx = newFrames.findIndex(f => f.id === gridDragState.sourceId);
      const targetIdx = newFrames.findIndex(f => f.id === gridDragState.targetId);
      
      if (sourceIdx !== -1 && targetIdx !== -1) {
        const temp = newFrames[sourceIdx];
        newFrames[sourceIdx] = newFrames[targetIdx];
        newFrames[targetIdx] = temp;
        updateCMSField('galleryFrames', newFrames);
        triggerFeedback('success', 'Memory frames rearranged!');
      }
    } else if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
      const frame = clubData.galleryFrames.find((f: any) => f.id === gridDragState.sourceId);
      if (frame) setEnlargedFrame(frame);
    }
    
    setGridDragState({ sourceId: null, targetId: null, startX: 0, startY: 0 });
  };

  const handleGridPointerMove = (e: any) => {
    if (!gridDragState.sourceId) return;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    
    const target = document.elementFromPoint(clientX, clientY);
    const targetFrame = target?.closest('.jigsaw-frame');
    
    if (targetFrame) {
      const targetId = targetFrame.getAttribute('data-id');
      if (targetId && targetId !== gridDragState.sourceId && targetId !== gridDragState.targetId) {
        setGridDragState(prev => ({ ...prev, targetId: targetId as any }));
      }
    } else if (gridDragState.targetId) {
      setGridDragState(prev => ({ ...prev, targetId: null }));
    }
  };

  return (
    <div className="space-y-8" onPointerMove={handleGridPointerMove} onPointerUp={handleGridPointerUp} onMouseLeave={handleGridPointerUp}>
      
      {/* Immersive Photo Zoom Overlay */}
      {enlargedFrame && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 cursor-zoom-out"
          onClick={() => setEnlargedFrame(null)}
        >
          <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <img src={getMediaUrl(enlargedFrame.mediaUrl)} className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl" alt="Enlarged" />
            <p className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-center font-semibold text-lg rounded-b-lg">
              {enlargedFrame.caption}
            </p>
            <button onClick={() => setEnlargedFrame(null)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-colors">
              ✖
            </button>
          </div>
        </div>
      )}

      {/* Guitar-Tanpura Fusion Vector Frame */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-8 sm:p-14 shadow-lg flex flex-col md:flex-row items-center justify-between min-h-[300px]">
        
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none overflow-hidden hidden md:flex items-center justify-end pr-8">
          <svg viewBox="0 0 200 400" className="w-full max-h-full" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="300" r="80" strokeWidth="3" className="text-amber-900" />
            <circle cx="100" cy="300" r="60" strokeWidth="1" className="text-amber-800" />
            <rect x="85" y="20" width="30" height="200" strokeWidth="2" className="text-slate-800" />
            <line x1="90" y1="20" x2="90" y2="380" strokeWidth="1" className="text-amber-900" />
            <line x1="100" y1="20" x2="100" y2="380" strokeWidth="1" className="text-amber-900" />
            <line x1="110" y1="20" x2="110" y2="380" strokeWidth="1" className="text-amber-900" />
            <ellipse cx="100" cy="220" rx="30" ry="40" strokeWidth="3" className="text-amber-950" />
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl">
          {isAdmin ? (
            <input
              type="text"
              value={clubData.aboutHeadline}
              onChange={(e) => updateCMSField('aboutHeadline', e.target.value)}
              className="text-3xl sm:text-4xl font-extrabold text-amber-950 mb-4 leading-tight font-english w-full bg-white/60 border-b border-amber-400 focus:outline-none rounded px-2 py-1"
            />
          ) : (
            <h2 className="text-3xl sm:text-4xl font-extrabold text-amber-950 mb-4 leading-tight font-english">
              {clubData.aboutHeadline}
            </h2>
          )}
          <div className="text-slate-700 text-base sm:text-lg leading-relaxed mb-6 font-medium">
            {isAdmin ? (
              <textarea
                value={clubData.aboutText}
                onChange={(e) => updateCMSField('aboutText', e.target.value)}
                rows={6}
                className="bg-white text-slate-800 rounded-lg border border-amber-300 p-3 w-full focus:ring-2 focus:ring-amber-500 outline-none"
              />
            ) : (
              <p>{clubData.aboutText}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setActiveTab('feed')} className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all text-sm">
              View Social Feed
            </button>
            <button onClick={() => setActiveTab('booking')} className="px-6 py-3 bg-white hover:bg-slate-50 text-amber-800 font-bold rounded-lg border border-amber-200 shadow-sm transition-all text-sm">
              Book Event Space
            </button>
          </div>
        </div>
      </div>

      {/* Structured Faculty Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
          <p className="text-3xl font-extrabold text-rose-500">500+</p>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-2">Faculty Families</p>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
          <p className="text-3xl font-extrabold text-emerald-600">2</p>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-2">Grand Cultural Nights</p>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
          <p className="text-3xl font-extrabold text-indigo-600">1</p>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-2">Outdoor Excursion</p>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
          <p className="text-3xl font-extrabold text-amber-600">30+</p>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-2">Social Events</p>
        </div>
      </div>

      {/* Columns split view */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Notice Bulletins (Col 1) */}
        <div className="lg:col-span-1 bg-white border border-amber-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-amber-950">📢 Notice Board</h3>
              {isAdmin && (
                <button onClick={addAnnouncement} className="p-1 bg-amber-100 text-amber-800 hover:bg-amber-200 rounded font-bold text-xs flex items-center gap-1 px-2">
                  <PlusIcon /> Add
                </button>
              )}
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto hide-scrollbar">
              {[...(clubData.announcements || [])].reverse().map((item: any) => (
                <div key={item.id} className="p-4 bg-amber-50/50 border-l-4 border-amber-400 rounded-r-lg relative group text-sm text-slate-700 leading-relaxed">
                  {isAdmin && (
                    <button onClick={() => deleteAnnouncement(item.id)} className="absolute right-2 top-2 text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 bg-white rounded-full p-1 shadow-sm">
                      <TrashIcon />
                    </button>
                  )}
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Events Timeline (Col 2 & 3) */}
        <div className="lg:col-span-2 bg-white border border-amber-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
              <CalendarIcon /> Active Club Timeline
            </h3>
            {isAdmin && (
              <button onClick={addEvent} className="p-1 bg-amber-100 text-amber-800 hover:bg-amber-200 rounded font-bold text-xs flex items-center gap-1 px-2">
                <PlusIcon /> Create Event
              </button>
            )}
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto hide-scrollbar">
            {[...(clubData.events || [])].reverse().map((event: any) => (
              <div key={event.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative group">
                {isAdmin && (
                  <button onClick={() => deleteEvent(event.id)} className="absolute right-2 top-2 text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 bg-white rounded-full p-1 shadow-sm">
                    <TrashIcon />
                  </button>
                )}
                
                <div className="space-y-1 max-w-sm">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded text-[10px] font-bold tracking-wider uppercase inline-block">
                    {event.location}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800">{event.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{event.desc}</p>
                </div>

                <div className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-center min-w-[120px] shadow-sm">
                  <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wider font-bold">🗓️ Schedule</span>
                  <span className="text-xs font-bold text-amber-600">{event.date}</span>
                </div>
              </div>
            ))}
            {(!clubData.events || clubData.events.length === 0) && (
              <p className="text-sm text-slate-500 text-center py-4">No upcoming events scheduled.</p>
            )}
          </div>
        </div>

        {/* Secretary's Desk Info (Col 4) */}
        <div className="lg:col-span-1 bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col h-full justify-between gap-6">
            <div>
              <h3 className="text-sm font-extrabold text-indigo-900 border-b border-indigo-200 pb-2 mb-4 uppercase tracking-wide">
                Secretary's Desk
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Office Address</span>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">Technology Club<br/>IIT Kharagpur</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Digital Mail</span>
                  <p className="text-xs font-semibold text-indigo-700 break-all">techclub@hijli.iitkgp.ac.in</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Direct Hotline</span>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">+91 3222 281043</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Connect Digitally</span>
              <div className="flex flex-col gap-2">
                <a href="https://www.facebook.com/groups/252061775131510" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:bg-[#1877F2]/10 px-2 py-1.5 rounded-md transition-colors border border-transparent hover:border-[#1877F2]/20">
                  <span className="text-[#1877F2]"><FacebookIcon /></span> Facebook Group
                </a>
                <a href="https://www.youtube.com/@technologyclubiitkgp" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:bg-red-50 px-2 py-1.5 rounded-md transition-colors border border-transparent hover:border-red-100">
                  <YoutubeIcon /> Video Archives
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm mt-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-amber-950 flex items-center gap-2">🧩 Cultural Memory Board</h3>
            <p className="text-sm text-slate-500">Rearrange and piece together our beautiful family moments. Tap/Click to zoom.</p>
          </div>
          <div className="text-xs text-amber-700 bg-amber-50 px-3 py-1 rounded-full font-bold shadow-sm">
            {clubData?.galleryFrames?.length || 0} Memories Rendered
          </div>
        </div>
        
        <div 
          className="w-full relative z-10 grid grid-cols-4 grid-rows-3 gap-1.5 h-[400px] sm:h-[500px] lg:h-[600px] bg-slate-100 rounded-xl overflow-hidden shadow-inner p-2 sm:p-4 touch-none"
        >
          {(clubData?.galleryFrames || []).map((frame: any, idx: number) => {
            const isSource = gridDragState.sourceId === frame.id;
            const isTarget = gridDragState.targetId === frame.id;
            
            const spanClasses = [
              'col-span-2 row-span-2', 
              'col-span-1 row-span-1', 
              'col-span-1 row-span-1', 
              'col-span-1 row-span-1', 
              'col-span-1 row-span-1', 
              'col-span-2 row-span-1', 
              'col-span-2 row-span-1'
            ];
            const spanClass = spanClasses[idx] || 'col-span-1 row-span-1';
            const interlocks = jigsawInterlocks[idx] || {};

            return (
              <div 
                key={frame.id} 
                data-id={frame.id}
                onPointerDown={(e) => handleGridPointerDown(e, frame.id)}
                className={`jigsaw-frame relative group ${spanClass} ${isSource ? 'opacity-90 scale-[1.03] shadow-2xl z-50' : 'hover:scale-[1.01] shadow-sm z-20'} ${isTarget ? 'opacity-60 z-30' : ''}`}
              >
                <div className="w-full h-full rounded-2xl overflow-hidden border-[8px] border-[#0f172a]/80 bg-slate-200 relative shadow-md">
                  <img src={getMediaUrl(frame.mediaUrl)} className="w-full h-full object-cover pointer-events-none" draggable="false" alt="Gallery Frame" />
                  
                  <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent p-2 transition-opacity ${isSource ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                    {isAdmin ? (
                      <input 
                        type="text" 
                        value={frame.caption} 
                        onChange={(e) => {
                          const newFrames = [...clubData.galleryFrames];
                          newFrames[idx].caption = e.target.value;
                          updateCMSField('galleryFrames', newFrames);
                        }} 
                        className="text-xs w-full bg-slate-900/80 text-white placeholder-white/70 font-semibold rounded px-2 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-400 pointer-events-auto" 
                        onPointerDown={e => e.stopPropagation()} 
                      />
                    ) : (
                      <p className="text-[10px] sm:text-xs font-semibold text-white truncate text-center">{frame.caption}</p>
                    )}
                  </div>
                </div>

                {interlocks.top === 'out' && (
                  <svg className="absolute top-[-22px] left-[calc(50%-20px)] w-10 h-6 z-30 pointer-events-none overflow-visible" viewBox="0 0 40 24">
                    <path d="M 12,24 C 12,14 6,15 6,8 C 6,2 12,0 20,0 C 28,0 34,2 34,8 C 34,15 28,14 28,24 Z" fill="rgba(15, 23, 42, 0.8)" stroke="rgba(15, 23, 42, 0.8)" strokeWidth="2" />
                  </svg>
                )}
                {interlocks.top === 'in' && (
                  <svg className="absolute top-[-2px] left-[calc(50%-20px)] w-10 h-6 z-30 pointer-events-none overflow-visible" viewBox="0 0 40 24">
                    <path d="M 12,0 C 12,10 6,9 6,16 C 6,22 12,24 20,24 C 28,24 34,22 34,16 C 34,9 28,10 28,0" fill="#fdfbf7" stroke="rgba(15, 23, 42, 0.8)" strokeWidth="8" />
                  </svg>
                )}

                {interlocks.bottom === 'out' && (
                  <svg className="absolute bottom-[-22px] left-[calc(50%-20px)] w-10 h-6 z-30 pointer-events-none overflow-visible" viewBox="0 0 40 24">
                    <path d="M 12,0 C 12,10 6,9 6,16 C 6,22 12,24 20,24 C 28,24 34,22 34,16 C 34,9 28,10 28,0 Z" fill="rgba(15, 23, 42, 0.8)" stroke="rgba(15, 23, 42, 0.8)" strokeWidth="2" />
                  </svg>
                )}
                {interlocks.bottom === 'in' && (
                  <svg className="absolute bottom-[-2px] left-[calc(50%-20px)] w-10 h-6 z-30 pointer-events-none overflow-visible" viewBox="0 0 40 24">
                    <path d="M 12,24 C 12,14 6,15 6,8 C 6,2 12,0 20,0 C 28,0 34,2 34,8 C 34,15 28,14 28,24" fill="#fdfbf7" stroke="rgba(15, 23, 42, 0.8)" strokeWidth="8" />
                  </svg>
                )}

                {interlocks.left === 'out' && (
                  <svg className="absolute left-[-22px] top-[calc(50%-20px)] w-6 h-10 z-30 pointer-events-none overflow-visible" viewBox="0 0 24 40">
                    <path d="M 24,12 C 14,12 15,6 8,6 C 2,6 0,12 0,20 C 0,28 2,34 8,34 C 15,34 14,28 24,28 Z" fill="rgba(15, 23, 42, 0.8)" stroke="rgba(15, 23, 42, 0.8)" strokeWidth="2" />
                  </svg>
                )}
                {interlocks.left === 'in' && (
                  <svg className="absolute left-[-2px] top-[calc(50%-20px)] w-6 h-10 z-30 pointer-events-none overflow-visible" viewBox="0 0 24 40">
                    <path d="M 0,12 C 10,12 9,6 16,6 C 22,6 24,12 24,20 C 24,28 22,34 16,34 C 9,34 10,28 0,28" fill="#fdfbf7" stroke="rgba(15, 23, 42, 0.8)" strokeWidth="8" />
                  </svg>
                )}

                {interlocks.right === 'out' && (
                  <svg className="absolute right-[-22px] top-[calc(50%-20px)] w-6 h-10 z-30 pointer-events-none overflow-visible" viewBox="0 0 24 40">
                    <path d="M 0,12 C 10,12 9,6 16,6 C 22,6 24,12 24,20 C 24,28 22,34 16,34 C 9,34 10,28 0,28 Z" fill="rgba(15, 23, 42, 0.8)" stroke="rgba(15, 23, 42, 0.8)" strokeWidth="2" />
                  </svg>
                )}
                {interlocks.right === 'in' && (
                  <svg className="absolute right-[-2px] top-[calc(50%-20px)] w-6 h-10 z-30 pointer-events-none overflow-visible" viewBox="0 0 24 40">
                    <path d="M 24,12 C 14,12 15,6 8,6 C 2,6 0,12 0,20 C 0,28 2,34 8,34 C 15,34 14,28 24,28" fill="#fdfbf7" stroke="rgba(15, 23, 42, 0.8)" strokeWidth="8" />
                  </svg>
                )}
                
                {isAdmin && (
                  <label className="absolute top-2 right-2 bg-white/90 text-slate-800 p-1.5 rounded-full cursor-pointer shadow-md hover:bg-amber-100 z-40 transition-transform pointer-events-auto" onPointerDown={e => e.stopPropagation()}>
                    <EditPenIcon />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleMediaUpload(e, idx, 'gallery')} />
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
