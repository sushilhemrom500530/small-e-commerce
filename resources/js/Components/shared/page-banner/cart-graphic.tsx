export default function CartBannerGraphic({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`w-full h-full flex items-center justify-end select-none pointer-events-none ${className}`}
    >
      <svg
        viewBox="0 0 620 200"
        className="w-full h-full max-h-48"
        preserveAspectRatio="xMaxYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Smooth left-to-right fade mask */}
          <linearGradient id="cartLeftFadeMask" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="black" stopOpacity="0" />
            <stop offset="20%" stopColor="white" stopOpacity="0.15" />
            <stop offset="45%" stopColor="white" stopOpacity="0.75" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <mask id="cartMaskFade">
            <rect width="620" height="200" fill="url(#cartLeftFadeMask)" />
          </mask>

          {/* 3D Pin Gradient */}
          <linearGradient id="cartPinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="55%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>

          {/* Ambient Orb Glow */}
          <radialGradient id="cartAmbientGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#2563eb" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
          </radialGradient>

          {/* Soft shadow for 3D location marker elevation */}
          <filter
            id="cartPinShadow"
            x="-40%"
            y="-30%"
            width="180%"
            height="180%"
          >
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="6"
              floodColor="#05101e"
              floodOpacity="0.6"
            />
          </filter>
        </defs>

        <g mask="url(#cartMaskFade)">
          {/* Ambient soft glow orb */}
          <ellipse
            cx="450"
            cy="110"
            rx="170"
            ry="85"
            fill="url(#cartAmbientGlow)"
          />

          {/* Soft fluid wave hills matching reference mockup */}
          <path
            d="M 100 185 C 220 130, 340 145, 460 100 C 530 75, 575 80, 620 70 L 620 200 L 100 200 Z"
            fill="#2563eb"
            fillOpacity="0.15"
          />
          <path
            d="M 180 200 C 290 140, 390 160, 480 120 C 540 95, 580 100, 620 90 L 620 200 Z"
            fill="#3b82f6"
            fillOpacity="0.18"
          />
          <path
            d="M 260 200 C 360 155, 450 170, 520 135 C 565 115, 595 120, 620 110 L 620 200 Z"
            fill="#60a5fa"
            fillOpacity="0.12"
          />

          {/* Faint concentric signal arcs */}
          <ellipse
            cx="450"
            cy="118"
            rx="140"
            ry="62"
            stroke="#3b82f6"
            strokeWidth="1"
            strokeOpacity="0.22"
          />
          <ellipse
            cx="450"
            cy="118"
            rx="85"
            ry="38"
            fill="#2563eb"
            fillOpacity="0.12"
            stroke="#60a5fa"
            strokeWidth="1.4"
            strokeOpacity="0.45"
            strokeDasharray="5 3"
          />
          <ellipse
            cx="450"
            cy="118"
            rx="45"
            ry="20"
            fill="#2563eb"
            fillOpacity="0.25"
            stroke="#93c5fd"
            strokeWidth="1.6"
            strokeOpacity="0.7"
          />

          {/* Ground hub dot */}
          <ellipse
            cx="450"
            cy="118"
            rx="16"
            ry="7"
            fill="#1d4ed8"
            fillOpacity="0.75"
            stroke="#bfdbfe"
            strokeWidth="1.8"
            strokeOpacity="0.9"
          />
          <circle cx="450" cy="118" r="3" fill="#ffffff" />

          {/* Clean sleek royal blue location pin with circular hole */}
          <g filter="url(#cartPinShadow)">
            {/* Pin Body: Tip at (450, 114), Head centered at (450, 64), radius 23 */}
            <path
              d="M450 114 C 444 98, 422 85, 422 64 C 422 48.5, 434.5 36, 450 36 C 465.5 36, 478 48.5, 478 64 C 478 85, 456 98, 450 114 Z"
              fill="url(#cartPinGrad)"
              stroke="#60a5fa"
              strokeWidth="1.8"
            />

            {/* Inner Circular Hole Cutout */}
            <circle cx="450" cy="63" r="9.5" fill="#ffffff" opacity="0.98" />
            <circle cx="450" cy="63" r="6" fill="#1e3a8a" opacity="0.15" />

            {/* Specular highlight */}
            <path
              d="M428 58 C 428 47, 438 39, 450 39"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.65"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

