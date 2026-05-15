import { api } from './api';
import { User } from '@/types/user';
import { NotesResponse } from '@/types/note'; 

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
    const res = await api.get<User | null>('/auth/session');
    return res.data || null;
  } catch {
    return null;
  }
};

export const getMe = async (): Promise<User> => {
  const res = await api.get<User>('/users/me');
  return res.data;
};

export const updateMe = async (data: { username: string }): Promise<User> => {
  const res = await api.patch<User>('/users/me', data);
  return res.data;
};

export const fetchNotes = async (
  page: number | string, 
  perPage: number | string, 
  tag: string,
  search: string = '' 
) => {
  const { data } = await api.get<NotesResponse>(`/notes`, {
    params: { page, perPage, tag, title: search },
  });
  return data;
};

export const fetchNoteById = async (id: string) => {
  const res = await api.get(`/notes/${id}`);
  return res.data;
};

export const createNote = async (data: {
  title: string;
  content: string;
  tag: string;
}) => {
  const res = await api.post('/notes', data);
  return res.data;
};

export const deleteNote = async (id: string) => {
  const res = await api.delete(`/notes/${id}`);
  return res.data;
};