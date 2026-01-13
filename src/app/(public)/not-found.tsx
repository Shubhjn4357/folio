import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 text-center max-w-lg">
        {/* 404 Number */}
        <div className="mb-8 relative">
          <h1 className="text-[150px] md:text-[200px] font-bold leading-none gradient-text opacity-20">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🚀</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Lost in Space?
        </h2>

        {/* Message */}
        <p className="text-secondary text-lg mb-8">
          The page you&apos;re looking for has drifted into the cosmos. 
          Let&apos;s navigate you back to familiar territory.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold rounded-xl hover:shadow-neon transition-all duration-300 hover:scale-105 inline-block"
          >
            🏠 Back to Home
          </Link>
          <Link
            href="/#project"
            className="px-8 py-3 bg-tertiary text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 inline-block"
          >
            📂 View Projects
          </Link>
        </div>

        {/* Fun message */}
        <p className="mt-12 text-secondary/50 text-sm">
          Error Code: 404 • Page Not Found • Universe Still Expanding
        </p>
      </div>
    </div>
  );
}
