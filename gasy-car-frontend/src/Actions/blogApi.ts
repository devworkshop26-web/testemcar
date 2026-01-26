import { InstanceAxis } from "@/helper/InstanceAxios";
import { BlogPost, CreateBlogPayload, UpdateBlogPayload } from "@/types/blogTypes";

export async function fetchBlogPost(slug: string): Promise<BlogPost> {
  const res = await InstanceAxis.get<BlogPost>(`/blog-posts/${slug}/`);
  return res.data;
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const res = await InstanceAxis.get<BlogPost[]>("/blog-posts/");
  return res.data;
}

export async function createBlogPost(data: CreateBlogPayload): Promise<BlogPost> {
  const formData = new FormData();
  
  // Append basic fields
  formData.append("title", data.title);
  formData.append("slug", data.slug);
  if (data.subtitle) formData.append("subtitle", data.subtitle);
  if (data.excerpt) formData.append("excerpt", data.excerpt);
  if (data.meta_title) formData.append("meta_title", data.meta_title);
  if (data.meta_description) formData.append("meta_description", data.meta_description);
  formData.append("is_published", String(data.is_published));
  if (data.published_at) formData.append("published_at", data.published_at);

  // Append Cover Image
  if (data.cover_image instanceof File) {
    formData.append("cover_image", data.cover_image);
  } else if (typeof data.cover_image === "string") {
    // If it's a string (URL), we might not need to send it if it hasn't changed, 
    // or the backend expects it. Usually for updates, if not sent, it keeps existing.
    // For creation, string might mean a URL from elsewhere? 
    // But typically we send File. If it's null, we might send empty or not append.
  }

  // Append Sections
  // This is the tricky part. We need to serialize sections.
  // If sections contain files, we can't just JSON.stringify.
  // We'll append sections as a JSON string for the structure, 
  // and append files separately with keys referenced in the JSON?
  // OR we use the array notation: sections[0].title, sections[0].image (File)
  
  data.sections.forEach((section, index) => {
    formData.append(`sections[${index}]order`, String(section.order));
    formData.append(`sections[${index}]layout`, section.layout);
    if (section.title) formData.append(`sections[${index}]title`, section.title);
    if (section.body) formData.append(`sections[${index}]body`, section.body);
    if (section.cta_label) formData.append(`sections[${index}]cta_label`, section.cta_label);
    if (section.cta_url) formData.append(`sections[${index}]cta_url`, section.cta_url);
    if (section.highlight_label) formData.append(`sections[${index}]highlight_label`, section.highlight_label);
    
    if (section.list_items) {
      section.list_items.forEach((item, itemIndex) => {
        formData.append(`sections[${index}]list_items[${itemIndex}]`, item);
      });
    }

    if (section.image instanceof File) {
      formData.append(`sections[${index}]image`, section.image);
    }
  });

  const res = await InstanceAxis.post<BlogPost>("/blog-posts/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateBlogPost(id: string, data: UpdateBlogPayload): Promise<BlogPost> {
  const formData = new FormData();
  
  if (data.title) formData.append("title", data.title);
  if (data.slug) formData.append("slug", data.slug);
  if (data.subtitle !== undefined) formData.append("subtitle", data.subtitle || "");
  if (data.excerpt !== undefined) formData.append("excerpt", data.excerpt || "");
  if (data.is_published !== undefined) formData.append("is_published", String(data.is_published));
  
  if (data.cover_image instanceof File) {
    formData.append("cover_image", data.cover_image);
  }

  if (data.sections) {
    data.sections.forEach((section, index) => {
      formData.append(`sections[${index}]order`, String(section.order));
      formData.append(`sections[${index}]layout`, section.layout);
      if (section.title) formData.append(`sections[${index}]title`, section.title);
      if (section.body) formData.append(`sections[${index}]body`, section.body);
      
      if (section.image instanceof File) {
        formData.append(`sections[${index}]image`, section.image);
      }
      // Note: Handling partial updates for nested list is complex.
      // Usually we replace the whole list or use specific logic.
      // Assuming full replacement of sections for simplicity here as per typical simple CMS.
    });
  }

  const res = await InstanceAxis.patch<BlogPost>(`/blog-posts/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteBlogPost(id: string): Promise<void> {
  await InstanceAxis.delete(`/blog-posts/${id}/`);
}
