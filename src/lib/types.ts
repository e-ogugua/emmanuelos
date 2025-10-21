export interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'Live' | 'Finalizing' | 'In Development';
  live_url?: string;
  github_url?: string;
  analytics_url?: string;
  image_url?: string;
  created_at: string;
  last_updated: string;
  tags: string[];
  socials?: {
    email?: string;
    phone?: string;
    location?: string;
  };
  traffic?: number;
}

export interface AppFormData {
  name: string;
  description: string;
  category: string;
  status: 'Live' | 'Finalizing' | 'In Development';
  live_url?: string;
  github_url?: string;
  analytics_url?: string;
  image_url?: string;
  tags: string[];
  socials?: {
    email?: string;
    phone?: string;
    location?: string;
  };
  traffic?: number;
}
