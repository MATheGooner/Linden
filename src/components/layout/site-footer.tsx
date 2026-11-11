import Link from "next/link";
import { siteLinks } from "./site-navigation";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-ivory px-[var(--space-page)]">
      <div className="mx-auto grid max-w-7xl gap-10 py-12 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] sm:py-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)]">
        <div>
          <Link className="font-serif text-xl text-forest" href="/">
            Linden <span aria-hidden="true">&amp;</span> Co.
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-stone">
            A considered approach to finding a home in Geneva and the places around it.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-olive">
            Explore
          </h2>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-2 text-sm">
            {siteLinks.map((link) => (
              <li key={link.href}>
                <Link className="text-charcoal outline-offset-4 hover:text-forest" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-olive">
            A note
          </h2>
          <p className="text-sm leading-6 text-stone">
            This website and its property content are fictional portfolio demonstration material.
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-line py-5 text-xs leading-5 text-stone sm:flex-row sm:items-center sm:justify-between">
        <p>© {currentYear} Linden &amp; Co. Real Estate</p>
        <p>
          Built by <span className="text-charcoal">Bitmason Labs</span>
        </p>
      </div>
    </footer>
  );
}
