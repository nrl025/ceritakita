import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  BookMarked, 
  TrendingUp, 
  Users,
  Clock,
  Heart,
  MessageCircle,
  Plus,
  Sparkles
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { MoodTracker } from '@/components/mood-tracker';

export const dynamic = 'force-dynamic';

async function getDashboardData(userId: string) {
  try {
    // Fetch data directly from database instead of API routes
    const [myStories, myJournals, recentStories, moods] = await Promise.all([
      prisma.story.findMany({
        where: { authorId: userId },
        include: {
          _count: {
            select: {
              reactions: true,
              comments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.journal.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.story.findMany({
        where: {
          privacy: { not: 'PRIVATE' as const },
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              reactions: true,
              comments: true,
            },
          },
        },
      }),
      prisma.mood.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 7,
      }),
    ]);

    // Serialize dates
    const serializedMyStories = myStories.map(story => ({
      ...story,
      createdAt: story.createdAt.toISOString(),
      updatedAt: story.updatedAt.toISOString(),
    }));

    const serializedRecentStories = recentStories.map(story => ({
      ...story,
      createdAt: story.createdAt.toISOString(),
      updatedAt: story.updatedAt.toISOString(),
    }));

    const serializedMoods = moods.map(mood => ({
      ...mood,
      createdAt: mood.createdAt.toISOString(),
    }));

    return {
      myStoriesCount: myStories.length,
      myJournalsCount: myJournals.length,
      myStories: serializedMyStories,
      recentStories: serializedRecentStories,
      moods: serializedMoods,
    };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return {
      myStoriesCount: 0,
      myJournalsCount: 0,
      myStories: [],
      recentStories: [],
      moods: [],
    };
  }
}

export default async function BerandaPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  const data = await getDashboardData(user.id);

  const totalReactions = data.myStories.reduce((sum: number, story: any) => 
    sum + (story._count?.reactions || 0), 0
  );
  
  const totalComments = data.myStories.reduce((sum: number, story: any) => 
    sum + (story._count?.comments || 0), 0
  );

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl md:rounded-2xl p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-gray-300 text-sm md:text-base mb-2">{greeting()},</p>
            <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3">{user?.name}!</h1>
            <p className="text-gray-300 text-sm md:text-lg">
              {user?.role === 'GURU'
                ? 'Selamat datang di dashboard guru. Pantau dan kelola aktivitas siswa.'
                : 'Yuk bagikan cerita dan refleksi harianmu hari ini! 🌟'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl shrink-0">
            <p className="text-xs md:text-sm text-gray-300">Role</p>
            <p className="text-lg md:text-xl font-bold">{user?.role === 'GURU' ? 'Guru' : 'Siswa'}</p>
          </div>
        </div>
      </div>

      {/* Mood Tracker - Only for Students */}
      {user?.role === 'SISWA' && (
        <MoodTracker />
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Cerita Saya</p>
                <p className="text-3xl font-bold text-black">{data.myStoriesCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Jurnal Saya</p>
                <p className="text-3xl font-bold text-black">{data.myJournalsCount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BookMarked size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reaksi</p>
                <p className="text-3xl font-bold text-black">{totalReactions}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <Heart size={24} className="text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Komentar</p>
                <p className="text-3xl font-bold text-black">{totalComments}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MessageCircle size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className={`grid grid-cols-1 ${user?.role === 'GURU' ? 'md:grid-cols-2' : ''} gap-4`}>
        <Link href="/dashboard/cerita/buat">
          <Card className="hover:shadow-lg transition cursor-pointer border-2 hover:border-black">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <Plus className="text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black mb-1">Tulis Cerita Baru</h3>
                  <p className="text-sm text-gray-600">Bagikan pengalaman dan ceritamu</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {user?.role === 'GURU' && (
          <Link href="/dashboard/jurnal/buat">
            <Card className="hover:shadow-lg transition cursor-pointer border-2 hover:border-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookMarked className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black mb-1">Tulis Jurnal Harian</h3>
                    <p className="text-sm text-gray-600">Refleksikan hari dan perasaanmu</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      {/* Recent Stories Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-black">Cerita Terbaru dari Komunitas</h2>
            <p className="text-gray-600 mt-1">Jelajahi cerita inspiratif dari teman-teman</p>
          </div>
          <Link
            href="/cerita"
            className="flex items-center gap-2 text-black hover:text-gray-600 transition font-medium"
          >
            Lihat Semua
            <TrendingUp size={18} />
          </Link>
        </div>

        {data.recentStories.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Belum ada cerita terbaru</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.recentStories.map((story: any) => (
              <Link key={story.id} href={`/cerita/${story.id}`}>
                <Card className="h-full hover:shadow-lg transition cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-2">{story.title}</CardTitle>
                      {story.isInteractive && (
                        <Badge className="bg-black text-white shrink-0">
                          <Sparkles size={12} className="mr-1" />
                          Interaktif
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {story.content.substring(0, 100)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {story.privacy === 'ANONYMOUS' ? '?' : story.author.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-black">
                          {story.privacy === 'ANONYMOUS' ? 'Anonim' : story.author.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Heart size={14} />
                          <span>{story._count?.reactions || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={14} />
                          <span>{story._count?.comments || 0}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Tips & Motivation */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-black mb-2">Tips Hari Ini</h3>
              <p className="text-gray-700 leading-relaxed">
                Menulis jurnal setiap hari dapat membantu mengurangi stres dan meningkatkan kesehatan mental. 
                Luangkan 10 menit hari ini untuk merefleksikan perasaan dan pengalamanmu! 💭
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
