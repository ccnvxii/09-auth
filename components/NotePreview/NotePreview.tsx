'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';
import { useRouter } from 'next/navigation';
import css from '@/components/NotePreview/NotePreview.module.css';

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const {
    data: note,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <Modal onClose={() => router.back()}>
      {isPending && <p className={css.loading}>Loading...</p>}
      {isError && <p className={css.error}>Error loading note details.</p>}

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
