import Link from 'next/link';
import { Plus, Eye, Heart, MessageCircle, Clock, BookOpen, Search, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { PaginationComponent } from '@/components/pagination-component';
import { DeleteStoryButton } from '@/components/delete-story-button';

async function getStories(page: number = 1) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/stories?page=${page}&limit=10`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return { stories: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch stories:', error);
    return { stories: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
  }
}

export default async function CeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const { stories, pagination } = await getStories(currentPage);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-3 md:gap-4 flex-1">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen className="text-white" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-1 md:mb-2">Cerita</h1>
            <p className="text-sm md:text-base text-gray-600">Baca dan bagikan cerita inspiratif tentang pengalaman hidup remaja</p>
          </div>
        </div>
        <Link
          href="/dashboard/cerita/buat"
          className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium text-sm md:text-base whitespace-nowrap w-full md:w-auto justify-center"
        >
          <Plus size={18} />
          <span>Tulis Cerita</span>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen size={24} className="text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 mb-1">Total Cerita</p>
                <p className="text-2xl font-bold text-black">{stories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye size={24} className="text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 mb-1">Total Views</p>
                <p className="text-2xl font-bold text-black">
                  {stories.reduce((sum: number, story: any) => sum + story.viewCount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart size={24} className="text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 mb-1">Total Reactions</p>
                <p className="text-2xl font-bold text-black">
                  {stories.reduce((sum: number, story: any) => sum + (story._count?.reactions || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Section */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 w-full">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Cari cerita berdasarkan judul atau deskripsi..."
          className="outline-none text-sm flex-1"
        />
      </div>

      <Separator />

      {/* Stories List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-black">Semua Cerita</h2>
          <p className="text-sm text-gray-600">
            {pagination.total} cerita ditemukan
          </p>
        </div>

        {stories.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">Belum ada cerita</h3>
              <p className="text-gray-600 mb-6">Jadilah yang pertama membagikan cerita inspiratif</p>
              <Link
                href="/dashboard/cerita/buat"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
              >
                <Plus size={20} />
                <span>Tulis Cerita Pertama</span>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story: any) => (
              <Card key={story.id} className="h-full hover:shadow-lg transition-all overflow-hidden flex flex-col">
                  <Link href={`/cerita/${story.id}`} className="block">
                    {story.thumbnail && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={story.thumbnail}
                          alt={story.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                  </Link>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Link href={`/cerita/${story.id}`} className="flex-1 min-w-0">
                        <CardTitle className="line-clamp-2 hover:text-gray-600 transition">
                          {story.title}
                        </CardTitle>
                      </Link>
                      {story.isInteractive && (
                        <Badge className="bg-black text-white shrink-0">Interaktif</Badge>
                      )}
                    </div>
                    <Link href={`/cerita/${story.id}`}>
                      <CardDescription className="line-clamp-3">
                        {story.content.substring(0, 120)}...
                      </CardDescription>
                    </Link>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {story.tags && story.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {story.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <Eye size={16} />
                          <span>{story.viewCount}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Heart size={16} />
                          <span>{story._count?.reactions || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageCircle size={16} />
                          <span>{story._count?.comments || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {story.author.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate">
                          {story.author.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>
                            {formatDistanceToNow(new Date(story.createdAt), {
                              addSuffix: true,
                              locale: id,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <Link
                        href={`/dashboard/cerita/${story.id}/edit`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </Link>
                      <div className="flex-1">
                        <DeleteStoryButton storyId={story.id} />
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
            />
          </div>
        )}
      </div>
    </div>
  );
}
