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
import { CommentSection } from '@/components/comment-section';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getJournal(journalId: string) {
  try {
    const journal = await prisma.journal.findUnique({
      where: { id: journalId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
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

    return { journal };
  } catch (error) {
    console.error('Failed to fetch journal:', error);
    return null;
  }
}

export default async function DetailJurnalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getJournal(id);
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
              <BreadcrumbLink asChild><Link href="/jurnal">Jurnal</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tidak Ditemukan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardContent className="py-16 text-center">
            <h2 className="text-2xl font-bold text-black mb-2">Jurnal tidak ditemukan</h2>
            <p className="text-gray-600 mb-6">Jurnal yang Anda cari tidak tersedia</p>
            <Link href="/jurnal" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium">
              Kembali ke Jurnal
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { journal } = data;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/">Beranda</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/jurnal">Jurnal</Link></BreadcrumbLink>
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

      {/* Comments Section */}
      <CommentSection
        journalId={id}
        comments={journal.comments || []}
        currentUser={currentUser}
      />
    </div>
  );
}
