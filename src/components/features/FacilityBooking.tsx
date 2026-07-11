'use client';
import React, { useRef } from 'react';
import { getMediaUrl } from '@/lib/client-utils';
import { ShieldCheckIcon } from '../ui/Icons';

export default function FacilityBooking({
  clubData, isAdmin, bookings, bookingForm, setBookingForm, handleBookingSubmit, handlePaymentScreenshotUpload, updateBookingStatus, handleMediaUpload, getDayStatus, daysInMonth, startDayOfWeek
}: any) {
  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fadeIn">
      
      <div className="bg-white border border-indigo-100 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="max-w-2xl">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-3">
            Unified Booking System
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2 font-english">Technology Club Multipurpose Facility</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Reserve our central dynamic space for your community activities. Review the calendar for availability and select your membership category below. Non-members & Societies must submit payment verification.
          </p>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl min-w-[250px] flex flex-col gap-2 text-sm shadow-inner">
          <p className="font-bold text-amber-900 border-b border-amber-200/50 pb-1 flex items-center gap-2">
            <span className="text-lg">💬</span> Need Assistance?
          </p>
          <p className="text-amber-800 text-xs">Reach the Secretary directly to expedite pending approvals or discuss event needs.</p>
          <div className="font-semibold text-amber-950 text-xs flex flex-col gap-0.5 mt-1">
            <span>✉️ techclub@hijli.iitkgp.ac.in</span>
            <span>📞 +91 3222 281043</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h4 className="text-lg font-bold text-slate-800 mb-6 pb-3 border-b border-slate-100">
            📅 Facility Reservation Form
          </h4>
          
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-600 font-bold uppercase tracking-wide mb-2">User Category</label>
              <select
                value={bookingForm.userCategory}
                onChange={(e) => setBookingForm({ ...bookingForm, userCategory: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-400 outline-none"
              >
                <option value="Club Member">Club Member</option>
                <option value="Society/Department/Community">Society / Department / Community (IIT Kgp only)</option>
                <option value="Non-member">Non-Member</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wide mb-1">Member / Applicant Name <span className="text-rose-500">*</span></label>
                <input
                  type="text" required
                  value={bookingForm.memberName}
                  onChange={(e) => setBookingForm({ ...bookingForm, memberName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wide mb-1">Employee Code <span className="text-rose-500">*</span></label>
                <input
                  type="text" required
                  value={bookingForm.employeeCode}
                  onChange={(e) => setBookingForm({ ...bookingForm, employeeCode: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            {bookingForm.userCategory !== 'Club Member' && (
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 animate-in fade-in zoom-in duration-300 mb-4">
                <label className="block text-[11px] text-indigo-700 font-bold uppercase tracking-wide mb-1">Forum Name <span className="text-rose-500">*</span></label>
                <input
                  type="text" required
                  value={bookingForm.forumName}
                  onChange={(e) => setBookingForm({ ...bookingForm, forumName: e.target.value })}
                  className="w-full bg-white border border-indigo-200 rounded-md px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wide mb-1">Contact (Mobile No.) <span className="text-rose-500">*</span></label>
                <input
                  type="tel" required
                  value={bookingForm.contactNo}
                  onChange={(e) => setBookingForm({ ...bookingForm, contactNo: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-wide mb-1">AC Preference <span className="text-rose-500">*</span></label>
                <select
                  value={bookingForm.acPreference || 'Non-AC'}
                  onChange={(e) => setBookingForm({ ...bookingForm, acPreference: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-400"
                >
                  <option value="Non-AC">Non-AC</option>
                  <option value="AC">AC</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-4">
              <div>
                <label className="block text-xs text-slate-600 font-bold uppercase tracking-wide mb-1">Target Date</label>
                <input
                  type="date" required
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 font-bold uppercase tracking-wide mb-1">Time-Slot</label>
                <select
                  value={bookingForm.slot}
                  onChange={(e) => setBookingForm({ ...bookingForm, slot: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400"
                >
                  <option value="Morning (half day)">Morning (half day)</option>
                  <option value="Evening (half day)">Evening (half day)</option>
                  <option value="Full day">Full day</option>
                </select>
              </div>
            </div>

            {bookingForm.userCategory !== 'Club Member' && (
              <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-700 shadow-xl mt-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <h5 className="text-white font-bold text-sm mb-3 flex items-center justify-between border-b border-slate-700 pb-2">
                  <span>💳 Secure Facility Deposit</span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded uppercase tracking-wider">Required Action</span>
                </h5>
                <div className="flex flex-col sm:flex-row gap-5 items-center">
                  <div className="relative group rounded-xl overflow-hidden shadow-sm border border-emerald-100 bg-white">
                    <img src={getMediaUrl(clubData.qrCodeUrl)} alt="Payment QR Code" className="w-full object-contain h-64" />
                    {isAdmin && (
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold cursor-pointer rounded-xl">
                        Change QR
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleMediaUpload(e, null, 'qr')} />
                      </label>
                    )}
                  </div>
                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">UPI Transaction Reference ID</label>
                      <input
                        type="text" required
                        placeholder="e.g. 3209148XXXX"
                        value={bookingForm.paymentRef}
                        onChange={(e) => setBookingForm({ ...bookingForm, paymentRef: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded text-xs text-white px-3 py-2 outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Upload Payment Screen Capture</label>
                      <div className="bg-white border-2 border-dashed border-emerald-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[200px] text-center relative group">
                        {bookingForm.paymentScreenshotUrl ? (
                          <a href={getMediaUrl(bookingForm.paymentScreenshotUrl)} target="_blank" rel="noreferrer" className="text-emerald-600 text-xs font-bold underline">View Screenshot</a>
                        ) : (
                          <input
                            type="file" accept="image/*" required
                            onChange={handlePaymentScreenshotUpload}
                            className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-lg text-sm transition-all shadow-md active:scale-[0.99]">
              Submit Application
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-base font-bold text-slate-800 mb-4 flex items-center justify-between">
              <span>🗓️ Availability Calendar <span className="text-sm font-normal text-slate-500 ml-2">(July 2026)</span></span>
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-300"></span> Free</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-300"></span> Partial</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-100 border border-rose-300"></span> Full</span>
              </div>
            </h4>

            <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-slate-500 mb-2">
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            
            <div className="grid grid-cols-7 gap-1.5">
              {[...Array(startDayOfWeek)].map((_, i) => (
                <div key={`empty-${i}`} className="h-10 sm:h-14 rounded-lg bg-slate-50/50"></div>
              ))}
              
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const status = getDayStatus(day);
                const bgClass = status === 'full' ? 'bg-rose-50 border-rose-200 text-rose-800' :
                                status === 'partial' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                                'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100';
                
                return (
                  <button 
                    key={day}
                    onClick={() => setBookingForm((prev: any) => ({ ...prev, date: `2026-07-${day.toString().padStart(2, '0')}` }))}
                    className={`h-10 sm:h-14 rounded-lg border font-bold flex items-center justify-center text-sm transition-colors cursor-pointer ${bgClass}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {isAdmin && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-slate-700">
                <ShieldCheckIcon />
              </div>
              <h4 className="text-sm font-bold text-white mb-3">
                🛡️ Financial & Application Review Desk ({bookings.filter((b: any) => b.status === 'Pending').length} Pending)
              </h4>
              
              <div className="space-y-3 max-h-72 overflow-y-auto hide-scrollbar">
                {bookings.filter((b: any) => b.status === 'Pending').length === 0 && <p className="text-xs text-slate-400">All applications processed.</p>}
                {bookings.filter((b: any) => b.status === 'Pending').map((pending: any) => (
                  <div key={pending.id} className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex flex-col gap-3">
                    <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                      <div>
                        <span className="font-bold text-sm text-slate-100">{pending.memberName} <span className="text-[10px] text-slate-500">({pending.employeeCode})</span></span>
                        <p className="text-xs text-amber-400 font-semibold">{pending.userCategory} {pending.forumName ? `— ${pending.forumName}` : ''}</p>
                        <p className="text-xs text-slate-400 mt-1">Requested: <strong className="text-slate-200">{pending.date} | {pending.slot} ({pending.acPreference || 'Non-AC'})</strong></p>
                        {pending.contactNo && <p className="text-xs text-slate-500 mt-0.5">📞 {pending.contactNo}</p>}
                      </div>
                    </div>

                    {pending.userCategory !== 'Club Member' && pending.paymentRef && (
                      <div className="bg-slate-950 p-2.5 rounded flex items-center gap-3">
                        <img src={getMediaUrl(pending.paymentScreenshotUrl)} alt="Payment Receipt" className="w-14 h-14 object-cover rounded cursor-pointer border border-slate-700 hover:scale-150 transition-transform origin-left" />
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-0.5">Txn ID Provided</span>
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded">{pending.paymentRef}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button onClick={() => updateBookingStatus(pending.id, 'Approved')} className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded transition-colors shadow">Authorize</button>
                      <button onClick={() => updateBookingStatus(pending.id, 'Declined')} className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded transition-colors shadow">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">📋 Allocation Registry Logs</h4>
            <div className="space-y-3 max-h-[400px] overflow-y-auto hide-scrollbar">
              {bookings.map((booking: any) => (
                <div key={booking.id} className={`p-4 rounded-xl border flex justify-between items-center ${booking.status === 'Approved' ? 'bg-emerald-50/50 border-emerald-100' : booking.status === 'Declined' ? 'bg-rose-50/50 border-rose-100' : 'bg-slate-50 border-slate-200'}`}>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{booking.memberName}</p>
                    <p className="text-xs text-slate-500 mt-1">Date: <strong className="text-slate-700">{booking.date} ({booking.slot})</strong></p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-widest border ${booking.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : booking.status === 'Declined' ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-amber-100 text-amber-700 border-amber-300'}`}>
                      {booking.status}
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono mt-1.5">{booking.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
