import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { storyId, type } = await req.json();

    if (!storyId || !type) {
      return NextResponse.json(
        { error: 'StoryId dan type wajib diisi' },
        { status: 400 }
      );
    }

    const existingReaction = await prisma.reaction.findUnique({
      where: {
        userId_storyId_type: {
          userId: user.id,
          storyId,
          type,
        },
      },
    });

    if (existingReaction) {
      await prisma.reaction.delete({
        where: { id: existingReaction.id },
      });

      return NextResponse.json(
        { message: 'Reaksi dihapus' },
        { status: 200 }
      );
    }

    const reaction = await prisma.reaction.create({
      data: {
        type,
        userId: user.id,
        storyId,
      },
    });

    return NextResponse.json(
      { reaction, message: 'Reaksi berhasil ditambahkan' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Reaction error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
