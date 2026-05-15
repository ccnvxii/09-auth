'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import css from './NoteDetails.module.css';

export default function NoteDetailsClient({
  id,
  initialData,
}: {
  id: string;
  initialData: any;
}) {
  const { data: note } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    initialData,
  });

  return (
    <main className={css.container}>
      <article className={css.card}>
        <h1 className={css.title}>{note?.title}</h1>
        <span className={css.tag}>{note?.tag}</span>
        <div className={css.content}>{note?.content}</div>
      </article>
    </main>
  );
}
