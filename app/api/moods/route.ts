import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '7');

    const moods = await prisma.mood.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ moods });
  } catch (error) {
    console.error('Get moods error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, note } = await req.json();

    if (!type) {
      return NextResponse.json(
        { error: 'Tipe mood wajib diisi' },
        { status: 400 }
      );
    }

    // Check if user already logged mood today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingMood = await prisma.mood.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: today,
        },
      },
    });

    if (existingMood) {
      // Update existing mood for today
      const updatedMood = await prisma.mood.update({
        where: { id: existingMood.id },
        data: { type, note },
      });

      return NextResponse.json({
        mood: updatedMood,
        message: 'Mood hari ini berhasil diperbarui',
      });
    }

    // Create new mood
    const mood = await prisma.mood.create({
      data: {
        type,
        note: note || null,
        userId: user.id,
      },
    });

    return NextResponse.json({
      mood,
      message: 'Mood berhasil dicatat',
    });
  } catch (error) {
    console.error('Create mood error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
