import type { Metadata } from "next";
import { EnquiryForm, type EnquiryKind } from "./enquiry-form";

type EnquiryPageConfig = { kind: Exclude<EnquiryKind, "viewing">; eyebrow: string; title: string; intro: string; formTitle: string };

export function enquiryPageMetadata(title: string, description: string): Metadata {
  return { title: `${title} | Linden & Co. Real Estate`, description };
}

export function EnquiryPage({ config }: { config: EnquiryPageConfig }) {
  return <>
    <section className="bg-paper px-[var(--space-page)]"><div className="mx-auto max-w-7xl py-14 sm:py-20 lg:py-24">
      <p className="mb-5 text-xs font-medium uppercase tracking-[0.22em] text-olive">{config.eyebrow}</p>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-end"><h1 className="max-w-4xl font-serif text-[clamp(3rem,7vw,6rem)] leading-[0.98] tracking-[-0.05em] text-forest">{config.title}</h1><p className="max-w-lg text-base leading-7 text-stone lg:justify-self-end">{config.intro}</p></div>
    </div></section>
    <section className="px-[var(--space-page)] py-14 sm:py-20"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1fr] lg:gap-16">
      <div className="max-w-md"><h2 className="font-serif text-3xl leading-tight text-forest sm:text-4xl">{config.formTitle}</h2><p className="mt-4 text-sm leading-7 text-stone">Share a few details and the nature of your enquiry. Fields marked with an asterisk are required.</p></div>
      <EnquiryForm kind={config.kind} />
    </div></section>
  </>;
}
