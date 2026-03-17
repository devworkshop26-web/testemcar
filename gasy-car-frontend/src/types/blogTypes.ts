export type BlogSectionLayout = "FULL" | "IMAGE_LEFT" | "IMAGE_RIGHT" | "QUOTE";



/**
 * Section envoyée au backend
 */
export interface BlogSectionInput {
  order: number;
  layout: BlogSectionLayout;
  title?: string;
  body?: string;
  image?: File | string | null;
  list_items?: string[] | null;
  cta_label?: string;
  cta_url?: string;
  highlight_label?: string;
}

export interface CreateBlogPayload {
  title: string;
  subtitle?: string;
  slug: string;

  /**
   * Peut être File ou string (URL)
   */
  cover_image?: File | string | null;

  excerpt?: string;
  meta_title?: string;
  meta_description?: string;
  
  is_published?: boolean;
  published_at?: string | null;

  /**
   * Sections envoyées
   */
  sections: BlogSectionInput[];
}

export interface UpdateBlogPayload extends Partial<CreateBlogPayload> {}

export interface BlogSection {
  id: string;
  order: number;
  layout: BlogSectionLayout;
  title?: string;
  body?: string;
  image?: string | null;
  list_items?: string[] | null;
  cta_label?: string;
  cta_url?: string;
  highlight_label?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;

  /**
   * Toujours string (URL) ou null
   */
  cover_image?: string | null;

  excerpt?: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;

  published_at?: string | null;
  created_at: string;
  updated_at: string;

  sections: BlogSection[];
}
