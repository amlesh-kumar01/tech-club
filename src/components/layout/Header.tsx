'use client';
import React, { useState } from 'react';
import { HomeIcon, UsersIcon, FeedIcon, BookingIcon, ShieldCheckIcon, LockIcon } from '../ui/Icons';

export default function Header({ activeTab, setActiveTab, isAdmin, setIsAdmin, clubData }: any) {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      alert('Admin mode securely exited.');
    } else {
      setForgotPasswordMode(false);
      setShowAdminModal(true);
    }
  };

  const verifyAdminPassword = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: adminPassword })
      });
      if (res.ok) {
        setIsAdmin(true);
        setShowAdminModal(false);
        setAdminPassword('');
      } else {
        alert('Incorrect Password!');
      }
    } catch (e) {
      alert('Login error');
    }
  };

  return (
    <>
      <header className="bg-white border-b border-amber-900/10 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center font-bold text-white shadow-lg border border-amber-900/20">
              <span className="font-sanskrit text-lg">प्रौ</span>
            </div>
            <div className="leading-tight">
              <h1 className="text-2xl font-bold text-amber-950 flex flex-col">
                <span className="font-sanskrit text-amber-800 tracking-wider">{clubData?.heroTitleSanskrit || 'प्रौद्योगिकी संघ'}</span>
                <span className="font-english text-sm font-bold text-slate-700 uppercase tracking-[0.2em] -mt-1">{clubData?.heroTitleEnglish || 'Technology Club'}</span>
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button onClick={() => setActiveTab('home')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'home' ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
              <HomeIcon /> Front Desk
            </button>
            <button onClick={() => setActiveTab('execs')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'execs' ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
              <UsersIcon /> Executives
            </button>
            <button onClick={() => setActiveTab('feed')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'feed' ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
              <FeedIcon /> Social Feed
            </button>
            <button onClick={() => setActiveTab('booking')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'booking' ? 'bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
              <BookingIcon /> Facility Booking
            </button>
            <span className="h-6 w-[1px] bg-slate-300 mx-1 hidden sm:inline-block"></span>
            <button onClick={handleAdminToggle} className={`ml-1 px-3 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 border ${isAdmin ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm' : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'}`}>
              {isAdmin ? <ShieldCheckIcon /> : <LockIcon />}
              {isAdmin ? 'Admin Mode' : 'Admin'}
            </button>
          </div>
        </div>
      </header>

      {showAdminModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            {!forgotPasswordMode ? (
              <>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2"><LockIcon /> Administrator Access</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">Authenticate to manage notices, approve reservations, and customize gallery.</p>
                <input type="password" placeholder="Enter passcode" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent mb-4" onKeyDown={(e) => e.key === 'Enter' && verifyAdminPassword()} />
                <div className="flex justify-between items-center mb-4">
                  <button type="button" onClick={() => setForgotPasswordMode(true)} className="text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline">Forgot Passcode?</button>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowAdminModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-semibold text-slate-600 transition-colors">Cancel</button>
                  <button onClick={verifyAdminPassword} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold transition-colors shadow-md">Authenticate</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">🔑 Forgot Passcode?</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">Contact the default administrator email ID: techclub@hijli.iitkgp.ac.in</p>
                <div className="flex justify-end">
                  <button onClick={() => setForgotPasswordMode(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-950 rounded-lg text-sm font-bold text-white transition-colors">Back</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
