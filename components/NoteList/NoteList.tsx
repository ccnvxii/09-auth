'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteNote } from '@/lib/api/clientApi';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';
import Link from 'next/link';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete note');
    },
  });

  if (!notes || notes.length === 0) {
    return <p className={css.empty}>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.item}>
          <Link href={`/notes/${note.id}`} className={css.link}>
            <h3 className={css.title}>{note.title}</h3>
            <p className={css.excerpt}>{note.content}</p>
            <span className={css.tag}>{note.tag}</span>
          </Link>
          <button
            onClick={() => mutation.mutate(note.id)}
            className={css.deleteButton}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? '...' : 'Delete'}
          </button>
        </li>
      ))}
    </ul>
  );
}
