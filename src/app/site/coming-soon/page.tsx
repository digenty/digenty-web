import { Globe } from "lucide-react";

// Reached when a connected custom domain resolves but the school hasn't published yet
// (resolveWebsiteHost returns live: false). Deliberately not a 404 — the domain is theirs.
export default function ComingSoonPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
      <Globe className="size-10 text-zinc-300" />
      <h1 className="text-xl font-semibold text-zinc-900">This site is coming soon</h1>
      <p className="max-w-sm text-sm text-zinc-500">The school that owns this domain hasn&apos;t published their website yet.</p>
    </div>
  );
}
