'use client';
import React, { useState } from 'react';
import { HomeIcon, UsersIcon, FeedIcon, BookingIcon, ShieldCheckIcon, LockIcon } from '../ui/Icons';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';

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

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setIsAdmin(true);
        setShowAdminModal(false);
      } else {
        alert(data.error || 'Authentication Failed');
        auth.signOut(); // Ensure client is signed out if server rejected
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Google Sign-In was cancelled or failed.');
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
            <div className="hidden md:flex items-center gap-1">
              {['home', 'feed', 'booking', 'forms'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === tab
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                  }`}
                >
                  {tab === 'home' && 'Front Desk'}
                  {tab === 'feed' && 'Social Feed'}
                  {tab === 'booking' && 'Facility Booking'}
                  {tab === 'forms' && 'Forms & Rules'}
                </button>
              ))}
            </div>
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
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">Authenticate with your authorized Google Account to manage notices, approve reservations, and customize gallery.</p>
                
                <div className="flex flex-col gap-3 mb-4">
                  <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-lg shadow-sm transition-all">
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                    Sign in with Google
                  </button>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <button type="button" onClick={() => setForgotPasswordMode(true)} className="text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline">Help & Support</button>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowAdminModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-semibold text-slate-600 transition-colors w-full">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">🛡️ Help & Support</h3>
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
