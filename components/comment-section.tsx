'use client';

import { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  isAnonymous?: boolean;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

interface CommentSectionProps {
  storyId?: string;
  journalId?: string;
  comments: Comment[];
  currentUser: any;
}

export function CommentSection({ storyId, journalId, comments: initialComments, currentUser }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('Silakan login terlebih dahulu untuk berkomentar');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

    if (!newComment.trim()) {
      toast.error('Komentar tidak boleh kosong');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          storyId, 
          journalId,
          content: newComment,
          isAnonymous 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal mengirim komentar');
        return;
      }

      setComments([data.comment, ...comments]);
      setNewComment('');
      setIsAnonymous(false);
      toast.success('Komentar berhasil ditambahkan');
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <MessageCircle size={18} className="md:w-5 md:h-5" />
          <span>Komentar ({comments.length})</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Comment Form */}
        {currentUser ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              placeholder="Tulis komentar..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                />
                <label
                  htmlFor="anonymous"
                  className="text-sm text-gray-700 cursor-pointer select-none"
                >
                  Kirim sebagai Anonim
                </label>
              </div>
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium text-sm md:text-base disabled:opacity-50 min-h-[40px]"
              >
                <Send size={16} />
                <span>{loading ? 'Mengirim...' : 'Kirim'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm md:text-base text-gray-600">Silakan login untuk memberikan komentar</p>
          </div>
        )}

        <Separator />

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <MessageCircle size={32} className="mx-auto mb-2 text-gray-400" />
            <p>Belum ada komentar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const displayName = comment.isAnonymous ? 'Anonim' : comment.user.name;
              const displayInitial = comment.isAnonymous ? '?' : comment.user.name.charAt(0).toUpperCase();
              
              return (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {displayInitial}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-black">{displayName}</p>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: idLocale,
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
