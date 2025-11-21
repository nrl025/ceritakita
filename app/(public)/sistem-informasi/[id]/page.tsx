import Link from 'next/link';
import { Clock, Bell, User } from 'lucide-react';
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

async function getAnnouncement(announcementId: string) {
  try {
    const announcement = await prisma.announcement.findUnique({
      where: { id: announcementId },
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
          where: { parentId: null },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            replies: {
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
                createdAt: 'asc',
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!announcement) {
      return null;
    }

    const serializedAnnouncement = {
      ...announcement,
      createdAt: announcement.createdAt.toISOString(),
      updatedAt: announcement.updatedAt.toISOString(),
      comments: announcement.comments.map(comment => ({
        ...comment,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
        replies: comment.replies.map(reply => ({
          ...reply,
          createdAt: reply.createdAt.toISOString(),
          updatedAt: reply.updatedAt.toISOString(),
        })),
      })),
    };

    return { announcement: serializedAnnouncement };
  } catch (error) {
    console.error('Failed to fetch announcement:', error);
    return null;
  }
}

export default async function DetailSistemInformasiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getAnnouncement(id);
  const currentUser = await getCurrentUser();

  if (!data || !data.announcement) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link href="/">Beranda</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link href="/dashboard/sistem-informasi">Sistem Informasi</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tidak Ditemukan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardContent className="py-16 text-center">
            <h2 className="text-2xl font-bold text-black mb-2">Sistem informasi tidak ditemukan</h2>
            <p className="text-gray-600 mb-6">Informasi yang Anda cari tidak tersedia</p>
            <Link href="/dashboard/sistem-informasi" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium">
              Kembali ke Sistem Informasi
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { announcement } = data;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/">Beranda</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/dashboard/sistem-informasi">Sistem Informasi</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[200px] truncate">{announcement.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="overflow-hidden border-2 border-black">
        <CardHeader className="bg-gradient-to-r from-black to-gray-800">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-white text-black hover:bg-gray-100">
                <Bell size={12} className="mr-1" />
                Sistem Informasi
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">{announcement.title}</h1>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center text-lg font-medium">
                <User size={24} />
              </div>
              <div>
                <p className="font-medium text-white flex items-center gap-2">
                  {announcement.author.name}
                  <Badge variant="secondary" className="text-xs">Guru</Badge>
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Clock size={14} />
                  <span>
                    {formatDistanceToNow(new Date(announcement.createdAt), {
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
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{announcement.content}</p>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <CommentSection
        announcementId={id}
        comments={announcement.comments || []}
        currentUser={currentUser}
      />
    </div>
  );
}
