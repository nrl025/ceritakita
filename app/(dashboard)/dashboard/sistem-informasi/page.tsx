import Link from 'next/link';
import { Plus, Clock, Bell, Search, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { PaginationComponent } from '@/components/pagination-component';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getAnnouncements(page: number = 1) {
  try {
    const limit = 10;
    const skip = (page - 1) * limit;

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
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
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      prisma.announcement.count(),
    ]);

    const serializedAnnouncements = announcements.map(announcement => ({
      ...announcement,
      createdAt: announcement.createdAt.toISOString(),
      updatedAt: announcement.updatedAt.toISOString(),
    }));

    return {
      announcements: serializedAnnouncements,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    return { announcements: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
  }
}

export default async function SistemInformasiPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    redirect('/login');
  }
  
  const { announcements, pagination } = await getAnnouncements(currentPage);
  const isTeacher = currentUser.role === 'GURU';

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-3 md:gap-4 flex-1">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
            <Bell className="text-white" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-1 md:mb-2">
              Sistem Informasi
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {isTeacher 
                ? 'Kelola informasi penting untuk siswa' 
                : 'Lihat informasi penting dari guru'}
            </p>
          </div>
        </div>
        {isTeacher && (
          <Link
            href="/dashboard/sistem-informasi/buat"
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium text-sm md:text-base whitespace-nowrap w-full md:w-auto justify-center"
          >
            <Plus size={18} />
            <span>Buat Informasi</span>
          </Link>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bell size={24} className="text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 mb-1">Total Informasi</p>
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
                <p className="text-sm text-gray-600 mb-1">Bulan Ini</p>
                <p className="text-2xl font-bold text-black">
                  {announcements.filter((a: any) => {
                    const announcementDate = new Date(a.createdAt);
                    const now = new Date();
                    return announcementDate.getMonth() === now.getMonth() && 
                           announcementDate.getFullYear() === now.getFullYear();
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
          placeholder="Cari informasi..."
          className="outline-none text-sm flex-1"
        />
      </div>

      <Separator />

      {/* Announcements List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-black">
            Daftar Informasi
          </h2>
          <p className="text-sm text-gray-600">
            {pagination.total} informasi
          </p>
        </div>

        {announcements.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Bell size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-bold text-black mb-2">
                Belum ada informasi
              </h3>
              <p className="text-gray-600 mb-6">
                {isTeacher 
                  ? 'Mulai buat informasi penting untuk siswa' 
                  : 'Belum ada informasi dari guru'}
              </p>
              {isTeacher && (
                <Link
                  href="/dashboard/sistem-informasi/buat"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
                >
                  <Plus size={20} />
                  <span>Buat Informasi Pertama</span>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement: any) => (
              <Card key={announcement.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <Link href={`/sistem-informasi/${announcement.id}`} className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-black text-white shrink-0">
                          <Bell size={12} className="mr-1" />
                          Informasi
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-1 hover:text-gray-600 transition">
                        {announcement.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-2">
                        {announcement.content.substring(0, 150)}...
                      </CardDescription>
                    </Link>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {announcement.author.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-black">{announcement.author.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>
                          {formatDistanceToNow(new Date(announcement.createdAt), {
                            addSuffix: true,
                            locale: id,
                          })}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {announcement._count?.comments || 0} Komentar
                    </Badge>
                  </div>

                  {/* Action Buttons - Only for teachers */}
                  {isTeacher && announcement.authorId === currentUser.id && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <Link
                        href={`/dashboard/sistem-informasi/${announcement.id}/edit`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </Link>
                      <button
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
                      >
                        <Trash2 size={14} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  )}
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
              basePath="/dashboard/sistem-informasi"
            />
          </div>
        )}
      </div>
    </div>
  );
}
