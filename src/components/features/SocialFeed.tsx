'use client';
import React, { useState } from 'react';
import { getMediaUrl } from '@/lib/client-utils';
import { TrashIcon } from '../ui/Icons';

export default function SocialFeed({ feedPosts, isAdmin, createPost, deletePost, handleLike, handleAddComment, handleMediaUpload, newPostText, setNewPostText, newPostMedia, setNewPostMedia, newPostMediaType, setNewPostMediaType }: any) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <form onSubmit={createPost} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center font-bold text-white shadow-sm">
            {isAdmin ? 'AD' : 'FM'}
          </div>
          <textarea
            placeholder={isAdmin ? "Publish an official club announcement..." : "Share a lovely memory, fun event photo with the community..."}
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none h-20"
          />
        </div>

        {newPostMedia && (
          <div className="relative mt-3 rounded-xl overflow-hidden border border-emerald-100 bg-emerald-50 h-64">
            {newPostMediaType === 'image' ? (
              <img src={getMediaUrl(newPostMedia)} alt="Upload preview" className="w-full h-full object-cover" />
            ) : (
              <video src={getMediaUrl(newPostMedia)} controls className="w-full h-full object-cover" />
            )}
            <button type="button" onClick={() => setNewPostMedia(null)} className="absolute top-2 right-2 bg-white/90 text-red-600 p-2 rounded-full shadow-sm hover:bg-white z-10 transition-colors">
              ✖
            </button>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 transition-colors border border-slate-200">
              <span>📷 Photo</span>
              <input type="file" accept="image/*" onChange={(e) => { setNewPostMediaType('image'); handleMediaUpload(e, null, 'feed'); }} className="hidden" />
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 transition-colors border border-slate-200">
              <span>🎥 Video</span>
              <input type="file" accept="video/*" onChange={(e) => { setNewPostMediaType('video'); handleMediaUpload(e, null, 'feed'); }} className="hidden" />
            </label>
          </div>
          <button type="submit" disabled={!newPostText.trim() && !newPostMedia} className="px-4 py-1.5 bg-amber-600 text-white font-bold rounded-lg text-xs hover:bg-amber-700 disabled:opacity-50 transition-all">
            Publish Post 🚀
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {(Array.isArray(feedPosts) ? feedPosts : []).map((post: any) => (
          <div key={post.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm relative group">
            {isAdmin && (
              <button onClick={() => deletePost(post.id)} className="absolute right-4 top-4 text-rose-500 hover:text-rose-600 opacity-0 group-hover:opacity-100 z-10 bg-white/80 backdrop-blur p-1.5 rounded-full shadow-sm">
                <TrashIcon />
              </button>
            )}

            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-amber-600 text-sm">
                {post.author[0]}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{post.author}</h4>
                <span className="text-[11px] text-slate-500">{post.timestamp}</span>
              </div>
            </div>

            <div className="px-4 pb-3 text-sm text-slate-700 leading-relaxed">
              {post.text}
            </div>

            {post.mediaUrl && (
              <div className="mt-3 rounded-xl overflow-hidden border border-emerald-50 bg-emerald-50 shadow-inner">
                {post.mediaType === 'image' ? (
                  <img src={getMediaUrl(post.mediaUrl)} alt="Post attachment" className="w-full max-h-96 object-cover" />
                ) : (
                  <video src={getMediaUrl(post.mediaUrl)} controls className="w-full max-h-96 object-cover" />
                )}
              </div>
            )}

            <div className="px-4 py-2 bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
              <button onClick={() => handleLike(post.id)} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${post.likedByMe ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'hover:bg-slate-100 text-slate-600'}`}>
                👍 {post.likes} Likes
              </button>
              <span className="text-xs text-slate-500 font-semibold">{post.comments.length} Comments</span>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
              {post.comments.length > 0 && (
                <div className="space-y-2.5 max-h-48 overflow-y-auto hide-scrollbar">
                  {post.comments.map((comment: any, index: number) => (
                    <div key={index} className="bg-white border border-slate-200 p-2.5 rounded-lg text-xs shadow-sm">
                      <span className="font-bold text-slate-800 block mb-0.5">{comment.author}</span>
                      <span className="text-slate-600">{comment.text}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <form onSubmit={(e: any) => { e.preventDefault(); const field = e.target.elements.commentField; handleAddComment(post.id, field.value); field.value = ''; }} className="flex gap-2">
                <input name="commentField" type="text" placeholder="Write a comment..." className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500" />
                <button type="submit" className="px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors">Send</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
