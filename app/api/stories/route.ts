import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const tag = searchParams.get('tag');
    const sort = searchParams.get('sort') || 'latest';
    const privacy = searchParams.get('privacy');

    const skip = (page - 1) * limit;

    const where: any = {};

    // Filter by privacy
    if (privacy === 'PUBLIC') {
      where.privacy = 'PUBLIC';
    } else {
      // Default: show PUBLIC and ANONYMOUS
      where.privacy = { not: 'PRIVATE' as const };
    }

    if (tag) {
      where.tags = { has: tag };
    }

    const orderBy: any =
      sort === 'popular'
        ? { viewCount: 'desc' }
        : { createdAt: 'desc' };

    const [stories, total] = await Promise.all([
      prisma.story.findMany({
        where,
        skip,
        take: limit,
        orderBy,
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
      prisma.story.count({ where }),
    ]);

    return NextResponse.json(
      {
        stories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get stories error:', error);
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

    const { title, content, thumbnail, tags, privacy, isInteractive } =
      await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title dan content wajib diisi' },
        { status: 400 }
      );
    }

    const story = await prisma.story.create({
      data: {
        title,
        content,
        thumbnail,
        tags: tags || [],
        privacy: privacy || 'PUBLIC',
        isInteractive: isInteractive || false,
        authorId: user.id,
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
      { story, message: 'Cerita berhasil dibuat' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create story error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
