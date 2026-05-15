'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import css from './Pagination.module.css';

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const currentPage = Number(searchParams.get('page')) || 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={css.pagination}>
      {pages.map(page => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`${css.pageButton} ${currentPage === page ? css.active : ''}`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
