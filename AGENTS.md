<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Context: Technology Club CMS

## Architecture & Stack
- **Framework:** Next.js (running on port `3001` via Docker to avoid port conflicts).
- **Database:** MongoDB Atlas (Cloud) connected via Prisma.
- **Storage:** MinIO Docker Container mimicking AWS S3 for local file uploads (running on port `9000`).
- **Styling:** Vanilla Tailwind CSS (No extra UI libraries).

## Current State (Phase 3 Completed)
- **Data Integration:** The frontend (`src/app/page.tsx`) successfully fetches live data from our Next.js API routes (`/api/club-data`, `/api/posts`, `/api/bookings`).
- **Media Handling:** Media files (images/videos) are uploaded to S3 via `/api/upload` (which returns a pre-signed URL). The MongoDB database stores the object keys (`mediaKey`, `photoKey`, `paymentScreenshotKey`) which are dynamically resolved to full URLs on the frontend using `getMediaUrl(key)` from `@/lib/client-utils.ts`.
- **Authentication:** Custom JWT-based session logic is implemented in `@/lib/auth.ts`. 
  - **Important:** Always use `import { getSession } from '@/lib/auth'` to verify backend routes.
  - The `ADMIN` role is required for editing club data, approving bookings, or deleting posts.
  - Regular members (no session required) are allowed to upload files (e.g. for booking screenshots) and create social feed posts.

## Legacy Reference
- The original design was a monolithic React file. This has been safely renamed to `technology_club_website_with_admin_cms_hall_booking.tsx.bak` to prevent TypeScript compilation errors. Do not delete this file; it serves as the master design reference.

## Next Steps / Future Work
- The CMS is currently fully functional. Any future work should build upon this modular API-driven Next.js structure.
