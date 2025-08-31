import { useState, useEffect } from 'react';
import { Post, Author, Category, ApiResponse } from '@/types';

interface UseBlogPostReturn {
  post: Post | null;
  author: Author | null;
  category: Category | null;
  loading: boolean;
  error: string | null;
}

export function useBlogPost(postSlug: string): UseBlogPostReturn {
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postSlug) return;

    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if we're running on the server (SSR) or client
        const isServer = typeof window === 'undefined';
        const baseUrl = isServer 
          ? (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
          : '';
        
        // Fetch the post by slug
        const postResponse = await fetch(`${baseUrl}/api/posts/slug/${postSlug}`);
        
        if (!postResponse.ok) {
          if (postResponse.status === 404) {
            throw new Error('POST_NOT_FOUND');
          }
          throw new Error(`Failed to fetch post: ${postResponse.status}`);
        }

        const postData: ApiResponse<Post> = await postResponse.json();
        if (!postData.success || !postData.data) {
          throw new Error('POST_NOT_FOUND');
        }
        const fetchedPost = postData.data;

        // Fetch the author information
        const authorResponse = await fetch(`${baseUrl}/api/authors/${fetchedPost.author_id}`);
        if (!authorResponse.ok) {
          throw new Error(`Failed to fetch author: ${authorResponse.status}`);
        }

        const authorData: ApiResponse<Author> = await authorResponse.json();
        if (!authorData.success || !authorData.data) {
          throw new Error('AUTHOR_NOT_FOUND');
        }
        const fetchedAuthor = authorData.data;

        // Fetch the category information
        const categoryResponse = await fetch(`${baseUrl}/api/categories/${fetchedPost.category_id}`);
        
        if (!categoryResponse.ok) {
          throw new Error(`Failed to fetch category: ${categoryResponse.status}`);
        }

        const categoryData: ApiResponse<Category> = await categoryResponse.json();
        if (!categoryData.success || !categoryData.data) {
          throw new Error('CATEGORY_NOT_FOUND');
        }
        const fetchedCategory = categoryData.data;

        // Update state with fetched data
        setPost(fetchedPost);
        setAuthor(fetchedAuthor);
        setCategory(fetchedCategory);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch blog post';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [postSlug]);

  return { post, author, category, loading, error };
}