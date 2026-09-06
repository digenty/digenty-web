"use client";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-text-default text-lg font-medium">You&apos;re offline</p>
      <p className="text-text-muted max-w-80 text-xs font-normal">Check your internet connection and try again.</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-bg-state-primary hover:bg-bg-state-primary-hover text-text-white-default rounded-md px-4 py-2 text-sm"
      >
        Retry
      </button>
    </div>
  );
}
