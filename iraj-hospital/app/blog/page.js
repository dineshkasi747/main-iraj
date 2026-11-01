import Link from "next/link";
import PageHeader from "@/components/common/PageHeader";

export const metadata = {
  title: "Blog & Health News",
  description:
    "Explore the latest medical articles, health checkup guides, wellness tips, and healthcare news from IRAJ Hospital.",
};

export default function BlogListingPage() {
  const posts = [
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
    {
      id: "understanding-your-body",
      title: "Understanding Your Body: A Medical Journey",
      desc: "Exploring various body systems, organs, and how they function, with articles ",
      image: "/images/post-4.jpg",
      delay: "1s",
    },
    {
      id: "mind-matters",
      title: "Mind Matters: Navigating  Mental Health disorders",
      desc: "mental health disorders, coping strategies, therapy options",
      image: "/images/post-5.jpg",
      delay: "1.25s",
    },
    {
      id: "aging-gracefully",
      title: "Aging Gracefully: Your Guide to Healthy Aging",
      desc: "tips for healthy aging, managing chronic conditions, cognitive health",
      image: "/images/post-6.jpg",
      delay: "1.5s",
    },
  ];

  return (
    <>
      <PageHeader
        title="Blog &amp; News"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "blog" },
        ]}
      />

      {/* Our Blog Section Start */}
      <div className="recent-post our-blog">
        <div className="container">
          <div className="row">
            {posts.map((post) => (
              <div key={post.id} className="col-lg-4 col-md-6">
                {/* Post Item Start */}
                <div
                  className="post-item wow fadeInUp"
                  data-wow-delay={post.delay}
                >
                  {/* Post Image Start */}
                  <div className="post-featured-image">
                    <figure className="image-anime">
                      <Link href={`/blog/${post.id}`}>
                        <img src={post.image} alt={post.title} />
                      </Link>
                    </figure>
                  </div>
                  {/* Post Image End */}

                  {/* Post Content Start */}
                  <div className="post-item-body">
                    <h2>
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </h2>
                    <p>{post.desc}</p>
                  </div>
                  {/* Post Content End */}

                  {/* Btn Readmore Start */}
                  <div className="btn-readmore">
                    <Link href={`/blog/${post.id}`}>
                      Read More <i className="fa-solid fa-arrow-right-long"></i>
                    </Link>
                  </div>
                  {/* Btn Readmore End */}
                </div>
                {/* Post Item End */}
              </div>
            ))}
          </div>

          <div className="row">
            <div className="col-md-12">
              {/* Post Pagination Start */}
              <div
                className="post-pagination wow fadeInUp"
                data-wow-delay="0.75s"
              >
                <ul className="pagination">
                  <li>
                    <a href="#">
                      <i className="fa-solid fa-arrow-left-long"></i>
                    </a>
                  </li>
                  <li className="active">
                    <a href="#">1</a>
                  </li>
                  <li>
                    <a href="#">2</a>
                  </li>
                  <li>
                    <a href="#">3</a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa-solid fa-arrow-right-long"></i>
                    </a>
                  </li>
                </ul>
              </div>
              {/* Post Pagination End */}
            </div>
          </div>
        </div>
      </div>
      {/* Our Blog Section End */}
    </>
  );
}
