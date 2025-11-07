import Link from 'next/link';
import { Plus, Eye, Clock, BookMarked, Search, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { PaginationComponent } from '@/components/pagination-component';
import { getCurrentUser } from '@/lib/auth';
import { DeleteJournalButton } from '@/components/delete-journal-button';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getJournals(page: number = 1, authorId?: string) {
  try {
    const limit = 10;
    const skip = (page - 1) * limit;

    const where = authorId ? { authorId } : { privacy: { not: 'PRIVATE' as const } };

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

    return {
      journals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Failed to fetch journals:', error);
    return { journals: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
  }
}

export default async function JurnalPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const currentUser = await getCurrentUser();
  const { journals, pagination } = await getJournals(currentPage, currentUser?.id);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-3 md:gap-4 flex-1">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
            <BookMarked className="text-white" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-1 md:mb-2">Jurnal</h1>
            <p className="text-sm md:text-base text-gray-600">Tulis dan kelola jurnal pribadi untuk refleksi diri</p>
          </div>
        </div>
        <Link
          href="/dashboard/jurnal/buat"
          className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium text-sm md:text-base whitespace-nowrap w-full md:w-auto justify-center"
        >
          <Plus size={18} />
          <span>Tulis Jurnal</span>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookMarked size={24} className="text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 mb-1">Total Jurnal</p>
                <p className="text-2xl font-bold text-black">{pagination.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock size={24} className="text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 mb-1">Jurnal Bulan Ini</p>
                <p className="text-2xl font-bold text-black">
                  {journals.filter((j: any) => {
                    const journalDate = new Date(j.createdAt);
                    const now = new Date();
                    return journalDate.getMonth() === now.getMonth() && 
                           journalDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 w-full">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Cari jurnal berdasarkan judul atau konten..."
          className="outline-none text-sm flex-1"
        />
      </div>

      <Separator />

      {/* Journals List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-black">Jurnal Saya</h2>
          <p className="text-sm text-gray-600">
            {pagination.total} jurnal
          </p>
        </div>

        {journals.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <BookMarked size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-bold text-black mb-2">Belum ada jurnal</h3>
              <p className="text-gray-600 mb-6">Mulai menulis jurnal untuk refleksi pribadi</p>
              <Link
                href="/dashboard/jurnal/buat"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
              >
                <Plus size={20} />
                <span>Tulis Jurnal Pertama</span>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {journals.map((journal: any) => (
              <Card key={journal.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <Link href={`/jurnal/${journal.id}`} className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="line-clamp-1 hover:text-gray-600 transition">
                          {journal.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {journal.content.substring(0, 150)}...
                      </CardDescription>
                    </Link>
                    <Badge variant={journal.privacy === 'PUBLIC' ? 'default' : 'secondary'} className="shrink-0">
                      {journal.privacy === 'PUBLIC' ? 'Publik' : journal.privacy === 'PRIVATE' ? 'Pribadi' : 'Anonim'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} />
                    <span>
                      {formatDistanceToNow(new Date(journal.createdAt), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <Link
                      href={`/dashboard/jurnal/${journal.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </Link>
                    <div className="flex-1">
                      <DeleteJournalButton journalId={journal.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8">
            <PaginationComponent
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              basePath="/dashboard/jurnal"
            />
          </div>
        )}
      </div>
    </div>
  );
}
