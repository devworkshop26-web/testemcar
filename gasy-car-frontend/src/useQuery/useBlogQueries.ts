import {
  createBlogPost,
  deleteBlogPost,
  fetchBlogPost,
  fetchBlogPosts,
  updateBlogPost,
} from "@/Actions/blogApi";
import { BlogPost,  UpdateBlogPayload } from "@/types/blogTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BLOG_KEYS = {
  all: ["blog-posts"] as const,
  list: () => [...BLOG_KEYS.all, "list"] as const,
  detail: (slug: string) => [...BLOG_KEYS.all, "detail", slug] as const,
};

export function useBlogPosts() {
  return useQuery<BlogPost[]>({
    queryKey: BLOG_KEYS.list(),
    queryFn: fetchBlogPosts,
  });
}

export function useBlogPost(slug: string) {
  return useQuery<BlogPost>({
    queryKey: BLOG_KEYS.detail(slug),
    queryFn: () => fetchBlogPost(slug),
    enabled: !!slug,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOG_KEYS.list() });
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogPayload }) =>
      updateBlogPost(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: BLOG_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: BLOG_KEYS.detail(data.slug) });
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOG_KEYS.list() });
    },
  });
}
