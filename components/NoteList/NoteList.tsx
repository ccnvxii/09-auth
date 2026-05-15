'use client';

import { Note } from '@/types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api/clientApi';
import Link from 'next/link';
import css from './NoteList.module.css';

export default function NoteList({ notes }: { notes: Note[] }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <Link href={`/notes/${note.id}`} className={css.link}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
          </Link>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => mutation.mutate(note.id)}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? '...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
