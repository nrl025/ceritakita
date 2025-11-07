import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { BookOpen, Users, Heart, Shield, MessageCircle, TrendingUp, BookMarked, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-bold text-black mb-6 leading-tight">
              Ruang Aman untuk
              <br />
              <span className="relative">
                Cerita Kita
                <svg
                  className="absolute -bottom-2 left-0 right-0 mx-auto"
                  width="100%"
                  height="8"
                  viewBox="0 0 300 8"
                  fill="none"
                >
                  <path
                    d="M2 6C100 2 200 2 298 6"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Platform berbagi cerita dan curhat anonim untuk remaja.
              Bersama guru dan teman, kita saling memahami dan mendukung.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium text-lg"
              >
                Mulai Sekarang
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border-2 border-black text-black rounded-lg hover:bg-gray-50 transition font-medium text-lg"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="tentang" className="py-20 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
              Tentang CeritaKita
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Platform berbagi cerita interaktif yang fokus pada isu psikologis remaja seperti bullying, 
              kesehatan mental, dan konsep diri. Ruang aman untuk siswa dan guru saling mendukung.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">
                Cerita Interaktif
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Baca dan tulis cerita edukatif tentang kesehatan mental, bullying, dan konsep diri.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mb-6">
                <Shield className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">
                Curhat Anonim
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Ekspresikan perasaan dengan aman tanpa khawatir identitas terbongkar.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mb-6">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">
                Bimbingan Guru
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Guru memberikan tanggapan, saran, dan konten edukatif untuk mendukung kamu.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mb-6">
                <Heart className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">
                Komunitas Suportif
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Beri dan terima dukungan emosional melalui reaksi positif dan komentar hangat.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="cerita" className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-5xl font-bold text-black mb-6">
                Cerita yang Menginspirasi & Mengedukasi
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Temukan koleksi cerita statis dan interaktif tentang pengalaman remaja menghadapi 
                bullying, tekanan sosial, dan pencarian jati diri. Setiap cerita dirancang untuk 
                meningkatkan empati dan kesadaran.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-black mb-1">Cerita Statis & Interaktif</h4>
                    <p className="text-gray-600">Pilih jalur ceritamu sendiri dan pelajari berbagai perspektif</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-black mb-1">Reaksi Positif</h4>
                    <p className="text-gray-600">Peluk Virtual, Aku Mengerti, Semangat - berikan dukungan tanpa kata</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-black mb-1">Populer & Terbaru</h4>
                    <p className="text-gray-600">Urutkan berdasarkan popularitas atau temukan cerita terbaru</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-3xl p-12 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-24 h-24 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="text-white" size={48} />
                </div>
                <p className="text-2xl font-bold text-black">500+ Cerita</p>
                <p className="text-gray-600 mt-2">Telah dibagikan oleh komunitas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="jurnal" className="py-20 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-gray-100 rounded-3xl p-12 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-24 h-24 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookMarked className="text-white" size={48} />
                </div>
                <p className="text-2xl font-bold text-black">Jurnal Harian</p>
                <p className="text-gray-600 mt-2">Pantau mood & refleksi diri</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl lg:text-5xl font-bold text-black mb-6">
                Jurnal Reflektif untuk Siswa & Guru
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Guru dapat membuat jurnal refleksi dan pembelajaran yang dapat diakses siswa. 
                Siswa juga dapat mencatat mood harian dan mengikuti perkembangan emosi mereka.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="text-black flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-bold text-black mb-1">Mood Tracker</h4>
                    <p className="text-gray-600">Catat perasaan harian: Senang, Sedih, Stres, Tenang, Cemas, Marah</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="text-black flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-bold text-black mb-1">Jurnal Guru</h4>
                    <p className="text-gray-600">Guru berbagi refleksi, pembelajaran, dan panduan untuk siswa</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="text-black flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-bold text-black mb-1">Privasi Terjaga</h4>
                    <p className="text-gray-600">Atur siapa yang bisa melihat jurnal: Publik, Private, atau Anonim</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="edukasi" className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
              Konten Edukatif
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Pelajari lebih dalam tentang kesehatan mental, cara mengatasi bullying, 
              dan membangun konsep diri yang positif melalui artikel dan video singkat.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-black transition">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Artikel</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Bacaan ringan tentang kesehatan mental, tips menghadapi stres, dan cara membangun kepercayaan diri.
              </p>
              <Link href="/register" className="text-black font-medium hover:underline">
                Baca artikel →
              </Link>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-black transition">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Infografis</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Visualisasi menarik tentang tanda-tanda depresi, cara mencari bantuan, dan pentingnya berbicara.
              </p>
              <Link href="/register" className="text-black font-medium hover:underline">
                Lihat infografis →
              </Link>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-black transition">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <Heart className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Video Singkat</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Konten video pendek tentang self-care, meditasi sederhana, dan cerita inspiratif dari remaja lain.
              </p>
              <Link href="/register" className="text-black font-medium hover:underline">
                Tonton video →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6">
            Untuk Siapa CeritaKita?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Siswa</h3>
              <ul className="text-left space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="flex-shrink-0 mt-0.5" size={20} />
                  <span>Baca cerita edukatif dan inspiratif</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="flex-shrink-0 mt-0.5" size={20} />
                  <span>Tulis curhat anonim dengan aman</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="flex-shrink-0 mt-0.5" size={20} />
                  <span>Beri dukungan melalui reaksi positif</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="flex-shrink-0 mt-0.5" size={20} />
                  <span>Pantau mood harian dengan mood tracker</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookMarked className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Guru</h3>
              <ul className="text-left space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="flex-shrink-0 mt-0.5" size={20} />
                  <span>Unggah cerita edukatif dan reflektif</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="flex-shrink-0 mt-0.5" size={20} />
                  <span>Buat jurnal pembelajaran untuk siswa</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="flex-shrink-0 mt-0.5" size={20} />
                  <span>Berikan tanggapan dan bimbingan</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="flex-shrink-0 mt-0.5" size={20} />
                  <span>Monitor aktivitas dan laporan anonim</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-black text-white rounded-3xl p-12 lg:p-16 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Siap Berbagi Ceritamu?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan komunitas yang peduli dan saling mendukung.
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-white text-black rounded-lg hover:bg-gray-100 transition font-medium text-lg"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">
            © 2025 CeritaKita. Platform berbagi cerita untuk kesehatan mental remaja.
          </p>
        </div>
      </footer>
    </div>
  );
}
