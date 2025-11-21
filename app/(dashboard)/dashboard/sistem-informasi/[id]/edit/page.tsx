'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Save } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function EditSistemInformasiPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
      fetchAnnouncement(resolvedParams.id);
    });
  }, [params]);

  const fetchAnnouncement = async (announcementId: string) => {
    try {
      const res = await fetch(`/api/announcements/${announcementId}`);
      const data = await res.json();

      if (!res.ok) {
        toast.error('Sistem informasi tidak ditemukan');
        router.push('/dashboard/sistem-informasi');
        return;
      }

      setTitle(data.announcement.title);
      setContent(data.announcement.content);
    } catch {
      toast.error('Gagal memuat data');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('Judul dan konten wajib diisi');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal mengupdate sistem informasi');
        return;
      }

      toast.success('Sistem informasi berhasil diupdate!');
      router.push('/dashboard/sistem-informasi');
      router.refresh();
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard/sistem-informasi"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition text-sm"
      >
        <ArrowLeft size={16} />
        <span>Kembali</span>
      </Link>

      {/* Header */}
      <div className="flex items-start gap-3 md:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
          <Bell className="text-white" size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-1 md:mb-2">
            Edit Sistem Informasi
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Perbarui informasi yang sudah ada
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Detail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Judul <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Jadwal Ujian Semester Genap"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Isi Informasi <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tulis informasi lengkap di sini..."
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimal 10 karakter
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50"
          >
            <Save size={18} />
            <span>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
          <Link
            href="/dashboard/sistem-informasi"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
