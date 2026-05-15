import { fetchNoteById } from '@/lib/api/serverApi';
import { notFound } from 'next/navigation';
import NoteDetailsClient from './NoteDetails.client';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NotePage({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['note', id],
      queryFn: () => fetchNoteById(id),
    });
  } catch (error) {
    return notFound();
  }

  const initialData = queryClient.getQueryData(['note', id]);

  if (!initialData) {
    return notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} initialData={initialData} />
    </HydrationBoundary>
  );
}
