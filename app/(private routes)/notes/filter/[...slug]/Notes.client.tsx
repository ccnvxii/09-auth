'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import { NotesResponse } from '@/types/note';
import NoteList from '@/components/NoteList/NoteList';
import Link from 'next/link';
import css from '../../Notes.module.css';

interface NotesClientProps {
  activeTag: string;
  initialData: NotesResponse;
}

export default function NotesClient({
  activeTag,
  initialData,
}: NotesClientProps) {
  const { data } = useQuery({
    queryKey: ['notes', activeTag],
    queryFn: () => fetchNotes(1, '', activeTag === 'all' ? '' : activeTag),
    initialData,
  });

  return (
    <div className={css.container}>
      <header className={css.header}>
        <h1 className={css.title}>
          {activeTag === 'all' ? 'All Notes' : `${activeTag} Notes`}
        </h1>
        <Link href="/notes/action/create" className={css.createButton}>
          + Create New Note
        </Link>
      </header>

      <NoteList notes={data?.notes || []} />
    </div>
  );
}
