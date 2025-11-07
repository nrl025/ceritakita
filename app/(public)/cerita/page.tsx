import Link from 'next/link';
import { Eye, Heart, MessageCircle, Clock, Search, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { PaginationComponent } from '@/components/pagination-component';

async function getPublicStories(page: number = 1) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/stories?page=${page}&limit=12&privacy=PUBLIC`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return { stories: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } };
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch stories:', error);
    return { stories: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } };
  }
}

export default async function PublicCeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const { stories, pagination } = await getPublicStories(currentPage);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen size={40} className="text-black" />
          <h1 className="text-4xl font-bold text-black">Cerita</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Baca cerita inspiratif dari teman-teman yang berbagi pengalaman mereka
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Cari cerita berdasarkan judul atau deskripsi..."
            className="outline-none text-sm flex-1"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="text-center">
        <p className="text-gray-600">
          <span className="font-bold text-black">{pagination.total}</span> cerita tersedia
        </p>
      </div>

      {/* Stories Grid */}
      {stories.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold text-black mb-2">Belum ada cerita</h3>
          <p className="text-gray-600">Jadilah yang pertama berbagi cerita</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story: any) => (
              <Link key={story.id} href={`/cerita/${story.id}`}>
                <Card className="h-full hover:shadow-lg transition cursor-pointer overflow-hidden">
                  {story.thumbnail && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={story.thumbnail}
                        alt={story.title}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}
                  
                  <CardContent className="p-5 space-y-4">
                    {/* Tags */}
                    {story.tags && story.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {story.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-lg font-bold text-black line-clamp-2 hover:text-gray-700 transition">
                      {story.title}
                    </h3>

                    {/* Content Preview */}
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {story.content}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>{story.viewCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart size={14} />
                        <span>{story._count?.reactions || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={14} />
                        <span>{story._count?.comments || 0}</span>
                      </div>
                    </div>

                    {/* Author & Date */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {story.privacy === 'ANONYMOUS' ? '?' : story.author.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate">
                          {story.privacy === 'ANONYMOUS' ? 'Anonim' : story.author.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>
                            {formatDistanceToNow(new Date(story.createdAt), {
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

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-12">
              <PaginationComponent
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                basePath="/cerita"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
