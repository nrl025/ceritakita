import { Smile, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, format } from 'date-fns';
import { id } from 'date-fns/locale';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { MoodDashboard } from '@/components/mood-dashboard';

export const dynamic = 'force-dynamic';

const MOOD_DATA = {
  SENANG: {
    icon: '😊',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    description: 'Merasa gembira, penuh energi positif, dan bersemangat menghadapi hari',
  },
  SEDIH: {
    icon: '😢',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    description: 'Merasa down, kurang bersemangat, atau sedang mengalami kesedihan',
  },
  STRES: {
    icon: '☁️',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    description: 'Merasa tertekan, kewalahan dengan banyak hal, atau cemas berlebihan',
  },
  TENANG: {
    icon: '✨',
    color: 'bg-green-100 text-green-700 border-green-300',
    description: 'Merasa damai, rileks, dan nyaman dengan kondisi saat ini',
  },
  CEMAS: {
    icon: '😐',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    description: 'Merasa khawatir, gelisah, atau tidak tenang memikirkan sesuatu',
  },
  MARAH: {
    icon: '😠',
    color: 'bg-red-100 text-red-700 border-red-300',
    description: 'Merasa kesal, frustrasi, atau diperlakukan tidak adil',
  },
};

async function getMoods(userId: string) {
  try {
    const moods = await prisma.mood.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    return { moods };
  } catch (error) {
    console.error('Failed to fetch moods:', error);
    return { moods: [] };
  }
}

export default async function RiwayatMoodPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const data = await getMoods(user.id);

  // Jika user adalah guru, tampilkan dashboard mood siswa
  if (user.role === 'GURU') {
    return (
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex items-start gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
            <Smile className="text-white" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-1 md:mb-2">Dashboard Mood Siswa</h1>
            <p className="text-sm md:text-base text-gray-600">Pantau perkembangan emosional siswa dari waktu ke waktu</p>
          </div>
        </div>

        {/* Mood Dashboard */}
        <MoodDashboard />

        {/* Tips Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="text-2xl md:text-3xl flex-shrink-0">👨‍🏫</div>
              <div>
                <h3 className="font-bold text-black mb-2 text-sm md:text-base">Tips untuk Guru</h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Gunakan data mood siswa untuk memahami kondisi emosional kelas. Jika ada siswa yang 
                  konsisten menunjukkan mood negatif, pertimbangkan untuk melakukan pendekatan personal 
                  atau memberikan dukungan yang diperlukan.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Jika user adalah siswa, tampilkan riwayat mood pribadi
  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex items-start gap-3 md:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
          <Smile className="text-white" size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-1 md:mb-2">Riwayat Mood</h1>
          <p className="text-sm md:text-base text-gray-600">Pantau perkembangan emosionalmu dari waktu ke waktu</p>
        </div>
      </div>

      {/* Mood Stats */}
      {data.moods && data.moods.length > 0 && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-black">{data.moods.length}</p>
                <p className="text-xs md:text-sm text-gray-600">Total Catatan</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-black">
                  {format(new Date(data.moods[0].createdAt), 'd MMM', { locale: id })}
                </p>
                <p className="text-xs md:text-sm text-gray-600">Terakhir Dicatat</p>
              </div>
              <div className="text-center col-span-2 md:col-span-1">
                <p className="text-2xl md:text-3xl">
                  {MOOD_DATA[data.moods[0].type as keyof typeof MOOD_DATA].icon}
                </p>
                <p className="text-xs md:text-sm text-gray-600">Mood Terakhir</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mood List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Calendar size={20} />
            <span>Riwayat 30 Hari Terakhir</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!data.moods || data.moods.length === 0 ? (
            <div className="py-12 text-center">
              <Smile size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">Belum ada riwayat mood</p>
              <p className="text-sm text-gray-500">
                Mulai catat moodmu dari halaman Beranda
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.moods.map((mood: any) => {
                const moodData = MOOD_DATA[mood.type as keyof typeof MOOD_DATA];
                return (
                  <div
                    key={mood.id}
                    className="flex items-start gap-3 md:gap-4 p-4 md:p-5 border-2 border-gray-200 rounded-xl hover:shadow-lg transition bg-white"
                  >
                    {/* Date */}
                    <div className="text-center flex-shrink-0">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex flex-col items-center justify-center shadow-sm">
                        <p className="text-xl md:text-2xl font-bold text-black">
                          {format(new Date(mood.createdAt), 'd')}
                        </p>
                        <p className="text-xs text-gray-600">
                          {format(new Date(mood.createdAt), 'MMM', { locale: id })}
                        </p>
                      </div>
                    </div>

                    {/* Mood Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          className={`${moodData.color} border-2 text-sm font-semibold`}
                        >
                          <span className="mr-1.5 text-base">
                            {moodData.icon}
                          </span>
                          {mood.type.charAt(0) + mood.type.slice(1).toLowerCase()}
                        </Badge>
                        <span className="text-xs md:text-sm text-gray-500">
                          {formatDistanceToNow(new Date(mood.createdAt), {
                            addSuffix: true,
                            locale: id,
                          })}
                        </span>
                      </div>
                      
                      {/* Mood Description */}
                      <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-2">
                        {moodData.description}
                      </p>

                      {/* User Note */}
                      {mood.note && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300">
                          <p className="text-xs text-gray-500 mb-1 font-medium">Catatan:</p>
                          <p className="text-sm text-gray-700 leading-relaxed italic">
                            "{mood.note}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="text-2xl md:text-3xl flex-shrink-0">💡</div>
            <div>
              <h3 className="font-bold text-black mb-2 text-sm md:text-base">Tips Kesehatan Mental</h3>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                Mencatat mood secara rutin membantu kamu mengenali pola emosional dan 
                memahami pemicu perasaan tertentu. Jika kamu merasa mood negatif berlangsung 
                lama, jangan ragu untuk berbicara dengan orang yang kamu percaya.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
