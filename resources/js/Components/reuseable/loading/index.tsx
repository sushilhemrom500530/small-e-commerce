export default function Loading({
    title = "Loading...",
    className = "min-h-[260px]",
}: {
    title?: string;
    className?: string;
}) {
    return (
        <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
            <div className="w-9 h-9 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            {title && (
                <h1 className="text-sm md:text-base mt-4 font-semibold text-slate-600">
                    {title}
                </h1>
            )}
        </div>
    );
}
