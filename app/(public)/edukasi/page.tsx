import { GraduationCap } from 'lucide-react';

export default function EdukasiPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center space-y-4 mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <GraduationCap size={40} className="text-black" />
          <h1 className="text-4xl font-bold text-black">Edukasi</h1>
        </div>
        <p className="text-lg text-gray-600">
          Coming Soon - Halaman ini sedang dalam pengembangan
        </p>
      </div>
    </div>
  );
}
