import Link from 'next/link';
import { Clock, Lock } from 'lucide-react';
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
import { CommentSection } from '@/components/comment-section';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getDiary(diaryId: string) {
  try {
    const journal = await prisma.journal.findUnique({
      where: { id: diaryId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
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
      return null;
    }

    const serializedJournal = {
      ...journal,
      createdAt: journal.createdAt.toISOString(),
      updatedAt: journal.updatedAt.toISOString(),
      comments: journal.comments.map(comment => ({
        ...comment,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
      })),
    };

    return { journal: serializedJournal };
  } catch (error) {
    console.error('Failed to fetch diary:', error);
    return null;
  }
}

export default async function DetailDiaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getDiary(id);
  const currentUser = await getCurrentUser();

  if (!data || !data.journal) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link href="/">Beranda</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link href="/diary">Diary</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tidak Ditemukan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardContent className="py-16 text-center">
            <h2 className="text-2xl font-bold text-black mb-2">Diary tidak ditemukan</h2>
            <p className="text-gray-600 mb-6">Diary yang Anda cari tidak tersedia</p>
            <Link href="/diary" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium">
              Kembali ke Diary
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { journal } = data;
  const canComment = journal.privacy !== 'PRIVATE';

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/">Beranda</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/diary">Diary</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[200px] truncate">{journal.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="overflow-hidden">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={journal.privacy === 'PUBLIC' ? 'default' : 'secondary'}>
                {journal.privacy === 'PUBLIC' ? 'Publik' : journal.privacy === 'PRIVATE' ? 'Pribadi' : 'Anonim'}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                {journal.author.role === 'GURU' ? '👨‍🏫 Guru' : '👨‍🎓 Siswa'}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-black leading-tight">{journal.title}</h1>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-lg font-medium">
                {journal.privacy === 'ANONYMOUS' ? '?' : journal.author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-black">
                  {journal.privacy === 'ANONYMOUS' ? 'Anonim' : journal.author.name}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={14} />
                  <span>
                    {formatDistanceToNow(new Date(journal.createdAt), {
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
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{journal.content}</p>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section - Only for non-private diary */}
      {canComment ? (
        <CommentSection
          journalId={id}
          comments={journal.comments || []}
          currentUser={currentUser}
        />
      ) : (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6 text-center">
            <Lock size={32} className="mx-auto mb-3 text-amber-600" />
            <h3 className="text-lg font-bold text-black mb-2">Diary Pribadi</h3>
            <p className="text-sm text-gray-700">
              Diary ini bersifat pribadi dan tidak dapat dikomentari.
              Mari kita hormati privasi penulis! 🙏
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
