# Technology Club - IIT Kharagpur

A minimalistic, modern CMS and Community Portal built for the Technology Club at IIT Kharagpur.

## Features
- **Admin Dashboard**: Manage website content, announcements, and events easily.
- **Facility Booking**: Members can book spaces with admin approval workflows.
- **Social Feed**: A community timeline for posts and interactions.
- **Cultural Memory Board**: An interactive image gallery.
- **Document Hub**: Centralized repository for official PDF forms and rules.

## Technology Stack
- **Frontend**: [Next.js](https://nextjs.org/) (App Router), React, Tailwind CSS
- **Database**: MongoDB Atlas via Prisma ORM
- **Media**: Cloudinary (Direct client-side uploads)
- **Authentication**: Firebase Auth (Google Sign-In)

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file with your credentials:
   ```env
   DATABASE_URL="..."
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
   NEXT_PUBLIC_CLOUDINARY_API_KEY="..."
   CLOUDINARY_API_SECRET="..."
   NEXT_PUBLIC_FIREBASE_API_KEY="..."
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
   ```

3. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Server**
   ```bash
   npm run dev
   ```
