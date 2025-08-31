import { unstable_cache } from 'next/cache';
import { categories, posts } from '../services';

export const getCachedPosts = unstable_cache(
  async () => {
    // Fetch from Google Sheets
    const postList = await posts.getPublishedPosts();
    return await Promise.all(postList.map(async post => ({
        ...post,
        category: await categories.getCategoryById(post.category_id)
    })))
  },
  ['blog-posts'],
  {
    revalidate: 300, // 5 minutes
    tags: ['blog']
  }
);