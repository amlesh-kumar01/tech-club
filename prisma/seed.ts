import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  // 1. Create Admin User
  const passwordHash = await bcrypt.hash('admin', 10);
  let admin = await prisma.user.findUnique({ where: { username: 'admin' } });
  if (admin) {
    admin = await prisma.user.update({
      where: { username: 'admin' },
      data: { passwordHash },
    });
  } else {
    admin = await prisma.user.create({
      data: {
        username: 'admin',
        passwordHash,
        role: 'ADMIN',
      },
    });
  }
  console.log('Admin user seeded. Username: admin, Password: admin');

  // 2. Create Default Club Data
  await prisma.clubData.deleteMany({});
  
  let clubData = await prisma.clubData.create({
      data: {
        heroTitleSanskrit: "प्रौद्योगिकी संघ",
        heroTitleEnglish: "Technology Club",
        aboutHeadline: "Celebrating Faculty Family & Culture",
        aboutText: "The Technology Club serves as the vibrant heart of social and cultural interaction for the faculty and their families at IIT Kharagpur. We host joyous gatherings spanning rich Indian cultural nights, delightful home-made food festivals where members prepare and sell authentic dishes, and engaging ladies and children's meets. From funny competitions to spirited sports and grand outdoor excursions, we nurture a warm, community-centric environment.",
        announcements: [
          { id: "1", text: "This Sunday: Special community outdoor family games and fun meets at the club lawn! All families welcome." },
          { id: "2", text: "Registrations are now open for the upcoming Ladies and Children's Meet funny competitions." }
        ],
        events: [
          { id: "1", title: "Grand Diwali Cultural Night", date: "November 12, 2026", location: "Faculty Banquet Hall", desc: "An evening of traditional Indian music, classical dance performances, and a lavish community feast." },
          { id: "2", title: "Annual Faculty Outdoor Picnic", date: "January 10, 2027", location: "Botanical Gardens", desc: "A full day of outdoor family entertainment, featuring sports, funny competitions, and delicious outdoor lunch." }
        ],
        galleryFrames: [
          { id: 'f1', mediaKey: 'https://images.unsplash.com/photo-1561414927-6d86591d0c4f?auto=format&fit=crop&w=600&q=80', caption: 'Holi Milan Festival of Colors' },
          { id: 'f2', mediaKey: 'https://images.unsplash.com/photo-1514222325250-86714a938cde?auto=format&fit=crop&w=600&q=80', caption: 'Grand Cultural Dance Night' },
          { id: 'f3', mediaKey: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80', caption: 'Traditional Instrumental & Choir Night' },
          { id: 'f4', mediaKey: 'https://images.unsplash.com/photo-1526815309951-8728d8b94098?auto=format&fit=crop&w=600&q=80', caption: 'Faculty Sports & Fun Competitions' },
          { id: 'f5', mediaKey: 'https://images.unsplash.com/photo-1512361436605-a484bfc56504?auto=format&fit=crop&w=600&q=80', caption: 'Diwali Lighting Ceremony' },
          { id: 'f6', mediaKey: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?auto=format&fit=crop&w=600&q=80', caption: 'Ladies Meet & Interaction' },
          { id: 'f7', mediaKey: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80', caption: 'Children\'s Day Celebration' }
        ],
        executives: [
          { id: 1, role: 'President', name: 'Prof. A. K. Sharma', photoKey: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80' },
          { id: 2, role: 'Secretary', name: 'Dr. Ramesh Sen', photoKey: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
          { id: 3, role: 'Treasurer', name: 'Prof. S. N. Gupta', photoKey: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80' },
          { id: 4, role: 'Vice President (Ladies)', name: 'Dr. Meera Das', photoKey: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
          { id: 5, role: 'Cultural Secretary (Ladies)', name: 'Prof. Anjali Verma', photoKey: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80' },
          { id: 6, role: 'Children Secretary', name: 'Mr. Vivek Kumar', photoKey: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
          { id: 7, role: 'Sports Secretary', name: 'Dr. P. R. Singh', photoKey: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' }
        ],
        qrCodeKey: 'qR_CODE.png'
      }
    });
    console.log('ClubData seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
