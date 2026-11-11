import Link from "next/link";
import { EditorialPhoto } from "@/components/home/editorial-photo";

export default function Home() {
  return (
    <div>
      <section
        aria-labelledby="hero-title"
        className="bg-paper px-[var(--space-page)]"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-10 py-10 sm:gap-12 sm:py-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14 lg:py-16">
          <div className="max-w-xl lg:py-12">
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.22em] text-olive">
              Independent real estate · Geneva
            </p>
            <h1
              className="font-serif text-[clamp(3.5rem,7.5vw,6.75rem)] leading-[0.94] tracking-[-0.05em] text-forest"
              id="hero-title"
            >
              Find your place in Geneva.
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-stone sm:text-lg sm:leading-8">
              A thoughtful starting point for finding a home in the city and
              the communities around it.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                className="inline-flex min-h-12 items-center justify-center bg-forest px-5 py-3 text-sm text-paper outline-offset-4 hover:bg-[#1b3027]"
                href="/properties/for-sale"
              >
                Explore homes for sale
              </Link>
              <Link
                className="text-sm font-medium text-forest underline decoration-line underline-offset-8 outline-offset-4 hover:decoration-forest"
                href="/properties/to-rent"
              >
                Explore rentals
              </Link>
            </div>
          </div>

          <EditorialPhoto
            alt="A Swiss residential façade with repeated windows and dark shutters."
            caption="Illustrative residential architecture"
            className="lg:pl-2"
            mediaClassName="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[5/6]"
            priority
            sizes="(min-width: 1024px) 56vw, (min-width: 640px) 88vw, 100vw"
            src="/images/apartment-facade-swiss.webp"
          />
        </div>
      </section>

      <section
        aria-labelledby="discovery-title"
        className="px-[var(--space-page)] py-20 sm:py-24 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-5 border-b border-line pb-7 sm:mb-14 sm:grid-cols-[1fr_0.7fr] sm:items-end">
            <div>
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-olive">
                A good place to begin
              </p>
              <h2
                className="max-w-2xl font-serif text-4xl leading-tight tracking-[-0.035em] text-forest sm:text-5xl"
                id="discovery-title"
              >
                Two ways to find your next home.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-stone sm:justify-self-end">
              Follow the path that fits your plans. Photography is illustrative;
              this fictional portfolio has no properties currently available.
            </p>
          </div>

          <div className="grid gap-x-10 gap-y-14 lg:grid-cols-12 lg:gap-x-14">
            <article className="lg:col-span-7">
              <Link
                aria-label="Explore homes for sale"
                className="group block outline-offset-8"
                href="/properties/for-sale"
              >
                <EditorialPhoto
                  alt="An open living room and kitchen with generous natural light."
                  caption="Illustrative interior"
                  mediaClassName="aspect-[4/3]"
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  src="/images/living-kitchen-open-plan.webp"
                />
                <div className="mt-4 flex items-baseline justify-between gap-4 border-b border-line pb-4">
                  <h3 className="font-serif text-3xl tracking-[-0.025em] text-forest sm:text-4xl">
                    Buying
                  </h3>
                  <span className="text-sm text-stone group-hover:text-forest">
                    Explore homes for sale
                  </span>
                </div>
                <p className="mt-4 max-w-lg text-sm leading-6 text-stone">
                  Explore the details that help a place feel like home.
                </p>
              </Link>
            </article>

            <article className="lg:col-span-5 lg:mt-28">
              <Link
                aria-label="Explore homes to rent"
                className="group block outline-offset-8"
                href="/properties/to-rent"
              >
                <EditorialPhoto
                  alt="A bedroom with a woven headboard and soft evening light."
                  caption="Illustrative interior"
                  className="lg:ml-5"
                  mediaClassName="aspect-[5/4] sm:aspect-[4/3] lg:aspect-[5/4]"
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  src="/images/apartment-bedroom-f.webp"
                />
                <div className="mt-4 flex items-baseline justify-between gap-4 border-b border-line pb-4 lg:ml-5">
                  <h3 className="font-serif text-3xl tracking-[-0.025em] text-forest sm:text-4xl">
                    Renting
                  </h3>
                  <span className="text-sm text-stone group-hover:text-forest">
                    Explore rentals
                  </span>
                </div>
                <p className="mt-4 max-w-md text-sm leading-6 text-stone lg:ml-5">
                  A well-chosen place can make a new city feel familiar.
                </p>
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="geneva-title"
        className="bg-paper px-[var(--space-page)] py-20 sm:py-24 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div className="max-w-md">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-olive">
              The city and its surroundings
            </p>
            <h2
              className="font-serif text-4xl leading-tight tracking-[-0.035em] text-forest sm:text-5xl"
              id="geneva-title"
            >
              A city, in many ways.
            </h2>
            <p className="mt-5 text-sm leading-7 text-stone sm:text-base">
              From old-town lanes to the calm of the lakeside and the character
              of nearby neighbourhoods, each corner offers a different sense of
              home.
            </p>
            <ul
              aria-label="Areas around Geneva"
              className="mt-8 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-line pt-5 text-xs font-medium uppercase tracking-[0.14em] text-charcoal"
            >
              <li>Eaux-Vives</li>
              <li>Champel</li>
              <li>Plainpalais</li>
              <li>Carouge</li>
              <li>Cologny</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-6 lg:gap-x-7">
            <EditorialPhoto
              alt="Historic residential façades along a narrow European street."
              caption="Illustrative residential street"
              className="sm:col-span-1 lg:col-span-4"
              mediaClassName="aspect-[5/4]"
              sizes="(min-width: 1024px) 44vw, (min-width: 640px) 44vw, 100vw"
              src="/images/townhouse-row-houses.webp"
            />
            <EditorialPhoto
              alt="Pastel residential façades and shuttered windows along a street."
              caption="Illustrative streetscape"
              className="sm:col-span-1 sm:mt-16 lg:col-span-2 lg:mt-24"
              mediaClassName="aspect-[4/5]"
              sizes="(min-width: 1024px) 24vw, (min-width: 640px) 44vw, 100vw"
              src="/images/townhouse-european-facade.webp"
            />
            <EditorialPhoto
              alt="Stone and plaster residential façades with shuttered windows."
              caption="Illustrative residential façades"
              className="sm:col-span-2 sm:ml-[18%] sm:w-[82%] lg:col-span-4 lg:col-start-3 lg:mt-2"
              mediaClassName="aspect-[16/10]"
              sizes="(min-width: 1024px) 44vw, (min-width: 640px) 68vw, 100vw"
              src="/images/geneva-facade.webp"
            />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="approach-title"
        className="bg-forest px-[var(--space-page)] py-20 text-paper sm:py-24 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-[#d4ddcc]">
              The Linden approach
            </p>
            <h2
              className="max-w-xl font-serif text-4xl leading-tight tracking-[-0.035em] sm:text-5xl"
              id="approach-title"
            >
              Good guidance begins with listening.
            </h2>
          </div>
          <div className="lg:pt-10">
            <p className="max-w-2xl text-base leading-7 text-[#f0eee6] sm:text-lg sm:leading-8">
              A home search is personal. This independent Geneva agency is built
              around thoughtful discovery and clear guidance for buyers,
              renters, sellers and landlords.
            </p>
            <ul className="mt-9 divide-y divide-white/25 border-y border-white/25">
              <li>
                <Link
                  className="flex items-center justify-between gap-5 py-4 text-sm text-paper outline-offset-4 hover:text-white"
                  href="/sell"
                >
                  Selling a property
                  <span aria-hidden="true">↗</span>
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center justify-between gap-5 py-4 text-sm text-paper outline-offset-4 hover:text-white"
                  href="/landlords"
                >
                  Letting and management
                  <span aria-hidden="true">↗</span>
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center justify-between gap-5 py-4 text-sm text-paper outline-offset-4 hover:text-white"
                  href="/about"
                >
                  About Linden &amp; Co.
                  <span aria-hidden="true">↗</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="closing-title"
        className="px-[var(--space-page)] py-20 sm:py-24 lg:py-32"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-7 border-b border-line pb-12 sm:pb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-olive">
              Your next step
            </p>
            <h2
              className="font-serif text-4xl leading-tight tracking-[-0.035em] text-forest sm:text-5xl lg:text-6xl"
              id="closing-title"
            >
              Start with the places you would like to call home.
            </h2>
          </div>
          <div className="flex shrink-0 flex-wrap gap-x-7 gap-y-4">
            <Link
              className="inline-flex min-h-12 items-center justify-center bg-forest px-5 py-3 text-sm text-paper outline-offset-4 hover:bg-[#1b3027]"
              href="/properties/for-sale"
            >
              Explore properties
            </Link>
            <Link
              className="inline-flex min-h-12 items-center text-sm font-medium text-forest underline decoration-line underline-offset-8 outline-offset-4 hover:decoration-forest"
              href="/contact"
            >
              Contact Linden &amp; Co.
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
