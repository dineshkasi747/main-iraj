export default function Loading() {
  return (
    <div className="iraj-loader-overlay">
      <div className="iraj-loader-lockup iraj-loader-lockup-full">
        {/* Full Official Hospital Logo */}
        <div className="iraj-loader-logo-wrap">
          <img
            src="/images/iraj-logo-full.png"
            alt="IRAJ Hospitals"
            className="iraj-loader-full-img"
          />
        </div>

        {/* Accent Tagline with Animated Glowing Shimmer Lines */}
        <div className="iraj-loader-tagline">
          <div className="iraj-loader-line" />
          <span className="iraj-loader-subtitle">
            THE CARE YOU CAN TRUST
          </span>
          <div className="iraj-loader-line right" />
        </div>
      </div>
    </div>
  );
}
