import { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const currentTag = slug?.[0] || 'all';
  const displayTag = currentTag === 'all' ? 'All Notes' : `${currentTag} Notes`;

  return {
    title: `${displayTag} | NoteHub`,
    description: `View and manage your board filtered by category: ${currentTag}.`,
    openGraph: {
      title: `${displayTag} | NoteHub`,
      description: `View and manage your board filtered by category: ${currentTag}.`,
      url: `https://notehub.app/notes/filter/${currentTag}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}

export default async function FilteredNotesPage({ params }: PageProps) {
  const { slug } = await params; // Змінили tag на slug
  const currentTag = slug?.[0] || 'all';

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', currentTag],
    queryFn: () => fetchNotes(1, '', currentTag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient activeTag={currentTag} />
    </HydrationBoundary>
  );
}
