import { api } from './api';
import { User } from '@/types/user';
import { NoteTag } from '@/types/note';

interface FetchNotesResponse {
  notes: Array<{
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    tag: NoteTag;
  }>;
  totalPages: number;
}

// --- Запити авторизації ---
export const register = async (data: Record<string, string>): Promise<User> => {
  const res = await api.post<User>('/auth/register', data);
  return res.data;
};

export const login = async (data: Record<string, string>): Promise<User> => {
  const res = await api.post<User>('/auth/login', data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
  try {
    await api.get<{ message: string }>('/auth/session');
    const userProfile = await getMe();
    return userProfile;
  } catch {
    return null;
  }
};

// --- Запити профілю ---
export const getMe = async (): Promise<User> => {
  const res = await api.get<User>('/users/me');
  return res.data;
};

export const updateMe = async (data: { username: string; email?: string }): Promise<User> => {
  const res = await api.patch<User>('/users/me', data);
  return res.data;
};

// --- Запити нотаток ---
export const fetchNotes = async (
  page = 1,
  search = '',
  tag = '',
  sortBy = 'created'
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { 
    page, 
    perPage: 12, 
    sortBy 
  };
  
  if (search.trim()) params.search = search;
  if (tag && tag !== 'all') params.tag = tag;

  const res = await api.get<FetchNotesResponse>('/notes', { params });
  return res.data;
};

export const fetchNoteById = async (id: string) => {
  const res = await api.get(`/notes/${id}`);
  return res.data;
};

export const createNote = async (data: { title: string; content: string; tag: NoteTag }) => {
  const res = await api.post('/notes', data);
  return res.data;
};

export const deleteNote = async (id: string) => {
  const res = await api.delete(`/notes/${id}`);
  return res.data;
};