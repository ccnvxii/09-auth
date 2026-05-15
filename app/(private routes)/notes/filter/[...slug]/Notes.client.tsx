'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { fetchNotes, deleteNote } from '@/lib/api/clientApi';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Link from 'next/link';
import { NotesResponse } from '@/types/note';
import css from '../../Notes.module.css';

interface NotesClientProps {
  activeTag: string;
  initialData: NotesResponse;
}

export default function NotesClient({
  activeTag,
  initialData,
}: NotesClientProps) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search') || '';
  const apiTag = activeTag === 'all' ? '' : activeTag;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const { data } = useQuery({
    queryKey: ['notes', activeTag, currentPage, searchQuery],
    queryFn: () => fetchNotes(currentPage, 12, apiTag, searchQuery),
    initialData,
  });

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* Тепер handleSearch визначено */}
        <SearchBox onSearch={handleSearch} />

        {data && data.totalPages > 1 ? (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            onChange={handlePageChange}
          />
        ) : (
          <div />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      <NoteList
        notes={data?.notes || []}
        onDelete={(id: string) => mutation.mutate(id)}
      />
    </div>
  );
}
