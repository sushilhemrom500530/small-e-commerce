import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background soft atmospheric glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Large 404 display */}
        <h1 className="text-8xl sm:text-9xl font-black text-primary tracking-tight select-none leading-none">
          404
        </h1>

        {/* Text headings */}
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Page Not Found
        </h2>

        <p className="mt-3 text-sm sm:text-base text-gray-500 leading-relaxed max-w-md mx-auto">
          Sorry, the page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>

        {/* Single button for re-direct to Home */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-primary/25 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
