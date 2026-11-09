import { Link } from 'react-router-dom';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group ${className || ''}`}>
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-xs group-hover:bg-primary-hover transition-colors">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4.5 h-4.5 text-white"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
      <span className="text-xl font-bold tracking-tight text-gray-900">
        ShopEase
      </span>
    </Link>
  );
}
