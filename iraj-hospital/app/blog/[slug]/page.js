import Link from "next/link";

export default function BlogSinglePage({ params }) {
  const postSlug = params?.slug || "best-medical-network-directory";

  const blogDataMap = {
    "best-medical-network-directory": {
      title: "Best Medical Network Directory For Physicians & Clients",
      date: "Feb 26, 2024",
      category: "fields of medicine",
      image: "/images/post-1.jpg",
    },
    "importance-of-regular-health-checkups": {
      title: "The Importance of Regular Health Checkups",
      date: "Feb 22, 2024",
      category: "preventive care",
      image: "/images/post-2.jpg",
    },
    "managing-stress-for-mental-health": {
      title: "Managing Better Stress for Better Mental Health",
      date: "Feb 18, 2024",
      category: "mental health",
      image: "/images/post-3.jpg",
    },
    "understanding-your-body": {
      title: "Understanding Your Body: A Medical Journey",
      date: "Feb 15, 2024",
      category: "wellness",
      image: "/images/post-4.jpg",
    },
    "mind-matters": {
      title: "Mind Matters: Navigating Mental Health disorders",
      date: "Feb 10, 2024",
      category: "mental health",
      image: "/images/post-5.jpg",
    },
    "aging-gracefully": {
      title: "Aging Gracefully: Your Guide to Healthy Aging",
      date: "Feb 05, 2024",
      category: "geriatric care",
      image: "/images/post-6.jpg",
    },
  };

  const currentPost = blogDataMap[postSlug] || {
    title: postSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    date: "Feb 26, 2024",
    category: "fields of medicine",
    image: "/images/post-1.jpg",
  };

  const relatedPosts = [
    {
      id: "best-medical-network-directory",
      title: "Best Medical Network Directory For Physicians & Clients",
      desc: "Hypertension, commonly known as high blood pressure, is a prevalent",
      image: "/images/post-1.jpg",
      delay: "0.25s",
    },
    {
      id: "importance-of-regular-health-checkups",
      title: "The Importance of Regular Health Checkups",
      desc: "This symptoms, causes, risk factors, diagnosis, treatment options strategies.",
      image: "/images/post-2.jpg",
      delay: "0.5s",
    },
    {
      id: "managing-stress-for-mental-health",
      title: "Managing Better Stress for Better Mental Health",
      desc: "These stories can provide valuable insights into living with a particular condition",
      image: "/images/post-3.jpg",
      delay: "0.75s",
    },
  ].filter((p) => p.id !== postSlug);

  return (
    <>
      {/* Subpage Header Start */}
      <div className="subpage-header">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="subpage-header-box">
                <h1 className="text-anime-style-3">{currentPost.title}</h1>
                <div className="post-single-meta wow fadeInUp">
                  <ul>
                    <li>{currentPost.date}</li>
                    <li>{currentPost.category}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Subpage Header End */}

      {/* Post Single Page Start */}
      <div className="page-post-single">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="post-content">
                {/* Post Single Image Start */}
                <div className="post-image">
                  <figure className="image-anime reveal">
                    <img src={currentPost.image} alt={currentPost.title} />
                  </figure>
                </div>
                {/* Post Single Image End */}

                {/* Post Entry Start */}
                <div className="post-entry">
                  <h2 className="wow fadeInUp" data-wow-delay="0.25s">
                    Tips for Maintaining a Healthy Heart
                  </h2>
                  <p className="wow fadeInUp" data-wow-delay="0.5s">
                    Hypertension, commonly known as high blood pressure, is a
                    prevalent medical condition that affects millions of people
                    worldwide. It occurs when the force of blood against the
                    artery walls is consistently too high, putting added strain
                    on the heart and blood vessels.
                  </p>
                  <p className="wow fadeInUp" data-wow-delay="0.75s">
                    Various factors contribute to hypertension, including
                    genetics, lifestyle choices, and underlying health
                    conditions. A sedentary lifestyle, excessive salt intake,
                    smoking.
                  </p>

                  <blockquote className="wow fadeInUp" data-wow-delay="1s">
                    <p>
                      Thankfully, hypertension can be managed effectively
                      through a combination of lifestyle modifications and
                      medical interventions.
                    </p>
                  </blockquote>

                  <ul className="wow fadeInUp" data-wow-delay="1.25s">
                    <li>
                      general health advice, specific conditions, new medical
                      research, or wellness tips.
                    </li>
                    <li>
                      government health websites, or academic institutions.
                    </li>
                    <li>
                      Visual aids like diagrams, charts, or infographics can
                      enhance understanding.{" "}
                    </li>
                    <li>
                      Always prioritize accuracy and the well-being of your
                      readers.
                    </li>
                    <li>
                      Regularly review and revise older posts to ensure they
                      remain accurate and relevant.
                    </li>
                  </ul>

                  <p className="wow fadeInUp" data-wow-delay="1.5s">
                    Regular monitoring and management of hypertension are
                    essential for preventing its potentially life-threatening
                    consequences. If you or a loved one have concerns about
                    blood pressure.
                  </p>
                </div>
                {/* Post Entry End */}

                {/* Post Tag Links Start */}
                <div className="post-tag-links">
                  <div className="row align-items-center">
                    <div className="col-lg-8">
                      <div
                        className="post-tags wow fadeInUp"
                        data-wow-delay="0.5s"
                      >
                        <span className="tag-links">
                          <a href="#">health</a>
                          <a href="#">medical</a>
                          <a href="#">heart</a>
                          <a href="#">eye care</a>
                        </span>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div
                        className="post-social-sharing wow fadeInUp"
                        data-wow-delay="0.5s"
                      >
                        <ul>
                          <li>
                            <a href="#">
                              <i className="fa-brands fa-facebook-f"></i>
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa-brands fa-instagram"></i>
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa-brands fa-twitter"></i>
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa-brands fa-linkedin-in"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Post Tag Links End */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Post Single Page End */}

      {/* Recent Posts Section Start */}
      <div className="recent-post">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 col-md-12">
              <div className="section-title">
                <h3 className="wow fadeInUp">related articles</h3>
                <h2 className="text-anime-style-3">
                  You May Also Like This Article
                </h2>
              </div>
            </div>
          </div>

          <div className="row">
            {relatedPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="col-lg-4 col-md-6">
                <div className="post-item wow fadeInUp" data-wow-delay={post.delay}>
                  <div className="post-featured-image">
                    <figure className="image-anime">
                      <Link href={`/blog/${post.id}`}>
                        <img src={post.image} alt={post.title} />
                      </Link>
                    </figure>
                  </div>
                  <div className="post-item-body">
                    <h2>
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </h2>
                    <p>{post.desc}</p>
                  </div>
                  <div className="btn-readmore">
                    <Link href={`/blog/${post.id}`}>
                      read more <i className="fa-solid fa-arrow-right-long"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Recent Posts Section End */}
    </>
  );
}
