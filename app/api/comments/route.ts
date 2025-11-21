import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { storyId, journalId, announcementId, content, isAnonymous, parentId } = await req.json();

    if ((!storyId && !journalId && !announcementId) || !content) {
      return NextResponse.json(
        { error: 'StoryId, JournalId, atau AnnouncementId dan content wajib diisi' },
        { status: 400 }
      );
    }

    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment tidak ditemukan' },
          { status: 404 }
        );
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: user.id,
        storyId: storyId || null,
        journalId: journalId || null,
        announcementId: announcementId || null,
        isAnonymous: isAnonymous || false,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return NextResponse.json(
      { comment, message: 'Komentar berhasil ditambahkan' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Comment error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
