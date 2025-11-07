import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const story = await prisma.story.findUnique({
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
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
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

    if (!story) {
      return NextResponse.json(
        { error: 'Cerita tidak ditemukan' },
        { status: 404 }
      );
    }

    await prisma.story.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ story }, { status: 200 });
  } catch (error) {
    console.error('Get story error:', error);
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
    const { title, content, thumbnail, tags, privacy, isInteractive } =
      await req.json();

    const existingStory = await prisma.story.findUnique({
      where: { id },
    });

    if (!existingStory) {
      return NextResponse.json(
        { error: 'Cerita tidak ditemukan' },
        { status: 404 }
      );
    }

    if (existingStory.authorId !== user.id && user.role !== 'GURU') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const story = await prisma.story.update({
      where: { id },
      data: {
        title,
        content,
        thumbnail,
        tags,
        privacy,
        isInteractive,
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

    return NextResponse.json(
      { story, message: 'Cerita berhasil diupdate' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update story error:', error);
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

    const existingStory = await prisma.story.findUnique({
      where: { id },
    });

    if (!existingStory) {
      return NextResponse.json(
        { error: 'Cerita tidak ditemukan' },
        { status: 404 }
      );
    }

    if (existingStory.authorId !== user.id && user.role !== 'GURU') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await prisma.story.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Cerita berhasil dihapus' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete story error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
