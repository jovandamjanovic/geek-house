import React from 'react';
import { notFound } from 'next/navigation';
import { Post, Author, Category, ApiResponse } from '@/types';
import Image from 'next/image';
import { getCachedPosts } from '@/lib/blog/cache';

interface BlogPageProps {
  params: Promise<{ category: string; post: string }>;
}

export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
  const posts = await getCachedPosts();
  return posts.map((post) => ({
    slug: post.slug,
    category: post.category?.slug,
  }));
}

const BlogPage: React.FC<BlogPageProps> = async ({ params }) => {
  const { category: categorySlug, post: postSlug } = await params;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Fetch the post by slug
    const postResponse = await fetch(`${baseUrl}/api/posts/slug/${postSlug}`, {
      cache: 'no-store',
    });

    if (!postResponse.ok) {
      if (postResponse.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch post: ${postResponse.status}`);
    }

    const postData: ApiResponse<Post> = await postResponse.json();
    if (!postData.success || !postData.data) {
      notFound();
    }
    const post = postData.data;

    // Fetch the author information
    const authorResponse = await fetch(
      `${baseUrl}/api/authors/${post.author_id}`,
      {
        cache: 'no-store',
      }
    );
    if (!authorResponse.ok) {
      throw new Error(`Failed to fetch author: ${authorResponse.status}`);
    }

    const authorData: ApiResponse<Author> = await authorResponse.json();
    if (!authorData.success || !authorData.data) {
      notFound();
    }
    const author = authorData.data;

    // Fetch the category information
    const categoryResponse = await fetch(
      `${baseUrl}/api/categories/${post.category_id}`,
      {
        cache: 'no-store',
      }
    );

    if (!categoryResponse.ok) {
      throw new Error(`Failed to fetch category: ${categoryResponse.status}`);
    }

    const categoryData: ApiResponse<Category> = await categoryResponse.json();
    if (!categoryData.success || !categoryData.data) {
      notFound();
    }
    const category = categoryData.data;

    // Verify the category slug matches the URL parameter
    if (category.slug !== categorySlug) {
      notFound();
    }

    return (
      <article className='max-w-4xl mx-auto px-4 py-8'>
        {/* Post Header */}
        <header className='mb-8'>
          <div className='mb-4'>
            <span className='inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full'>
              {category.name}
            </span>
          </div>

          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            {post.title}
          </h1>

          {post.excerpt && (
            <p className='text-xl text-gray-600 mb-6'>{post.excerpt}</p>
          )}

          {/* Author Information */}
          <div className='flex items-center space-x-4 border-t border-b border-gray-200 py-4'>
            {author.avatar_url ? (
              <Image
                src={author.avatar_url}
                alt={author.ime}
                width={32}
                height={32}
                className='w-12 h-12 rounded-full object-cover'
              />
            ) : (
              <div className='w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center'>
                <span className='text-gray-600 font-medium'>
                  {author.ime.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div>
              <h3 className='font-semibold text-gray-900'>{author.ime}</h3>
              {author.bio && (
                <p className='text-gray-600 text-sm'>{author.bio}</p>
              )}
            </div>

            <div className='ml-auto text-sm text-gray-500'>
              {/* <time dateTime={post.created_at.toISOString()}>
              {post.created_at.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time> */}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className='mb-8'>
            <Image
              src={post.featured_image}
              alt={post.title}
              width={32}
              height={32}
              className='w-full h-64 sm:h-96 object-cover rounded-lg'
            />
          </div>
        )}

        {/* Post Content */}
        <div className='prose prose-lg max-w-none'>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className='mt-8 pt-6 border-t border-gray-200'>
            <h4 className='text-sm font-medium text-gray-900 mb-3'>Tags:</h4>
            <div className='flex flex-wrap gap-2'>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className='inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full'
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SEO Meta (hidden, but could be used for debugging) */}
        {(post.seo_title || post.seo_description) && (
          <div
            className='mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600'
            style={{ display: 'none' }}
          >
            {post.seo_title && <div>SEO Title: {post.seo_title}</div>}
            {post.seo_description && (
              <div>SEO Description: {post.seo_description}</div>
            )}
          </div>
        )}
      </article>
    );
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }
};

export default BlogPage;
