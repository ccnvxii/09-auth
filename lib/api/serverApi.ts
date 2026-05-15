import { api } from './api';
import { cookies } from 'next/headers';
import { User } from '../../types/user';

const getServerHeaders = async () => {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const headers = await getServerHeaders();
    await api.get<{ message: string }>('/auth/session', headers);
    const userRes = await api.get<User>('/users/me', headers);
    return userRes.data;
  } catch {
    return null;
  }
};

export const getMe = async (): Promise<User | null> => {
  try {
    const headers = await getServerHeaders();
    const res = await api.get<User>('/users/me', headers);
    return res.data;
  } catch {
    return null;
  }
};

export const fetchNotes = async (page = 1, search = '', tag = '') => {
  const headers = await getServerHeaders();
  const params: Record<string, string | number> = { page, perPage: 12 };
  if (search.trim()) params.search = search;
  if (tag && tag !== 'all') params.tag = tag;

  const res = await api.get('/notes', { ...headers, params });
  return res.data;
};

export const fetchNoteById = async (id: string) => {
  const headers = await getServerHeaders();
  const res = await api.get(`/notes/${id}`, headers);
  return res.data;
};