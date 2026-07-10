import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteCloudinaryMedia(mediaUrl: string | null | undefined, resourceType: 'image' | 'video' = 'image') {
  if (!mediaUrl) return;
  
  const uploadIndex = mediaUrl.indexOf('/upload/');
  if (uploadIndex === -1) return;
  
  const afterUpload = mediaUrl.substring(uploadIndex + 8);
  const withoutVersion = afterUpload.replace(/^v\d+\//, '');
  const dotIndex = withoutVersion.lastIndexOf('.');
  const publicId = dotIndex !== -1 ? withoutVersion.substring(0, dotIndex) : withoutVersion;
  
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (e) {
    console.error("Failed to delete Cloudinary asset:", e);
  }
}

export default cloudinary;
