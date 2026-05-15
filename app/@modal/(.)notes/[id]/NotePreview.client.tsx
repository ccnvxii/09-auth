'use client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';
import css from '@/components/NotePreview/NotePreview.module.css';

interface NotePreviewClientProps {
  id: string;
  initialData: any;
}

export default function NotePreviewClient({
  id,
  initialData,
}: NotePreviewClientProps) {
  const router = useRouter();

  const { data: note } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    initialData,
  });

  return (
    <Modal onClose={() => router.back()}>
      <div className={css.previewCard}>
        <h2 className={css.title}>{note?.title}</h2>
        <span className={css.tag}>{note?.tag}</span>
        <p className={css.content}>{note?.content}</p>
      </div>
    </Modal>
  );
}
