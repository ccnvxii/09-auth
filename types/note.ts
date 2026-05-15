export type NoteTag = 'Todo' | 'Personal' | 'Work' | 'Meeting' | 'Shopping';

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}