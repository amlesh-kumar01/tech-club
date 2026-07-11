'use client';
import React from 'react';
import { getMediaUrl } from '@/lib/client-utils';
export default function FormsAndRules({
  clubData, isAdmin, updateCMSField, handleMediaUpload, triggerFeedback
}: any) {
  
  const forms = clubData?.formsAndRules || [];

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      triggerFeedback('error', 'Only PDF files are allowed for Forms & Rules.');
      return;
    }

    const caption = prompt('Enter a title/caption for this PDF Document:', 'New Document');
    if (!caption) return; // User cancelled

    triggerFeedback('success', 'Uploading document...');
    // In page.tsx handleMediaUpload expects (e, index, field) 
    // Wait, handleMediaUpload is specific to arrays? 
    // We will just do the upload directly here to avoid page.tsx tightly coupled array logic, or use it if applicable.
    // Actually, page.tsx `handleMediaUpload` is used for galleryFrames and executives. 
    // For a cleaner approach, let's just trigger a custom event or do it here. 
    // Since we don't have access to uploadFile directly unless we import it:
    
    try {
      const { uploadFile } = await import('@/lib/client-utils');
      const url = await uploadFile(file);
      if (url) {
        const newForm = { id: Date.now().toString(), caption, mediaUrl: url };
        const updatedForms = [...forms, newForm];
        await updateCMSField('formsAndRules', updatedForms);
        triggerFeedback('success', 'Document uploaded successfully!');
      } else {
        triggerFeedback('error', 'Failed to upload document.');
      }
    } catch (err) {
      console.error(err);
      triggerFeedback('error', 'Upload error.');
    }
  };

  const deleteDocument = (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    const updatedForms = forms.filter((f: any) => f.id !== id);
    updateCMSField('formsAndRules', updatedForms);
    triggerFeedback('success', 'Document deleted.');
  };

  const getThumbnailUrl = (url: string | undefined | null) => {
    if (!url) return '';
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex !== -1) {
      return url.substring(0, uploadIndex + 8) + 'w_400,f_jpg,q_auto/' + url.substring(uploadIndex + 8);
    }
    return url;
  };

  const getDownloadUrl = (url: string | undefined | null) => {
    if (!url) return '';
    return url;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fadeIn">
      
      <div className="bg-white border border-indigo-100 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="max-w-2xl">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-3">
            Official Documents
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2 font-english">Forms & Rules</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Download the required forms and review the official rules, regulations, and IT compliance guidelines of the Technology Club.
          </p>
        </div>

        {isAdmin && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex flex-col items-center justify-center min-w-[200px]">
            <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              Upload PDF Form
              <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
            </label>
            <p className="text-[10px] text-emerald-700 mt-2 font-semibold uppercase tracking-wider">Admin Action</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 font-medium bg-white rounded-2xl border border-slate-100">
            No documents have been uploaded yet.
          </div>
        )}
        
        {forms.map((doc: any) => (
          <div key={doc.id} className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all flex flex-col group relative overflow-hidden">
            <div className="w-full h-40 bg-slate-200 rounded-xl overflow-hidden mb-3 relative group-hover:opacity-95 transition-opacity border border-slate-300 shadow-inner">
              <img 
                src={getThumbnailUrl(getMediaUrl(doc.mediaUrl))} 
                alt={doc.caption} 
                className="w-full h-full object-cover object-top mix-blend-multiply" 
              />

            </div>
            
            <div className="px-1 flex-1 flex flex-col justify-between">
              <h4 className="text-sm font-bold text-slate-800 leading-snug mb-3 line-clamp-2">{doc.caption}</h4>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <a 
                  href={getDownloadUrl(getMediaUrl(doc.mediaUrl))} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Download Form
                </a>
                
                {isAdmin && (
                  <button 
                    onClick={() => deleteDocument(doc.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                    title="Delete Document"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
