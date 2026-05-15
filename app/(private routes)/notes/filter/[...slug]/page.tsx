import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';
import { NotesResponse } from '@/types/note';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function NotesFilterPage({ params }: PageProps) {
  const resolvedParams = await params;
  const activeTag = resolvedParams.slug[0] || 'all';

  const apiTag = activeTag === 'all' ? '' : activeTag;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', activeTag],
    queryFn: () => fetchNotes(1, '', apiTag),
  });

  const dehydratedState = dehydrate(queryClient);

  const initialData = queryClient.getQueryData<NotesResponse>([
    'notes',
    activeTag,
  ]);

  const fallbackData = initialData || { notes: [], totalPages: 0 };

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient activeTag={activeTag} initialData={fallbackData} />
    </HydrationBoundary>
  );
}
