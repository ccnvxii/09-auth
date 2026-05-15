// lib/api/serverApi.ts
import { api } from './api';
import { Note, NotesResponse } from '@/types/note';
import { User } from '@/types/user';
import { cookies } from 'next/headers';
import { AxiosResponse } from 'axios';

export const fetchNotes = async (
  page: number | string,
  perPage: number | string,
  tag: string = '',
  search: string = ''
): Promise<NotesResponse> => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

  const { data } = await api.get<NotesResponse>('/notes', {
    params: { page, perPage, tag, title: search },
    headers: { Cookie: allCookies },
  });
  return data;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

  const { data } = await api.get<User>('/users/me', {
    headers: { Cookie: allCookies },
  });
  return data;
};

export const checkSession = async (): Promise<AxiosResponse<User>> => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

  return api.get<User>('/auth/session', {
    headers: { Cookie: allCookies },
  });
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: allCookies },
  });
  return data;
};