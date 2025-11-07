import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const journal = await prisma.journal.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        comments: {
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
            createdAt: 'desc',
          },
        },
      },
    });

    if (!journal) {
      return NextResponse.json(
        { error: 'Jurnal tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ journal });
  } catch (error) {
    console.error('Get journal error:', error);
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

    const { id } = await params;
    const { title, content, privacy } = await req.json();

    // Check if journal exists and user owns it
    const existingJournal = await prisma.journal.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existingJournal) {
      return NextResponse.json(
        { error: 'Jurnal tidak ditemukan' },
        { status: 404 }
      );
    }

    if (existingJournal.authorId !== user.id && user.role !== 'GURU') {
      return NextResponse.json(
        { error: 'Anda tidak memiliki akses untuk mengedit jurnal ini' },
        { status: 403 }
      );
    }

    const journal = await prisma.journal.update({
      where: { id },
      data: {
        title,
        content,
        privacy,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({
      journal,
      message: 'Jurnal berhasil diperbarui',
    });
  } catch (error) {
    console.error('Update journal error:', error);
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

    const { id } = await params;

    // Check if journal exists and user owns it
    const existingJournal = await prisma.journal.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existingJournal) {
      return NextResponse.json(
        { error: 'Jurnal tidak ditemukan' },
        { status: 404 }
      );
    }

    if (existingJournal.authorId !== user.id && user.role !== 'GURU') {
      return NextResponse.json(
        { error: 'Anda tidak memiliki akses untuk menghapus jurnal ini' },
        { status: 403 }
      );
    }

    await prisma.journal.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Jurnal berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete journal error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
