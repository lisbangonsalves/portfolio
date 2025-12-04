'use client';

export default function AnimatedGradient() {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 shadow-2xl">
      {/* Animated gradient blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob-flow"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob-flow animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-0 w-full h-full bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob-flow animation-delay-4000"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob-flow animation-delay-6000"></div>
      </div>

      {/* Flowing gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-transparent to-cyan-500/20 animate-gradient-flow"></div>
    </div>
  );
}
