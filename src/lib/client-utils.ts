export function getMediaUrl(key: string) {
  if (!key) return '';
  if (key.startsWith('http')) return key;
  const endpoint = process.env.NEXT_PUBLIC_S3_ENDPOINT || 'http://localhost:9000';
  const bucket = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'techclub-media';
  return `${endpoint}/${bucket}/${key}`;
}

export async function uploadFile(file: File) {
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, contentType: file.type })
    });
    
    if (!res.ok) throw new Error('Failed to get presigned URL');
    
    const { uploadUrl, key } = await res.json();
    
    // Upload directly to S3/MinIO
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file
    });
    
    if (!uploadRes.ok) throw new Error('Failed to upload file to S3');
    
    return key;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}
