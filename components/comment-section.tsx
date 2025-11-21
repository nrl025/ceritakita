'use client';

import { useState } from 'react';
import { Send, MessageCircle, MoreHorizontal, Edit, Trash2, Reply, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  isAnonymous?: boolean;
  parentId?: string | null;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  replies?: Comment[];
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

      // Optimistic update: langsung update state tanpa refresh
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

  const handleReply = async (parentId: string) => {
    if (!currentUser) {
      toast.error('Silakan login terlebih dahulu');
      return;
    }

    if (!replyContent.trim()) {
      toast.error('Balasan tidak boleh kosong');
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
          content: replyContent,
          isAnonymous: false,
          parentId
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal mengirim balasan');
        return;
      }

      // Optimistic update: tambahkan reply ke state lokal
      setComments([...comments, data.comment]);
      setReplyContent('');
      setReplyingTo(null);
      toast.success('Balasan berhasil ditambahkan');
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) {
      toast.error('Komentar tidak boleh kosong');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal mengedit komentar');
        return;
      }

      // Optimistic update: update komentar di state lokal
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: editContent, updatedAt: new Date().toISOString() }
          : comment
      ));
      setEditingId(null);
      setEditContent('');
      toast.success('Komentar berhasil diupdate');
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/comments/${deletingId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal menghapus komentar');
        return;
      }

      // Optimistic update: hapus komentar dan replies-nya dari state lokal
      setComments(comments.filter(comment => 
        comment.id !== deletingId && comment.parentId !== deletingId
      ));
      setDeleteDialogOpen(false);
      setDeletingId(null);
      toast.success('Komentar berhasil dihapus');
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const canEdit = (comment: Comment) => {
    if (!currentUser) return false;
    // Hanya pemilik komentar yang bisa edit
    return comment.user.id === currentUser.id;
  };

  const canDelete = (comment: Comment) => {
    if (!currentUser) return false;
    // Pemilik komentar atau guru bisa hapus
    return comment.user.id === currentUser.id || currentUser.role === 'GURU';
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const startReply = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyContent('');
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyContent('');
  };

  const confirmDelete = (commentId: string) => {
    setDeletingId(commentId);
    setDeleteDialogOpen(true);
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
            {comments.filter(c => !c.parentId).map((comment) => {
              const displayName = comment.isAnonymous ? 'Anonim' : comment.user.name;
              const displayInitial = comment.isAnonymous ? '?' : comment.user.name.charAt(0).toUpperCase();
              const replies = comments.filter(c => c.parentId === comment.id);
              
              return (
                <div key={comment.id}>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {displayInitial}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-black">{displayName}</p>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                              locale: idLocale,
                            })}
                          </span>
                        </div>
                        {(canEdit(comment) || canDelete(comment)) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <MoreHorizontal size={16} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {canEdit(comment) && (
                                <DropdownMenuItem onClick={() => startEdit(comment)}>
                                  <Edit size={14} className="mr-2" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {canDelete(comment) && (
                                <DropdownMenuItem 
                                  onClick={() => confirmDelete(comment.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 size={14} className="mr-2" />
                                  Hapus
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>

                      {editingId === comment.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(comment.id)}
                              disabled={loading}
                              className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition text-sm disabled:opacity-50"
                            >
                              {loading ? 'Menyimpan...' : 'Simpan'}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition text-sm"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-700 leading-relaxed mb-2">{comment.content}</p>
                          {currentUser && (
                            <button
                              onClick={() => startReply(comment.id)}
                              className="flex items-center gap-1 text-xs text-gray-500 hover:text-black transition"
                            >
                              <Reply size={12} />
                              Balas
                            </button>
                          )}
                        </>
                      )}

                      {replyingTo === comment.id && (
                        <div className="mt-3 space-y-2">
                          <textarea
                            placeholder="Tulis balasan..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReply(comment.id)}
                              disabled={loading}
                              className="flex items-center gap-1 px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition text-sm disabled:opacity-50"
                            >
                              <Send size={12} />
                              {loading ? 'Mengirim...' : 'Kirim'}
                            </button>
                            <button
                              onClick={cancelReply}
                              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition text-sm"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {replies.length > 0 && (
                        <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-200">
                          {replies.map((reply) => {
                            const replyDisplayName = reply.isAnonymous ? 'Anonim' : reply.user.name;
                            const replyDisplayInitial = reply.isAnonymous ? '?' : reply.user.name.charAt(0).toUpperCase();
                            
                            return (
                              <div key={reply.id} className="flex gap-3">
                                <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                                  {replyDisplayInitial}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-medium text-black text-sm">{replyDisplayName}</p>
                                      <span className="text-xs text-gray-500">
                                        {formatDistanceToNow(new Date(reply.createdAt), {
                                          addSuffix: true,
                                          locale: idLocale,
                                        })}
                                      </span>
                                    </div>
                                    {(canEdit(reply) || canDelete(reply)) && (
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <button className="p-1 hover:bg-gray-100 rounded">
                                            <MoreHorizontal size={14} />
                                          </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          {canEdit(reply) && (
                                            <DropdownMenuItem onClick={() => startEdit(reply)}>
                                              <Edit size={12} className="mr-2" />
                                              Edit
                                            </DropdownMenuItem>
                                          )}
                                          {canDelete(reply) && (
                                            <DropdownMenuItem 
                                              onClick={() => confirmDelete(reply.id)}
                                              className="text-red-600"
                                            >
                                              <Trash2 size={12} className="mr-2" />
                                              Hapus
                                            </DropdownMenuItem>
                                          )}
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    )}
                                  </div>

                                  {editingId === reply.id ? (
                                    <div className="space-y-2">
                                      <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleEdit(reply.id)}
                                          disabled={loading}
                                          className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition text-xs disabled:opacity-50"
                                        >
                                          {loading ? 'Menyimpan...' : 'Simpan'}
                                        </button>
                                        <button
                                          onClick={cancelEdit}
                                          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition text-xs"
                                        >
                                          Batal
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-gray-700 leading-relaxed text-sm">{reply.content}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Komentar?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Komentar akan dihapus secara permanen dari database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingId(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
