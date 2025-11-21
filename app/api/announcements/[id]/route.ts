import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
        comments: {
          where: { parentId: null },
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
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!announcement) {
      return NextResponse.json(
        { error: 'Sistem informasi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ announcement });
  } catch (error) {
    console.error('Get announcement error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Hanya guru yang bisa edit
    if (user.role !== 'GURU') {
      return NextResponse.json(
        { error: 'Hanya guru yang dapat mengedit sistem informasi' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { title, content } = await req.json();

    // Check if announcement exists and user owns it
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existingAnnouncement) {
      return NextResponse.json(
        { error: 'Sistem informasi tidak ditemukan' },
        { status: 404 }
      );
    }

    if (existingAnnouncement.authorId !== user.id) {
      return NextResponse.json(
        { error: 'Anda tidak memiliki akses untuk mengedit sistem informasi ini' },
        { status: 403 }
      );
    }

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        content,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      announcement,
      message: 'Sistem informasi berhasil diperbarui',
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Hanya guru yang bisa delete
    if (user.role !== 'GURU') {
      return NextResponse.json(
        { error: 'Hanya guru yang dapat menghapus sistem informasi' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Check if announcement exists and user owns it
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existingAnnouncement) {
      return NextResponse.json(
        { error: 'Sistem informasi tidak ditemukan' },
        { status: 404 }
      );
    }

    if (existingAnnouncement.authorId !== user.id) {
      return NextResponse.json(
        { error: 'Anda tidak memiliki akses untuk menghapus sistem informasi ini' },
        { status: 403 }
      );
    }

    await prisma.announcement.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Sistem informasi berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete announcement error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
