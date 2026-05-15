import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function NotesFilterPage({ params }: PageProps) {
  const resolvedParams = await params;
  const activeTag = resolvedParams.slug[0] || 'all';

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', activeTag],
    queryFn: () => fetchNotes(1, '', activeTag),
  });

  const dehydratedState = dehydrate(queryClient);
  const initialData = queryClient.getQueryData(['notes', activeTag]);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient activeTag={activeTag} initialData={initialData} />
    </HydrationBoundary>
  );
}
