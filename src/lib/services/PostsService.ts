import { CrudService, DataTransformers, ServiceConfig } from './base/CrudService';
import { Post, PostForCreation, PostStatus } from '@/types';
import { DateUtils } from '@/lib/utils';

// Posts-specific data transformers
const postDataTransformers: DataTransformers<Post> = {
  rowToEntity: (row: string[]): Post => ({
    id: row[0] || '',
    title: row[1] || '',
    slug: row[2] || '',
    content: row[3] || '',
    excerpt: row[4] || undefined,
    author_id: row[5] || '',
    category_id: row[6] || '',
    tags: row[7] ? row[7].split(',').map(tag => tag.trim()) : undefined,
    featured_image: row[8] || undefined,
    status: (row[9] as PostStatus) || PostStatus.DRAFT,
    featured: row[10] === 'true' || row[10] === '1',
    created_at: DateUtils.parse(row[11] || ''),
    updated_at: row[12] ? DateUtils.parse(row[12]) : undefined,
    published_at: row[13] ? DateUtils.parse(row[13]) : undefined,
    seo_title: row[14] || undefined,
    seo_description: row[15] || undefined,
  }),

  entityToRow: (post: Post): string[] => [
    post.id,
    post.title,
    post.slug,
    post.content,
    post.excerpt || '',
    post.author_id,
    post.category_id,
    post.tags ? post.tags.join(', ') : '',
    post.featured_image || '',
    post.status,
    post.featured ? 'true' : 'false',
    DateUtils.format(post.created_at),
    post.updated_at ? DateUtils.format(post.updated_at) : '',
    post.published_at ? DateUtils.format(post.published_at) : '',
    post.seo_title || '',
    post.seo_description || '',
  ]
};

// Posts service configuration
const postConfig: ServiceConfig<Post> = {
  sheetConfig: {
    sheetName: 'Posts',
    range: 'Posts!A:P',
    dateColumn: { index: 11, letter: 'L' } // created_at column
  },
  dataTransformers: postDataTransformers,
  idField: 'id'
};

export class PostsService extends CrudService<Post> {
  constructor(spreadsheetId: string, config?: ServiceConfig<Post>) {
    super(spreadsheetId, config || postConfig);
  }

  async getAll(): Promise<Post[]> {
    try {
      return await this.getAllRows();
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Failed to fetch posts');
    }
  }

  async getById(id: string): Promise<Post | null> {
    try {
      const result = await this.findRowById(id);
      return result ? result.entity : null;
    } catch (error) {
      console.error(`Error fetching post with id ${id}:`, error);
      throw new Error(`Failed to fetch post with id ${id}`);
    }
  }

  async create(data: PostForCreation): Promise<Post> {
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        const existingItems = await this.getAllRows();
        const id = this.getNextId(existingItems);
        const now = new Date();
        const newPost: Post = { 
          ...data, 
          id,
          status: PostStatus.DRAFT,
          created_at: now,
          updated_at: now
        };
        
        await this.appendRow(newPost);
        return newPost;
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          console.error('Error creating post after retries:', error);
          throw new Error('Failed to create post after multiple attempts');
        }
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
    
