import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { getCurrentUser } from '@/lib/auth';
import { ReactionButtons } from '@/components/reaction-buttons';
import { CommentSection } from '@/components/comment-section';

async function getStory(storyId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/stories/${storyId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch story:', error);
    return null;
  }
}

export default async function DetailCeritaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getStory(id);
  const currentUser = await getCurrentUser();

  if (!data || !data.story) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Beranda</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/cerita">Cerita</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tidak Ditemukan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardContent className="py-16 text-center">
            <h2 className="text-2xl font-bold text-black mb-2">Cerita tidak ditemukan</h2>
            <p className="text-gray-600 mb-6">Cerita yang Anda cari tidak tersedia</p>
            <Link
              href="/cerita"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
            >
              Kembali ke Cerita
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { story } = data;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Beranda</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/cerita">Cerita</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[200px] truncate">
              {story.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Story Card */}
      <Card className="overflow-hidden">
        {story.thumbnail && (
          <div className="aspect-video overflow-hidden">
            <img
              src={story.thumbnail}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <CardHeader>
          <div className="space-y-4">
            {/* Tags and Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              {story.privacy === 'PUBLIC' && (
                <Badge variant="default">Publik</Badge>
              )}
              {story.privacy === 'ANONYMOUS' && (
                <Badge variant="secondary">Anonim</Badge>
              )}
              {story.privacy === 'PRIVATE' && (
                <Badge variant="secondary">Pribadi</Badge>
              )}
              {story.isInteractive && (
                <Badge className="bg-black text-white">Interaktif</Badge>
              )}
              {story.tags && story.tags.length > 0 && (
                <>
                  {story.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-black leading-tight">
              {story.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-lg font-medium">
                {story.privacy === 'ANONYMOUS' ? '?' : story.author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-black">
                  {story.privacy === 'ANONYMOUS' ? 'Anonim' : story.author.name}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={14} />
                  <span>
                    {formatDistanceToNow(new Date(story.createdAt), {
                      addSuffix: true,
                      locale: idLocale,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          {/* Story Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {story.content}
            </p>
          </div>

          <Separator className="my-8" />

          {/* Reaction Buttons */}
          <ReactionButtons
            storyId={id}
            reactions={story.reactions || []}
            currentUserId={currentUser?.id}
          />
        </CardContent>
      </Card>

      {/* Comments Section */}
      <CommentSection
        storyId={id}
        comments={story.comments || []}
        currentUser={currentUser}
      />
    </div>
  );
}
