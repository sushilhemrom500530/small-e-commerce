import { Link } from 'react-router-dom'

export default function Logo({ className }: { className?: string }) {
    return (
        <Link to="/">
            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-secondary to-primary inline-block text-transparent bg-clip-text ${className}`}>ERP</h1>
        </Link>
    )
}
