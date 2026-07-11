'use client';
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FrontDesk from '@/components/features/FrontDesk';
import Executives from '@/components/features/Executives';
import SocialFeed from '@/components/features/SocialFeed';
import FacilityBooking from '@/components/features/FacilityBooking';
import FormsAndRules from '@/components/features/FormsAndRules';
import { uploadFile } from '@/lib/client-utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const triggerFeedback = (type: string, text: string) => {
    setToast({ show: true, message: text, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const [clubData, setClubData] = useState<any>(null);
  const [feedPosts, setFeedPosts] = useState<any>(null);
  const [bookings, setBookings] = useState<any>(null);

  // Initialize from API
  useEffect(() => {
    fetch('/api/club-data').then(res => res.json()).then(setClubData).catch(console.error);
    fetch('/api/posts').then(res => res.json()).then(setFeedPosts).catch(console.error);
    fetch('/api/bookings').then(res => res.json()).then(setBookings).catch(console.error);
    
    // Restore admin session
    fetch('/api/auth/me').then(res => res.json()).then(data => {
      if (data.user && data.user.role === 'ADMIN') {
        setIsAdmin(true);
      }
    }).catch(console.error);
  }, []);

  // Dynamic Content Inputs
  const [newPostText, setNewPostText] = useState('');
  const [newPostMedia, setNewPostMedia] = useState<string | null>(null);
  const [newPostMediaType, setNewPostMediaType] = useState('image');

  const [bookingForm, setBookingForm] = useState({
    memberName: '', employeeCode: '', userCategory: 'Club Member', forumName: '', contactNo: '', date: '', slot: '09:00 AM - 01:00 PM', paymentRef: '', paymentScreenshotUrl: null
  });

  const updateCMSField = async (key: string, value: any) => {
    setClubData((prev: any) => ({ ...prev, [key]: value }));
    if (isAdmin) {
      await fetch('/api/club-data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      });
    }
  };

  const handleMediaUpload = async (e: any, index: any, field: string) => {
    const file = e.target.files[0];
    if (file) {
      triggerFeedback('success', 'Uploading media...');
      const key = await uploadFile(file);
      if (!key) {
        triggerFeedback('error', 'Upload failed!');
        return;
      }
      
      if (field === 'executives') {
        const newExecs = [...clubData.executives];
        newExecs[index].photoUrl = key;
        updateCMSField('executives', newExecs);
        triggerFeedback('success', 'Profile photo updated!');
      } else if (field === 'gallery') {
        const newFrames = [...clubData.galleryFrames];
        newFrames[index].mediaUrl = key;
        updateCMSField('galleryFrames', newFrames);
        triggerFeedback('success', 'Gallery memory updated!');
      } else if (field === 'feed') {
        setNewPostMedia(key);
      } else if (field === 'qr') {
        updateCMSField('qrCodeUrl', key);
        triggerFeedback('success', 'Deposit QR code updated permanently!');
      }
    }
  };

  const deleteAnnouncement = (id: number) => updateCMSField('announcements', clubData.announcements.filter((a: any) => a.id !== id));
  const addAnnouncement = () => {
    const text = prompt("Enter new announcement text:");
    if (text) {
      updateCMSField('announcements', [...clubData.announcements, { id: Date.now().toString(), text }]);
      triggerFeedback('success', 'Notice published successfully.');
    }
  };

  const deleteEvent = (id: number) => {
    updateCMSField('events', clubData.events.filter((e: any) => e.id !== id));
    triggerFeedback('success', 'Event timeline updated.');
  };
  const addEvent = () => {
    const title = prompt("Event Title:");
    if (!title) return;
    const date = prompt("Date (e.g. October 15, 2026):");
    const location = prompt("Location:");
    const desc = prompt("Short Description:");
    updateCMSField('events', [...clubData.events, { id: Date.now().toString(), title, date, location, desc }]);
    triggerFeedback('success', 'New event published successfully.');
  };

  const createPost = async (e: any) => {
    e.preventDefault();
    if (!newPostText.trim() && !newPostMedia) return;

    const newPost = {
      author: isAdmin ? "Club Admin" : "Faculty Family Member",
      timestamp: "Just now",
      text: newPostText,
      mediaType: newPostMediaType,
      mediaUrl: newPostMedia || "",
      likes: 0,
      comments: []
    };

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    });
    
    if (res.ok) {
      const created = await res.json();
      setFeedPosts([created, ...feedPosts]);
      setNewPostText('');
      setNewPostMedia(null);
      triggerFeedback('success', 'Post published to the community feed!');
    }
  };

  const handleLike = async (id: string) => {
    const res = await fetch('/api/posts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'like' })
    });
    if (res.ok) {
      const updated = await res.json();
      setFeedPosts(feedPosts.map((p: any) => p.id === id ? updated : p));
    }
  };

  const handleAddComment = async (postId: string, text: string) => {
    if (!text.trim()) return;
    const comment = { author: isAdmin ? "Admin" : "Community Member", text };
    const res = await fetch('/api/posts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: postId, action: 'comment', comment })
    });
    if (res.ok) {
      const updated = await res.json();
      setFeedPosts(feedPosts.map((p: any) => p.id === postId ? updated : p));
    }
  };

  const deletePost = async (postId: string) => {
    if (!isAdmin) return;
    await fetch(`/api/posts?id=${postId}`, { method: 'DELETE' });
    setFeedPosts(feedPosts.filter((p: any) => p.id !== postId));
    triggerFeedback('success', 'Post removed.');
  };

  const handleBookingSubmit = async (e: any) => {
    e.preventDefault();
    const isExternal = bookingForm.userCategory !== 'Club Member';
    if (isExternal && (!bookingForm.paymentRef || !bookingForm.paymentScreenshotUrl)) {
      triggerFeedback('error', 'Payment Reference ID and Screenshot are strictly mandatory for your category.');
      return;
    }
    
    const newBooking = { 
      bookingId: `TCB-${Math.floor(1000 + Math.random() * 9000)}`, 
      ...bookingForm, 
      status: "Pending" 
    };
    
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking)
    });
    
    if (res.ok) {
      const created = await res.json();
      setBookings([created, ...bookings]);
      triggerFeedback('success', "Reservation submitted and is pending administrative review.");
      setBookingForm({ memberName: '', employeeCode: '', userCategory: 'Club Member', forumName: '', contactNo: '', date: '', slot: '09:00 AM - 01:00 PM', paymentRef: '', paymentScreenshotUrl: null });
    } else {
      const err = await res.json();
      triggerFeedback('error', err.error || 'Failed to submit booking');
    }
  };

  const handlePaymentScreenshotUpload = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      triggerFeedback('success', 'Uploading screenshot...');
      const key = await uploadFile(file);
      if (key) setBookingForm({ ...bookingForm, paymentScreenshotUrl: key });
    }
  };

  const updateBookingStatus = async (id: string, newStatus: string) => {
    const res = await fetch('/api/bookings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus })
    });
    if (res.ok) {
      setBookings(bookings.map((b: any) => b.id === id ? { ...b, status: newStatus } : b));
      triggerFeedback('success', `Booking marked as ${newStatus}.`);
    }
  };

  const daysInMonth = 31;
  const startDayOfWeek = 3; 
  
  const getDayStatus = (dayNum: number) => {
    const dateStr = `2026-07-${dayNum.toString().padStart(2, '0')}`;
    const dayBookings = (Array.isArray(bookings) ? bookings : []).filter((b: any) => b.date === dateStr && b.status === 'Approved');
    if (dayBookings.length === 0) return 'free';
    if (dayBookings.length >= 3) return 'full';
    return 'partial';
  };

  if (!clubData || !feedPosts || !bookings) return null; // Loading state

  return (
    <>
      {toast.show && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 transition-all duration-300 transform translate-y-0 opacity-100 ${
          toast.type === 'error' ? 'bg-rose-100 border border-rose-400 text-rose-800' : 'bg-emerald-50 border border-emerald-300 text-emerald-800'
        }`}>
          <span className="font-bold">{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      <Header activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} setIsAdmin={setIsAdmin} clubData={clubData} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdmin && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-6 text-sm text-emerald-800 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 font-medium">
              <span>🛠️</span>
              <span><strong>Admin Interface Online.</strong> Click elements to edit. Drag frames to rearrange. Validate bookings.</span>
            </div>
            <button onClick={() => setIsAdmin(false)} className="text-xs bg-emerald-600 text-white hover:bg-emerald-700 font-bold px-3 py-1.5 rounded-lg shadow-sm">Exit Admin Mode</button>
          </div>
        )}

        {activeTab === 'home' && (
          <FrontDesk 
            clubData={clubData} isAdmin={isAdmin} updateCMSField={updateCMSField} setActiveTab={setActiveTab} triggerFeedback={triggerFeedback}
            handleMediaUpload={handleMediaUpload} deleteAnnouncement={deleteAnnouncement} addAnnouncement={addAnnouncement}
            deleteEvent={deleteEvent} addEvent={addEvent}
          />
        )}
        
        {activeTab === 'execs' && (
          <Executives clubData={clubData} updateCMSField={updateCMSField} isAdmin={isAdmin} handleMediaUpload={handleMediaUpload} />
        )}
        
        {activeTab === 'feed' && (
          <SocialFeed 
            feedPosts={feedPosts} isAdmin={isAdmin} createPost={createPost} deletePost={deletePost} handleLike={handleLike} handleAddComment={handleAddComment}
            handleMediaUpload={handleMediaUpload} newPostText={newPostText} setNewPostText={setNewPostText} newPostMedia={newPostMedia}
            setNewPostMedia={setNewPostMedia} newPostMediaType={newPostMediaType} setNewPostMediaType={setNewPostMediaType}
          />
        )}

        {activeTab === 'booking' && (
          <FacilityBooking 
            clubData={clubData} isAdmin={isAdmin} bookings={bookings} bookingForm={bookingForm} setBookingForm={setBookingForm}
            handleBookingSubmit={handleBookingSubmit} handlePaymentScreenshotUpload={handlePaymentScreenshotUpload} updateBookingStatus={updateBookingStatus}
            handleMediaUpload={handleMediaUpload} getDayStatus={getDayStatus} daysInMonth={daysInMonth} startDayOfWeek={startDayOfWeek}
          />
        )}

        {activeTab === 'forms' && (
          <FormsAndRules 
            clubData={clubData} 
            isAdmin={isAdmin} 
            updateCMSField={updateCMSField} 
            handleMediaUpload={handleMediaUpload} 
            triggerFeedback={triggerFeedback} 
          />
        )}
      </main>

      <Footer />
    </>
  );
}
