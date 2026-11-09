import React from "react";
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageBannerProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  backgroundImage?: string;
  imageAlt?: string;
  rightElement?: React.ReactNode;
  className?: string;
  gradient?: string;
}

export default function PageBanner({
  title,
  description,
  breadcrumbs = [],
  backgroundImage,
  imageAlt = "Banner background",
  rightElement,
  className = "",
  gradient,
}: PageBannerProps) {
  const bgGradient =
    gradient ||
    "bg-gradient-to-r from-[#12315b] via-[#173c6e] to-[#204c86]";

  return (
    <section
      className={`relative overflow-hidden ${bgGradient} text-white py-7 sm:py-9 select-none ${className}`}
    >
      {/* Background Graphic on Right with Seamless Fade */}
      {backgroundImage && (
        <div className="absolute right-0 top-0 bottom-0 w-3/4 sm:w-2/3 lg:w-3/5 pointer-events-none overflow-hidden flex justify-end">
          <img
            src={backgroundImage}
            alt={imageAlt}
            className="w-full h-full object-cover object-right select-none"
          />
        </div>
      )}

      {/* Optional custom right element (e.g. SVG map for Contact, vector art for Shops) */}
      {!backgroundImage && rightElement && (
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-4/5 lg:w-3/5 pointer-events-none overflow-hidden flex items-center justify-end">
          {rightElement}
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-xl">
          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-white leading-tight">
            {title}
          </h1>

          {description && (
            <p className="mt-1.5 text-xs sm:text-sm lg:text-[15px] text-blue-100 font-normal leading-relaxed">
              {description}
            </p>
          )}

          {breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="mt-3 flex items-center gap-2 text-xs sm:text-[13px] text-blue-200/90 font-medium"
            >
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.label + idx}>
                    {idx > 0 && (
                      <span className="text-blue-300/80 font-normal select-none">
                        &gt;
                      </span>
                    )}
                    {crumb.href && !isLast ? (
                      <Link
                        to={crumb.href}
                        className="hover:text-white transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-white font-medium">
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}
