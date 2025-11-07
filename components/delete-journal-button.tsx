'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function DeleteJournalButton({ journalId }: { journalId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus jurnal ini?')) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/journals/${journalId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal menghapus jurnal');
        return;
      }

      toast.success('Jurnal berhasil dihapus');
      router.push('/dashboard/jurnal');
      router.refresh();
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
    >
      <Trash2 size={14} />
      <span>{loading ? 'Menghapus...' : 'Hapus'}</span>
    </button>
  );
}
