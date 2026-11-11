"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main role="alert" className="mx-auto my-16 max-w-xl border border-line bg-paper p-8"><h1 className="font-serif text-3xl text-forest">Administration is temporarily unavailable</h1><p className="mt-3 text-sm leading-6 text-stone">The request could not be completed. Your saved records remain unchanged. Please try again.</p><button className="mt-6 border border-forest px-4 py-2 text-sm text-forest" onClick={reset} type="button">Try again</button></main>;
}
