import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const privacy = searchParams.get('privacy');
    const authorId = searchParams.get('authorId');

    const skip = (page - 1) * limit;

    const where: any = {};

    // Filter by privacy
    if (privacy === 'PUBLIC') {
      where.privacy = 'PUBLIC';
    } else if (privacy) {
      where.privacy = privacy;
    } else {
      // Default: show PUBLIC only
      where.privacy = { not: 'PRIVATE' as const };
    }

    // Filter by author
    if (authorId) {
      where.authorId = authorId;
    }

    const [journals, total] = await Promise.all([
      prisma.journal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.journal.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      journals,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get journals error:', error);
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

    const { title, content, privacy } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Judul dan konten wajib diisi' },
        { status: 400 }
      );
    }

    const journal = await prisma.journal.create({
      data: {
        title,
        content,
        privacy: privacy || 'PRIVATE',
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
      { journal, message: 'Jurnal berhasil dibuat' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create journal error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
