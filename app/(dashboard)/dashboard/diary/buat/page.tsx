'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

export default function BuatDiaryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    privacy: 'PRIVATE',
  });

  useEffect(() => {
    // Check if user is student
    const checkRole = async () => {
      try {
        const res = await fetch('/api/user/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user.role !== 'SISWA') {
            router.push('/dashboard/diary');
            return;
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setChecking(false);
      }
    };

    checkRole();
  }, [router]);

  if (checking) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Judul dan konten wajib diisi');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal membuat diary');
        return;
      }

      toast.success('Diary berhasil dibuat!');
      router.push('/dashboard/diary');
      router.refresh();
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center gap-3 md:gap-4">
        <Link
          href="/dashboard/diary"
          className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-black">Tulis Diary Baru</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Tuangkan pikiran dan perasaanmu hari ini</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Detail Diary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Judul */}
            <div className="space-y-2">
              <Label htmlFor="title">Judul Diary</Label>
              <Input
                id="title"
                placeholder="Judul catatan harian..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Konten */}
            <div className="space-y-2">
              <Label htmlFor="content">Isi Diary</Label>
              <Textarea
                id="content"
                placeholder="Tulis refleksi dan perasaanmu di sini..."
                rows={15}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                className="resize-none"
              />
            </div>

            {/* Privacy */}
            <div className="space-y-3">
              <Label>Privasi</Label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <p className="text-xs text-blue-800">
                  💡 <strong>Info:</strong> Pilih <strong>Publik</strong> atau <strong>Anonim</strong> jika ingin diary dapat dilihat oleh guru untuk bimbingan.
                </p>
              </div>
              <RadioGroup
                value={formData.privacy}
                onValueChange={(value) => setFormData({ ...formData, privacy: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PRIVATE" id="private" />
                  <Label htmlFor="private" className="font-normal cursor-pointer">
                    Pribadi - Hanya saya yang bisa melihat
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ANONYMOUS" id="anonymous" />
                  <Label htmlFor="anonymous" className="font-normal cursor-pointer">
                    Anonim - Guru dapat melihat tapi nama saya disembunyikan (Recommended)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PUBLIC" id="public" />
                  <Label htmlFor="public" className="font-normal cursor-pointer">
                    Publik - Semua orang bisa melihat dengan nama saya
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <Link
            href="/dashboard/diary"
            className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50"
          >
            <Save size={18} />
            <span>{loading ? 'Menyimpan...' : 'Simpan Diary'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
