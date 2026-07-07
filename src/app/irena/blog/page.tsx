import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/app/components/irena/shared/PageHero";
import { blogPostService } from "@/lib/domain/blog-post/service";
import "../styles/pages/blog.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog | Eliksir",
  description:
    "Preporuke za igre, utisci iz kluba i saveti za sve koji žele da uđu u svet društvenih igara.",
};

export default async function BlogPage() {
  const posts = await blogPostService.getBlogPosts();

  return (
    <>
      <PageHero
        title="Blog"
        description="Mesto gde delimo preporuke za igre, utiske iz kluba i savete za sve koji žele da uđu u svet društvenih igara."
        meta={
          <>
            <span>Vesti iz kluba</span>
            <span className="dot">•</span>
            <span className="hint">
              Preporuke i priče iz sveta društvenih igara
            </span>
          </>
        }
      />

      <div className="blog-page">
        <section className="blog-posts">
          <div className="container">
            {posts.map((post) => (
              <article key={post.id} className="blog-post" id={post.id}>
                <div className="blog-post__image">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    width={600}
                    height={400}
                  />
                </div>
                <div className="blog-post__content">
                  <p className="blog-post__meta">{post.meta}</p>
                  <h2>{post.title}</h2>
                  {post.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                  {post.list && post.list.length > 0 ? (
                    <ul className="blog-list">
                      {post.list.map((item) => (
                        <li key={item.title}>
                          <strong>{item.title}</strong> – {item.description}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
