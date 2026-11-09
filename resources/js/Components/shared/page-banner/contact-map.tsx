export default function ContactBannerMap({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`w-full h-full flex items-center justify-end select-none pointer-events-none ${className}`}
    >
      <svg
        viewBox="0 0 700 200"
        className="w-full h-full max-h-48"
        preserveAspectRatio="xMaxYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Fade mask from left to right for seamless 100% transparent blending */}
          <linearGradient id="contactLeftFadeMask" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="black" stopOpacity="0" />
            <stop offset="18%" stopColor="white" stopOpacity="0.1" />
            <stop offset="38%" stopColor="white" stopOpacity="0.6" />
            <stop offset="65%" stopColor="white" stopOpacity="0.95" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <mask id="contactSvgMask">
            <rect width="700" height="200" fill="url(#contactLeftFadeMask)" />
          </mask>

          {/* Pin Gradient */}
          <linearGradient id="contactPinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="55%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>

          {/* Central Hub Glow */}
          <radialGradient id="contactHubRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#2563eb" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
          </radialGradient>

          {/* Soft drop shadow for 3D elevation */}
          <filter
            id="contactPinShadow"
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

        <g mask="url(#contactSvgMask)">
          {/* Ambient Map Territory Glows (soft blue zones like reference) */}
          <ellipse
            cx="440"
            cy="115"
            rx="200"
            ry="90"
            fill="url(#contactHubRadial)"
          />

          {/* Map Land / City District Blocks in soft blue hues */}
          <path
            d="M160 50 L270 30 L290 85 L180 100 Z"
            fill="#2563eb"
            fillOpacity="0.18"
          />
          <path
            d="M300 28 L430 18 L450 72 L315 80 Z"
            fill="#3b82f6"
            fillOpacity="0.22"
          />
          <path
            d="M445 18 L600 8 L620 58 L460 68 Z"
            fill="#1d4ed8"
            fillOpacity="0.20"
          />

          <path
            d="M190 115 L310 95 L335 160 L210 175 Z"
            fill="#3b82f6"
            fillOpacity="0.22"
          />
          <path
            d="M330 90 L450 78 L470 145 L345 155 Z"
            fill="#60a5fa"
            fillOpacity="0.25"
          />
          <path
            d="M470 75 L610 65 L630 135 L485 145 Z"
            fill="#2563eb"
            fillOpacity="0.24"
          />

          <path
            d="M225 185 L350 170 L370 215 L245 225 Z"
            fill="#1d4ed8"
            fillOpacity="0.18"
          />
          <path
            d="M365 168 L480 158 L500 220 L380 225 Z"
            fill="#3b82f6"
            fillOpacity="0.22"
          />
          <path
            d="M500 158 L640 145 L660 220 L515 225 Z"
            fill="#2563eb"
            fillOpacity="0.20"
          />

          {/* Concentric Radar / Wave Ripples (Centered at Pin Hub: x=440, y=118) */}
          <ellipse
            cx="440"
            cy="118"
            rx="240"
            ry="105"
            stroke="#3b82f6"
            strokeWidth="1"
            strokeOpacity="0.20"
          />
          <ellipse
            cx="440"
            cy="118"
            rx="175"
            ry="78"
            stroke="#60a5fa"
            strokeWidth="1.3"
            strokeOpacity="0.32"
          />
          <ellipse
            cx="440"
            cy="118"
            rx="120"
            ry="52"
            fill="#3b82f6"
            fillOpacity="0.10"
            stroke="#93c5fd"
            strokeWidth="1.5"
            strokeOpacity="0.45"
            strokeDasharray="6 4"
          />
          <ellipse
            cx="440"
            cy="118"
            rx="72"
            ry="32"
            fill="#2563eb"
            fillOpacity="0.22"
            stroke="#bfdbfe"
            strokeWidth="1.8"
            strokeOpacity="0.75"
          />
          <ellipse
            cx="440"
            cy="118"
            rx="30"
            ry="13"
            fill="#1d4ed8"
            fillOpacity="0.55"
            stroke="#ffffff"
            strokeWidth="2"
            strokeOpacity="0.95"
          />

          {/* Main Arterial Highways (Curving across the city map through the Hub) */}
          <path
            d="M120 195 C 240 175, 340 148, 440 118 C 520 95, 600 65, 680 40"
            stroke="#e0f2fe"
            strokeWidth="2.8"
            strokeOpacity="0.85"
            strokeLinecap="round"
          />
          <path
            d="M260 15 C 330 50, 390 85, 440 118 C 490 150, 560 175, 630 200"
            stroke="#e0f2fe"
            strokeWidth="2.8"
            strokeOpacity="0.85"
            strokeLinecap="round"
          />

          {/* Secondary City Streets */}
          <path
            d="M170 102 C 270 108, 360 114, 440 118 C 520 122, 600 120, 680 110"
            stroke="#93c5fd"
            strokeWidth="1.8"
            strokeOpacity="0.65"
          />
          <path
            d="M320 20 C 370 65, 405 95, 440 118 C 475 140, 520 180, 550 210"
            stroke="#93c5fd"
            strokeWidth="1.8"
            strokeOpacity="0.60"
          />

          {/* Dashed Express Navigation Routes */}
          <path
            d="M190 150 C 290 138, 370 126, 440 118"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeDasharray="5 4"
            strokeOpacity="0.9"
          />
          <path
            d="M440 118 C 510 110, 580 85, 650 55"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeDasharray="5 4"
            strokeOpacity="0.9"
          />

          {/* Waypoint Junction Nodes */}
          <circle cx="280" cy="150" r="3.5" fill="#ffffff" opacity="0.9" />
          <circle cx="370" cy="104" r="4" fill="#93c5fd" opacity="0.9" />
          <circle cx="530" cy="92" r="4" fill="#93c5fd" opacity="0.9" />
          <circle cx="580" cy="158" r="3.5" fill="#ffffff" opacity="0.9" />

          {/* Base Hub Indicator */}
          <ellipse
            cx="440"
            cy="118"
            rx="14"
            ry="6"
            fill="#bfdbfe"
            opacity="0.9"
          />
          <circle cx="440" cy="118" r="3.5" fill="#ffffff" />

          {/* The Iconic 3D Royal Blue Teardrop Map Pin */}
          <g filter="url(#contactPinShadow)">
            {/* Pin Body: Tip at (440, 114), Head centered at (440, 64), radius 23 */}
            <path
              d="M440 114 C 434 98, 412 85, 412 64 C 412 48.5, 424.5 36, 440 36 C 455.5 36, 468 48.5, 468 64 C 468 85, 446 98, 440 114 Z"
              fill="url(#contactPinGrad)"
              stroke="#60a5fa"
              strokeWidth="1.8"
            />

            {/* Inner Pin Hole / Cutout: Matches white center dot in mockup */}
            <circle cx="440" cy="63" r="9.5" fill="#ffffff" opacity="0.98" />
            <circle cx="440" cy="63" r="6" fill="#1e3a8a" opacity="0.15" />

            {/* Specular 3D Highlight curve on top left for authentic dimensional sheen */}
            <path
              d="M418 58 C 418 47, 428 39, 440 39"
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

