import Link from 'next/link';
import { Heart, Shield, Users, BookOpen, MessageCircle, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            CeritaKita
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 md:mb-8">
            Ruang Aman untuk Berbagi Cerita dan Tumbuh Bersama
          </p>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Platform untuk remaja berbagi pengalaman, mengekspresikan diri, dan belajar melalui cerita interaktif. 
            Tempat di mana setiap suara didengar, setiap perasaan dihargai.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 md:mb-6 text-center">
            Tentang CeritaKita
          </h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4 md:mb-6">
            CeritaKita adalah platform berbagi cerita yang berfokus pada isu-isu psikologis remaja seperti 
            <span className="font-semibold"> bullying, kesehatan mental, dan konsep diri</span>. Kami percaya bahwa setiap 
            remaja memiliki cerita yang berharga dan layak untuk didengar.
          </p>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Melalui platform ini, siswa dapat berbagi pengalaman mereka secara terbuka atau anonim, sementara guru 
            berperan sebagai pembimbing yang memberikan dukungan, tanggapan, dan konten edukatif untuk membantu 
            pertumbuhan emosional dan mental remaja.
          </p>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <Card className="border-2 border-black">
            <CardContent className="pt-6 md:pt-8">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-black text-white rounded-xl flex items-center justify-center mb-4">
                <Sparkles size={24} className="md:w-7 md:h-7" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-black mb-3 md:mb-4">Visi Kami</h3>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                Menjadi platform terdepan yang membangun komunitas remaja yang sehat secara emosional, 
                di mana setiap individu merasa aman untuk berbagi, belajar, dan berkembang bersama.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-black">
            <CardContent className="pt-6 md:pt-8">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-black text-white rounded-xl flex items-center justify-center mb-4">
                <Heart size={24} className="md:w-7 md:h-7" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-black mb-3 md:mb-4">Misi Kami</h3>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                Meningkatkan kesadaran dan empati terhadap isu psikologis remaja melalui cerita, 
                membangun ruang aman untuk ekspresi diri, dan menghubungkan siswa dengan pembimbing yang peduli.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 md:mb-12 text-center">
          Fitur Utama
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Feature 1 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="text-purple-600" size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2 md:mb-3">
                Cerita Interaktif
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Baca dan tulis cerita tentang pengalaman hidup, baik secara terbuka maupun anonim. 
                Setiap cerita adalah pelajaran berharga.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="text-pink-600" size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2 md:mb-3">
                Reaksi Positif
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Berikan dukungan melalui reaksi seperti Peluk Virtual, Aku Mengerti, dan Semangat. 
                Tunjukkan empati tanpa kata-kata.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2 md:mb-3">
                Komentar & Diskusi
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Berbagi pemikiran, memberikan dukungan, atau bertanya kepada komunitas. 
                Diskusi yang sehat dan konstruktif.
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-green-600" size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2 md:mb-3">
                Privasi Terjaga
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Pilih untuk berbagi secara publik, anonim, atau privat. 
                Kontrol penuh atas siapa yang dapat melihat ceritamu.
              </p>
            </CardContent>
          </Card>

          {/* Feature 5 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-amber-600" size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2 md:mb-3">
                Bimbingan Guru
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Guru dapat memberikan tanggapan, saran, dan konten edukatif untuk mendukung 
                perkembangan emosional siswa.
              </p>
            </CardContent>
          </Card>

          {/* Feature 6 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2 md:mb-3">
                Jurnal & Mood Tracker
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Pantau perkembangan emosional dengan jurnal harian dan mood tracker. 
                Kenali pola dan kelola perasaanmu.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Values Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 md:mb-12 text-center">
          Nilai-Nilai Kami
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={28} />
            </div>
            <h3 className="text-lg font-bold text-black mb-2">Keamanan</h3>
            <p className="text-sm text-gray-600">
              Ruang aman dan terpercaya untuk berbagi
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={28} />
            </div>
            <h3 className="text-lg font-bold text-black mb-2">Empati</h3>
            <p className="text-sm text-gray-600">
              Memahami dan menghargai setiap perasaan
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={28} />
            </div>
            <h3 className="text-lg font-bold text-black mb-2">Komunitas</h3>
            <p className="text-sm text-gray-600">
              Tumbuh dan berkembang bersama
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={28} />
            </div>
            <h3 className="text-lg font-bold text-black mb-2">Pertumbuhan</h3>
            <p className="text-sm text-gray-600">
              Mendukung perkembangan emosional
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Siap Berbagi Ceritamu?
          </h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan komunitas CeritaKita dan mulai perjalananmu menuju kesehatan mental yang lebih baik.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white text-black rounded-lg hover:bg-gray-100 transition font-bold text-sm md:text-base"
            >
              Daftar Sekarang
            </Link>
            <Link
              href="/cerita"
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-black transition font-bold text-sm md:text-base"
            >
              Jelajahi Cerita
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 text-center">
        <p className="text-sm md:text-base text-gray-600">
          CeritaKita - Platform Berbagi Cerita untuk Kesehatan Mental Remaja
        </p>
        <p className="text-xs md:text-sm text-gray-500 mt-2">
          © 2025 CeritaKita. Semua hak dilindungi.
        </p>
      </section>
    </div>
  );
}
