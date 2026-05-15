'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { fetchNotes } from '@/lib/api/clientApi';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Link from 'next/link';
import css from '../../Notes.module.css';

interface NotesClientProps {
  activeTag: string;
}

export default function NotesClient({ activeTag }: NotesClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') || ''
  );
  const [debouncedSearch] = useDebounce(searchValue, 500);

  const currentPage = Number(searchParams.get('page')) || 1;
  const apiTag = activeTag === 'all' ? '' : activeTag;

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) params.set('search', debouncedSearch);
    else params.delete('search');
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearch, pathname, router]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const { data } = useQuery({
    queryKey: ['notes', activeTag, currentPage, debouncedSearch],
    queryFn: () => fetchNotes(currentPage, 12, apiTag, debouncedSearch), 
  });

  const notes = data?.notes || [];

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={setSearchValue} />

        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            onChange={handlePageChange}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {notes.length > 0 && <NoteList notes={notes} />}

      {notes.length === 0 && !data && (
        <p className={css.emptyMessage}>No notes found.</p>
      )}
    </div>
  );
}
