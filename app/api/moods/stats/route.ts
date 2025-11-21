import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Hanya guru yang bisa akses mood statistics
    if (user.role !== 'GURU') {
      return NextResponse.json(
        { error: 'Akses ditolak. Hanya guru yang dapat melihat statistik mood.' },
        { status: 403 }
      );
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Get mood statistics
    const [todayMoods, last7DaysMoods, last30DaysMoods, allTimeMoods] = await Promise.all([
      // Today's moods
      prisma.mood.groupBy({
        by: ['type'],
        where: {
          createdAt: {
            gte: today,
          },
        },
        _count: {
          type: true,
        },
      }),
      // Last 7 days
      prisma.mood.groupBy({
        by: ['type'],
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
        _count: {
          type: true,
        },
      }),
      // Last 30 days
      prisma.mood.groupBy({
        by: ['type'],
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
        _count: {
          type: true,
        },
      }),
      // All time
      prisma.mood.groupBy({
        by: ['type'],
        _count: {
          type: true,
        },
      }),
    ]);

    // Get total students count
    const totalStudents = await prisma.user.count({
      where: { role: 'SISWA' },
    });

    // Get unique students who logged mood today
    const studentsLoggedToday = await prisma.mood.findMany({
      where: {
        createdAt: {
          gte: today,
        },
      },
      select: {
        userId: true,
      },
      distinct: ['userId'],
    });

    // Format data
    const formatMoodData = (moods: any[]) => {
      const moodMap: Record<string, number> = {
        SENANG: 0,
        SEDIH: 0,
        STRES: 0,
        TENANG: 0,
        CEMAS: 0,
        MARAH: 0,
      };

      moods.forEach((mood) => {
        moodMap[mood.type] = mood._count.type;
      });

      return moodMap;
    };

    return NextResponse.json(
      {
        today: formatMoodData(todayMoods),
        last7Days: formatMoodData(last7DaysMoods),
        last30Days: formatMoodData(last30DaysMoods),
        allTime: formatMoodData(allTimeMoods),
        stats: {
          totalStudents,
          studentsLoggedToday: studentsLoggedToday.length,
          participationRate: totalStudents > 0 
            ? Math.round((studentsLoggedToday.length / totalStudents) * 100) 
            : 0,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get mood stats error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
