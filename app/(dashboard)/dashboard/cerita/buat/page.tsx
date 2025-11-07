'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function BuatCeritaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [privacy, setPrivacy] = useState('PUBLIC');
  const [isInteractive, setIsInteractive] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let thumbnailUrl = '';

      // Upload thumbnail jika ada
      if (thumbnail) {
        toast.loading('Mengupload thumbnail...');
        const formData = new FormData();
        formData.append('file', thumbnail);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();
        
        if (!uploadRes.ok) {
          toast.dismiss();
          toast.error('Gagal upload thumbnail');
          setLoading(false);
          return;
        }

        thumbnailUrl = uploadData.url;
        toast.dismiss();
      }

      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          thumbnail: thumbnailUrl,
          tags,
          privacy,
          isInteractive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal membuat cerita');
        return;
      }

      toast.success('Cerita berhasil dibuat!');
      router.push('/dashboard/cerita');
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
          href="/dashboard/cerita"
          className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-black">Tulis Cerita Baru</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Bagikan pengalaman dan inspirasimu</p>
        </div>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Informasi Cerita</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Thumbnail (Opsional)
              </label>
              {thumbnailPreview ? (
                <div className="relative">
                  <img
                    src={thumbnailPreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnail(null);
                      setThumbnailPreview('');
                    }}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 md:h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition">
                  <ImageIcon size={28} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Klik untuk upload thumbnail
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Judul Cerita
              </label>
              <Input
                type="text"
                placeholder="Masukkan judul cerita yang menarik..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-10 md:h-11"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Isi Cerita
              </label>
              <textarea
                placeholder="Tuliskan ceritamu di sini..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={10}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {content.length} karakter
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Tags
              </label>
              <Input
                type="text"
                placeholder="Ketik tag dan tekan Enter (contoh: Bullying, Persahabatan)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="h-10 md:h-11"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <X size={12} className="ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Pengaturan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-3">
                Privasi
              </label>
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="privacy"
                    value="PUBLIC"
                    checked={privacy === 'PUBLIC'}
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base text-black">Publik</p>
                    <p className="text-xs text-gray-600">
                      Semua orang dapat melihat cerita ini
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="privacy"
                    value="ANONYMOUS"
                    checked={privacy === 'ANONYMOUS'}
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base text-black">Anonim</p>
                    <p className="text-xs text-gray-600">
                      Identitas penulis disembunyikan
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="privacy"
                    value="PRIVATE"
                    checked={privacy === 'PRIVATE'}
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base text-black">Privat</p>
                    <p className="text-xs text-gray-600">
                      Hanya kamu yang dapat melihat cerita ini
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInteractive}
                  onChange={(e) => setIsInteractive(e.target.checked)}
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base text-black">Cerita Interaktif</p>
                  <p className="text-xs text-gray-600">
                    Tandai jika cerita ini memiliki pilihan atau interaksi
                  </p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="submit"
            disabled={loading || !title || !content}
            className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            <Plus size={18} />
            <span>{loading ? 'Menyimpan...' : 'Publikasikan Cerita'}</span>
          </button>
          <Link
            href="/dashboard/cerita"
            className="flex items-center justify-center px-4 md:px-6 py-3 md:py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium text-sm md:text-base min-h-[44px]"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
