import Link from 'next/link';
import { Clock, BookMarked, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { PaginationComponent } from '@/components/pagination-component';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getPublicDiaries(page: number = 1) {
  try {
    const limit = 12;
    const skip = (page - 1) * limit;

    const [journals, total] = await Promise.all([
      prisma.journal.findMany({
        where: { 
          OR: [
            { privacy: 'PUBLIC' },
            { privacy: 'ANONYMOUS' }
          ]
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      }),
      prisma.journal.count({
        where: { 
          OR: [
            { privacy: 'PUBLIC' },
            { privacy: 'ANONYMOUS' }
          ]
        },
      }),
    ]);

    const serializedJournals = journals.map(journal => ({
      ...journal,
      createdAt: journal.createdAt.toISOString(),
      updatedAt: journal.updatedAt.toISOString(),
    }));

    return {
      journals: serializedJournals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    console.error('Failed to fetch diaries:', error);
    return { journals: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } };
  }
}

export default async function PublicDiaryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const { journals, pagination } = await getPublicDiaries(currentPage);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookMarked size={40} className="text-black" />
          <h1 className="text-4xl font-bold text-black">Diary</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Baca catatan harian dari guru dan teman-teman yang berbagi perjalanan hidupnya
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
          <Search size={20} className="text-gray-400" />
          <input type="text" placeholder="Cari diary..." className="outline-none text-sm flex-1" />
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-600">
          <span className="font-bold text-black">{pagination.total}</span> diary tersedia
        </p>
      </div>

      {journals.length === 0 ? (
        <div className="text-center py-16">
          <BookMarked size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold text-black mb-2">Belum ada diary publik</h3>
          <p className="text-gray-600">Jadilah yang pertama berbagi catatan harian</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journals.map((journal: any) => (
              <Link key={journal.id} href={`/diary/${journal.id}`}>
                <Card className="h-full hover:shadow-lg transition cursor-pointer overflow-hidden">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {journal.privacy === 'ANONYMOUS' ? 'Anonim' : 'Publik'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {journal.author.role === 'GURU' ? '👨‍🏫 Guru' : '👨‍🎓 Siswa'}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-black line-clamp-2 hover:text-gray-700 transition">
                      {journal.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-4">
                      {journal.content}
                    </p>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {journal.privacy === 'ANONYMOUS' ? '?' : journal.author.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate">
                          {journal.privacy === 'ANONYMOUS' ? 'Anonim' : journal.author.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>
                            {formatDistanceToNow(new Date(journal.createdAt), {
                              addSuffix: true,
                              locale: idLocale,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-12">
              <PaginationComponent
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                basePath="/diary"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
