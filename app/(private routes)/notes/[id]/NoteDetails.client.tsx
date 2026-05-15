'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import { Note } from '@/types/note'; // Імпортуємо тип
import css from './NoteDetails.module.css';

interface NoteDetailsProps {
  id: string;
  initialData: Note;
}

export default function NoteDetailsClient({
  id,
  initialData,
}: NoteDetailsProps) {
  const { data: note } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    initialData,
  });

  if (!note) return null;

  return (
    <main className={css.container}>
      <article className={css.card}>
        <h1 className={css.title}>{note.title}</h1>
        <span className={css.tag}>{note.tag}</span>
        <div className={css.content}>{note.content}</div>
      </article>
    </main>
  );
}