    throw new Error('Failed to create post');
  }

  async update(id: string, updates: Partial<Post>): Promise<Post | null> {
    try {
      const result = await this.findRowById(id);
      if (!result) return null;

      const now = new Date();
      const updatedPost = { 
        ...result.entity, 
        ...updates,
        updated_at: now
      } as Post;

      // If status is being changed to PUBLISHED and it wasn't published before
      if (updates.status === PostStatus.PUBLISHED && result.entity.status !== PostStatus.PUBLISHED) {
        updatedPost.published_at = now;
      }
      
      await this.updateRow(result.rowIndex, updatedPost);
      return updatedPost;
    } catch (error) {
      console.error(`Error updating post with id ${id}:`, error);
      throw new Error(`Failed to update post with id ${id}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.findRowById(id);
      if (!result) return false;

      await this.deleteRow(result.rowIndex);
      return true;
    } catch (error) {
      console.error(`Error deleting post with id ${id}:`, error);
      throw new Error(`Failed to delete post with id ${id}`);
    }
  }

  // Domain-specific methods
  async getPosts(): Promise<Post[]> {
    return this.getAll();
  }

  async getPostById(id: string): Promise<Post | null> {
    return this.getById(id);
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    try {
      const posts = await this.getAllRows();
      return posts.find(post => post.slug === slug) || null;
    } catch (error) {
      console.error(`Error fetching post with slug ${slug}:`, error);
      throw new Error(`Failed to fetch post with slug ${slug}`);
    }
  }

  async getPublishedPosts(): Promise<Post[]> {
    try {
      const posts = await this.getAllRows();
      return posts.filter(post => post.status === PostStatus.PUBLISHED);
    } catch (error) {
      console.error('Error fetching published posts:', error);
      throw new Error('Failed to fetch published posts');
    }
  }

  async getDraftPosts(): Promise<Post[]> {
    try {
      const posts = await this.getAllRows();
      return posts.filter(post => post.status === PostStatus.DRAFT);
    } catch (error) {
      console.error('Error fetching draft posts:', error);
      throw new Error('Failed to fetch draft posts');
    }
  }

  async getFeaturedPosts(): Promise<Post[]> {
    try {
      const posts = await this.getAllRows();
      return posts.filter(post => post.featured && post.status === PostStatus.PUBLISHED);
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      throw new Error('Failed to fetch featured posts');
    }
  }

  async getPostsByAuthor(authorId: string): Promise<Post[]> {
    try {
      const posts = await this.getAllRows();
      return posts.filter(post => post.author_id === authorId);
    } catch (error) {
      console.error(`Error fetching posts by author ${authorId}:`, error);
      throw new Error(`Failed to fetch posts by author ${authorId}`);
    }
  }

  async getPublishedPostsByAuthor(authorId: string): Promise<Post[]> {
    try {
      const posts = await this.getAllRows();
      return posts.filter(post => post.author_id === authorId && post.status === PostStatus.PUBLISHED);
    } catch (error) {
      console.error(`Error fetching published posts by author ${authorId}:`, error);
      throw new Error(`Failed to fetch published posts by author ${authorId}`);
    }
  }

  async getPostsByCategory(categoryId: string): Promise<Post[]> {
    try {
      const posts = await this.getAllRows();
      return posts.filter(post => post.category_id === categoryId);
    } catch (error) {
      console.error(`Error fetching posts by category ${categoryId}:`, error);
      throw new Error(`Failed to fetch posts by category ${categoryId}`);
    }
  }

  async getPublishedPostsByCategory(categoryId: string): Promise<Post[]> {
    try {
      const posts = await this.getAllRows();
      return posts.filter(post => post.category_id === categoryId && post.status === PostStatus.PUBLISHED);
    } catch (error) {
      console.error(`Error fetching published posts by category ${categoryId}:`, error);
      throw new Error(`Failed to fetch published posts by category ${categoryId}`);
    }
  }

  async getPostsByTag(tag: string): Promise<Post[]> {
    try {
      const posts = await this.getAllRows();
      return posts.filter(post => post.tags?.includes(tag));
    } catch (error) {
      console.error(`Error fetching posts by tag ${tag}:`, error);
      throw new Error(`Failed to fetch posts by tag ${tag}`);
    }
  }

  async createPost(post: PostForCreation): Promise<Post> {
    return this.create(post);
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
    return this.update(id, updates);
  }

  async deletePost(id: string): Promise<boolean> {
    return this.delete(id);
  }

  async publishPost(id: string): Promise<Post | null> {
    return this.update(id, { status: PostStatus.PUBLISHED });
  }

  async unpublishPost(id: string): Promise<Post | null> {
    return this.update(id, { status: PostStatus.DRAFT });
  }

  async featurePost(id: string): Promise<Post | null> {
    return this.update(id, { featured: true });
  }

  async unfeaturePost(id: string): Promise<Post | null> {
    return this.update(id, { featured: false });
  }
}