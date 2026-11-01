import Link from "next/link";
import PageHeader from "@/components/common/PageHeader";

export default function NotFound() {
  return (
    <>
      <PageHeader
        title="Page Not Found"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "404 error" },
        ]}
      />

      {/* error Page Start */}
      <div className="error-page">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="error-page-image">
                <img src="/images/404-Error-img.png" alt="404 Error" />
              </div>
              <div className="error-page-content">
                <div className="error-page-heading">
                  <h2 className="text-anime-style-3">
                    Sorry, This page is not found.
                  </h2>
                </div>
                <Link
                  href="/"
                  className="btn-default wow fadeInUp"
                  data-wow-delay="0.25s"
                >
                  Back To Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* error Page End */}
    </>
  );
}
