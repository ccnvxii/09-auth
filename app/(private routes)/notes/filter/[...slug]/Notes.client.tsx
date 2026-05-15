'use client';

import { useState } from 'react'; // Додаємо useState
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { fetchNotes } from '@/lib/api/clientApi';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import css from '../../Notes.module.css';

interface NotesClientProps {
  activeTag: string;
  initialData: any;
}

export default function NotesClient({
  activeTag,
  initialData,
}: NotesClientProps) {
  const [search, setSearch] = useState('');

  const { data } = useQuery({
    queryKey: ['notes', activeTag, search],
    queryFn: () => fetchNotes(1, search, activeTag),
    initialData,
    placeholderData: previousData => previousData,
  });

  return (
    <div className={css.container}>
      <Toaster />
      <div className={css.toolbar}>
        <SearchBox onSearch={setSearch} />
      </div>

      <NoteList notes={data?.notes || []} />

      {data?.totalPages > 1 && <Pagination totalPages={data.totalPages} />}
    </div>
  );
}
