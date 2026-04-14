import { Timestamp } from 'firebase/firestore';

export type EntryStatus = 'draft' | 'published';

export interface ActivityLabel {
  id: string;
  name: string;
  order?: number;
  created_at: Timestamp;
}

export interface DateEntry {
  id: string;
  entry_date: Timestamp;
  title?: string;
  label_id: string;
  do_text?: string;
  dont_text?: string;
  short_summary?: string;
  animal_signs?: string[];
  status: EntryStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin';
}
