'use client';

import { Note } from '@/types/note';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';
import { useRouter } from 'next/navigation';
import css from '@/components/NotePreview/NotePreview.module.css';

export default function NotePreviewClient({
  id,
  initialData,
}: {
  id: string;
  initialData: Note;
}) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    initialData,
  });

  return (
    <Modal onClose={() => router.back()}>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading note details.</p>}

      {note && (
        <div className={css.previewCard}>
          <h2 className={css.title}>{note.title}</h2>
          <span className={css.tag}>{note.tag}</span>
          <p className={css.content}>{note.content}</p>
        </div>
      )}
    </Modal>
  );
}
