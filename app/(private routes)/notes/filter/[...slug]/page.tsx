import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';

interface Props {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function NotesPage({ params, searchParams }: Props) {
  const queryClient = new QueryClient();

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const activeTag = resolvedParams.slug[0] || 'all';
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const searchQuery = resolvedSearchParams.search || '';
  const apiTag = activeTag === 'all' ? '' : activeTag;

  await queryClient.prefetchQuery({
    queryKey: ['notes', activeTag, currentPage, searchQuery],
    queryFn: () => fetchNotes(currentPage, 12, apiTag, searchQuery),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient activeTag={activeTag} />
    </HydrationBoundary>
  );
}
