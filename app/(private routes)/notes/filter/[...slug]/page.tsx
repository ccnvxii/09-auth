import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';
import { NotesResponse } from '@/types/note'; // 1. Переконайся, що імпорт є

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

  // 2. ДОДАЙ ГЕНЕРИК <NotesResponse> ТУТ:
  const initialData = queryClient.getQueryData<NotesResponse>([
    'notes',
    activeTag,
  ]);

  // 3. Додаємо перевірку на випадок, якщо дані не завантажились
  if (!initialData) {
    return null; // або редірект/помилка
  }

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient activeTag={activeTag} initialData={initialData} />
    </HydrationBoundary>
  );
}
