import Link from "next/link";
import Image from "next/image";
import { blogsData } from "@/data/blogsData";
import { Calendar, User, ArrowRight } from "lucide-react";

export default function BlogSection({ limit = 3, showHeading = true }) {
  const displayBlogs = limit ? blogsData.slice(0, limit) : blogsData;

  return (
    <div className="recent-posts py-5">
      <div className="container">
        {showHeading && (
          <div className="row section-row align-items-end mb-4">
            <div className="col-lg-8 col-md-8">
              <div className="section-title">
                <h3 className="wow fadeInUp text-uppercase text-primary fw-bold small">
                  Recent Articles & News
                </h3>
                <h2 className="text-anime-style-3 fw-bold">
                  Latest Insights & Health Tips.
                </h2>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 text-md-end mt-3 mt-md-0">
              <Link href="/blog" className="btn-default">
                View All Articles
              </Link>
            </div>
          </div>
        )}

        <div className="row g-4">
          {displayBlogs.map((post, index) => (
            <div key={post.id} className="col-lg-4 col-md-6">
              <div
                className="post-item wow fadeInUp h-100 bg-white rounded-4 overflow-hidden shadow-sm border border-light d-flex flex-column"
                data-wow-delay={`${0.15 * (index + 1)}s`}
              >
                <div className="post-image position-relative">
                  <figure className="image-anime mb-0">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={400}
                      height={260}
                      className="img-fluid w-100 object-fit-cover"
                    />
                  </figure>
                  <span className="badge bg-primary position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm">
                    {post.category}
                  </span>
                </div>

                <div className="post-body p-4 d-flex flex-column flex-grow-1 justify-content-between">
                  <div>
                    <div className="post-meta text-muted small mb-2 d-flex align-items-center gap-3">
                      <span className="d-flex align-items-center gap-1">
                        <Calendar size={14} className="text-primary" /> {post.date}
                      </span>
                      <span className="d-flex align-items-center gap-1">
                        <User size={14} className="text-primary" /> {post.author}
                      </span>
                    </div>

                    <h3 className="h5 fw-bold mb-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-dark text-decoration-none hover-primary line-clamp-2"
                      >
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-muted small line-clamp-3 mb-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="post-footer pt-3 border-top">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="btn-readmore text-primary fw-semibold text-decoration-none small d-inline-flex align-items-center gap-2"
                    >
                      Read Article <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
