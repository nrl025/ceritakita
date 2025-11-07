'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function PaginationComponent({ currentPage, totalPages, basePath = '/cerita' }: PaginationComponentProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // Jumlah page numbers yang ditampilkan

    if (totalPages <= showPages) {
      // Jika total pages <= 5, tampilkan semua
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Selalu tampilkan page 1
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Tampilkan pages di sekitar current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Selalu tampilkan page terakhir
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <Link
        href={`${basePath}?page=${currentPage - 1}`}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition ${
          currentPage === 1
            ? 'border-gray-200 text-gray-400 pointer-events-none'
            : 'border-gray-200 text-black hover:bg-gray-50'
        }`}
      >
        <ChevronLeft size={16} />
        <span className="text-sm font-medium">Prev</span>
      </Link>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={`${basePath}?page=${pageNum}`}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      <Link
        href={`${basePath}?page=${currentPage + 1}`}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition ${
          currentPage === totalPages
            ? 'border-gray-200 text-gray-400 pointer-events-none'
            : 'border-gray-200 text-black hover:bg-gray-50'
        }`}
      >
        <span className="text-sm font-medium">Next</span>
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}
