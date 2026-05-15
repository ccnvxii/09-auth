import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getMe } from '@/lib/api/serverApi';
import css from './Profile.module.css';

export const metadata: Metadata = {
  title: 'Your Profile | NoteHub',
  description: 'Manage your NoteHub profile data, credentials, and settings.',
  openGraph: {
    title: 'Your Profile | NoteHub',
    description: 'Manage your NoteHub profile data, credentials, and settings.',
    url: 'https://notehub.app/profile',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
      },
    ],
  },
};

export default async function ProfilePage() {
  let user = {
    username: 'Guest',
    email: '',
    avatar: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
  };

  try {
    const serverUser = await getMe();
    if (serverUser) user = serverUser;
  } catch {}

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={
              user.avatar ||
              'https://ac.goit.global/fullstack/react/default-avatar.jpg'
            }
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
