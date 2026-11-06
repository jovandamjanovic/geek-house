interface PageHeroProps {
  title: string;
  description: string;
  meta?: React.ReactNode;
  children?: React.ReactNode;
}

export default function PageHero({
  title,
  description,
  meta,
  children,
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero-inner">
        <h1>{title}</h1>
        <p>{description}</p>
        {meta ? <div className="page-hero-meta">{meta}</div> : null}
        {children}
      </div>
    </section>
  );
}
