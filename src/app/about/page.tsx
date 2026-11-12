import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPhoto } from "@/components/home/editorial-photo";

export const metadata: Metadata = {
  title: "About Linden & Co. | Geneva Real Estate",
  description:
    "Learn about the considered, neighbourhood-led approach behind the fictional Linden & Co. Geneva real estate portfolio project.",
};

const services = [
  {
    number: "01",
    title: "Buying",
    description:
      "Explore example homes across Geneva and its surrounding communities, with details presented to support a thoughtful search.",
    href: "/properties/for-sale",
    link: "Explore homes for sale",
  },
  {
    number: "02",
    title: "Renting",
    description:
      "Browse example rental homes across Geneva and its surrounding communities, with clear monthly CHF pricing.",
    href: "/properties/to-rent",
    link: "Explore rentals",
  },
  {
    number: "03",
    title: "Selling",
    description:
      "Share information about a property through the portfolio valuation enquiry journey.",
    href: "/sell",
    link: "Request a valuation",
  },
  {
    number: "04",
    title: "Letting",
    description:
      "Use the landlord enquiry journey to outline a property and the support you are considering.",
    href: "/landlords",
    link: "Contact the landlord team",
  },
] as const;

export default function AboutPage() {
  return (
    <div>
      <section className="bg-paper px-[var(--space-page)]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 py-12 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">
          <div className="max-w-xl">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.22em] text-olive">
              About Linden &amp; Co. | Geneva
            </p>
            <h1 className="font-serif text-5xl leading-[1.02] tracking-[-0.04em] text-forest sm:text-6xl lg:text-7xl">
              A more considered way to look for home.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-stone sm:text-lg sm:leading-8">
              Linden &amp; Co. is a fictional independent real estate agency concept,
              created for a portfolio project. Its approach begins with listening,
              understanding what matters, and looking closely at the places around Geneva.
            </p>
          </div>
          <EditorialPhoto
            alt="Illustrative photograph of a Swiss residential facade with green shutters."
            caption="Illustrative residential photography; not a Linden property."
            className="lg:pl-2"
            mediaClassName="aspect-[4/3] lg:aspect-[5/4]"
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            src="/images/apartment-facade-swiss.webp"
          />
        </div>
      </section>

      <section className="px-[var(--space-page)] py-20 sm:py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 border-b border-line pb-12 sm:pb-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-olive">
              The approach
            </p>
            <h2 className="max-w-md font-serif text-4xl leading-tight tracking-[-0.035em] text-forest sm:text-5xl">
              Good guidance starts with the person, not the property.
            </h2>
          </div>
          <div className="grid gap-6 text-sm leading-7 text-stone sm:grid-cols-2 sm:gap-8 sm:text-base">
            <p>
              A home search is personal. The fictional Linden approach is to make
              space for different priorities, share clear information, and help
              people explore options at their own pace.
            </p>
            <p>
              The project focuses on Geneva and nearby neighbourhoods including
              Eaux-Vives, Champel, Plainpalais, Carouge, and Cologny. These are
              editorial areas represented in fictional examples, not claims about
              current inventory or market conditions.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="services-title" className="bg-paper px-[var(--space-page)] py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl sm:mb-14">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-olive">
              Ways to explore
            </p>
            <h2 className="font-serif text-4xl leading-tight tracking-[-0.035em] text-forest sm:text-5xl" id="services-title">
              A starting point for each move.
            </h2>
            <p className="mt-5 text-sm leading-7 text-stone sm:text-base">
              The portfolio demonstrates property discovery and enquiry journeys
              for buyers, renters, sellers, and landlords.
            </p>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {services.map((service) => (
              <article className="grid gap-4 py-6 sm:grid-cols-[4rem_0.8fr_1.2fr_auto] sm:items-start sm:gap-6 sm:py-8" key={service.number}>
                <p className="text-xs tracking-[0.16em] text-olive">{service.number}</p>
                <h3 className="font-serif text-2xl text-forest">{service.title}</h3>
                <p className="max-w-lg text-sm leading-6 text-stone">{service.description}</p>
                <Link className="text-sm font-medium text-forest underline decoration-line underline-offset-4 outline-offset-4 hover:decoration-forest" href={service.href}>
                  {service.link}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest px-[var(--space-page)] py-16 text-paper sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-[#d4ddcc]">
              Portfolio demonstration
            </p>
            <h2 className="font-serif text-4xl leading-tight tracking-[-0.035em] sm:text-5xl">
              Fictional agency. Illustrative homes. A real piece of web development.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-6 text-[#f0eee6]">
              Linden &amp; Co., its services, and every property example are fictional.
              Photography is illustrative and does not depict the listed homes.
            </p>
          </div>
          <Link className="inline-flex min-h-12 items-center justify-center self-start border border-paper px-5 py-3 text-sm text-paper outline-offset-4 hover:bg-paper hover:text-forest lg:self-auto" href="/contact">
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
