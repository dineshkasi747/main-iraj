import Link from "next/link";

export default function PageHeader({ title, breadcrumbs = [] }) {
  // Filter out duplicate "Home" breadcrumb entries if passed
  const cleanCrumbs = breadcrumbs.filter(
    (c) => (c.label || "").toLowerCase().trim() !== "home"
  );

  return (
    <div className="subpage-header">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {/* Sub page Header start */}
            <div className="subpage-header-box">
              <h1 className="text-anime-style-3" suppressHydrationWarning={true}>{title}</h1>
              <ol className="breadcrumb wow fadeInUp">
                <li>
                  <Link href="/">Home</Link>
                </li>
                {cleanCrumbs.map((crumb, idx) => (
                  <li key={idx}>
                    {crumb.href ? (
                      <Link href={crumb.href}>{crumb.label}</Link>
                    ) : (
                      crumb.label
                    )}
                  </li>
                ))}
              </ol>
            </div>
            {/* Sub page Header End */}
          </div>
        </div>
      </div>
    </div>
  );
}
