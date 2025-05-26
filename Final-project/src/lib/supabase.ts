import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export type User = {
  id: string;
  email: string;
}

export type Role = {
  id: number;
  name: string;
}

export type Branch = {
  id: number;
  name: string;
}

export type Class = {
  id: number;
  branch_id: number;
  name: string;
}

export type Student = {
  id: number;
  class_id: number;
  name: string;
  email: string;
}

export type Document = {
  file_path(id: string, file_path: any): void;
  id: string;
  class_id: string;
  title: string;
  file_url: string;
  uploaded_by: string;
  uploaded_at: string;
}

export type Event = {
  id: number;
  class_id: number;
  title: string;
  start_time: string;
  end_time: string;
  description: string;
}

export type UserProfile = {
  id: string;
  role: string;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'faculty-portal'
    }
  }
});