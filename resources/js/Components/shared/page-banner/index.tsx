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
}

export default function PageBanner({
  title,
  description,
  breadcrumbs = [],
  backgroundImage,
  imageAlt = "Banner background",
  rightElement,
  className = "",
}: PageBannerProps) {
  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-r from-[#102a4b] via-[#16355e] to-[#214380] text-white py-10 sm:py-14 select-none ${className}`}
    >
      {/* Background Graphic on Right with Seamless Gradient Blending */}
      {backgroundImage && (
        <div className="absolute right-0 top-0 bottom-0 w-3/5 sm:w-1/2 lg:w-3/5 pointer-events-none overflow-hidden flex justify-end">
          <img
            src={backgroundImage}
            alt={imageAlt}
            className="w-full h-full object-cover object-right"
          />
          {/* Multi-stage linear gradient fade from solid navy into transparent image */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#102a4b] via-[#102a4b]/70 to-transparent" />
          <div className="absolute inset-0 bg-[#102a4b]/20 mix-blend-multiply" />
        </div>
      )}

      {/* Optional custom right element (e.g. vector art or custom graphic) */}
      {!backgroundImage && rightElement && (
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden flex items-center justify-end pr-8 sm:pr-14">
          {rightElement}
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-xl sm:max-w-2xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {title}
          </h1>

          {description && (
            <p className="mt-2 sm:mt-2.5 text-sm sm:text-base text-blue-100/90 font-normal leading-relaxed">
              {description}
            </p>
          )}

          {breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="mt-3.5 flex items-center gap-2 text-xs sm:text-sm text-blue-200/90 font-medium"
            >
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.label + idx}>
                    {idx > 0 && <span className="text-blue-300/70 select-none">›</span>}
                    {crumb.href && !isLast ? (
                      <Link
                        to={crumb.href}
                        className="hover:text-white transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-white font-medium">{crumb.label}</span>
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
