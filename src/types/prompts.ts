export interface PromptItem {
  id: string;
  title: string;
  description?: string;
  content: string; // Markdown formatted prompt
}

export interface PromptProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  repoUrl: string;
  liveUrl?: string;
  tags: string[];
  prompts: PromptItem[];
  isFeatured?: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}
