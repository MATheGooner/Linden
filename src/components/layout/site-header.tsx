"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { primaryLinks } from "./site-navigation";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function handleMenuKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      closeMenu();
      menuButtonRef.current?.focus();
    }
  }

  return (
    <header
      className="relative z-10 border-b border-line bg-paper px-[var(--space-page)]"
      onKeyDown={handleMenuKeyDown}
    >
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 py-4">
        <Link
          aria-label="Linden & Co. Real Estate home"
          className="shrink-0 font-serif text-lg tracking-[0.015em] text-forest sm:text-xl"
          href="/"
          onClick={closeMenu}
        >
          Linden <span aria-hidden="true">&amp;</span> Co.
          <span className="ml-2 font-sans text-[0.58rem] font-medium uppercase tracking-[0.18em] text-stone sm:text-[0.65rem] sm:tracking-[0.2em]">
            Real Estate
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-6 xl:flex">
          {primaryLinks.map((link) => (
            <Link
              className="text-sm text-charcoal outline-offset-4 hover:text-forest"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
          <Link
            className="border border-forest px-5 py-2.5 text-sm text-forest outline-offset-4 hover:bg-forest hover:text-paper"
            href="/contact"
          >
            Contact
          </Link>
        </nav>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="inline-flex min-h-11 min-w-11 items-center justify-center border border-line text-forest outline-offset-4 xl:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          ref={menuButtonRef}
          type="button"
        >
          <span aria-hidden="true" className="flex w-5 flex-col gap-1.5">
            <span className="h-px w-full bg-current" />
            <span className="h-px w-full bg-current" />
          </span>
        </button>
      </div>

      <nav
        aria-label="Mobile navigation"
        className={`${isMenuOpen ? "grid" : "hidden"} gap-1 border-t border-line py-3 xl:hidden`}
        id="mobile-navigation"
      >
        {primaryLinks.map((link) => (
          <Link
            className="px-2 py-3 text-sm text-charcoal outline-offset-2 hover:text-forest"
            href={link.href}
            key={link.href}
            onClick={closeMenu}
          >
            {link.label}
          </Link>
        ))}
        <Link
          className="mt-1 border border-forest px-3 py-3 text-sm text-forest outline-offset-2 hover:bg-forest hover:text-paper"
          href="/contact"
          onClick={closeMenu}
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}
