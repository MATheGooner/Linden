"use client";

import Image from "next/image";
import { useState } from "react";
import { nextGalleryIndex } from "@/lib/gallery";

type GalleryImage = { src: string; alt: string };

export function PropertyGallery({ images, title, illustrative }: { images: readonly GalleryImage[]; title: string; illustrative: boolean }) {
  const [active, setActive] = useState(0);
  const image = images[active];
  function move(delta: number) {
    setActive((index) => nextGalleryIndex(index, delta, images.length));
  }
  return (
    <section aria-label={`${title} illustrative photo gallery`} className="min-w-0">
      <div aria-label={illustrative ? "Illustrative property photos. Images are not of this fictional property." : "Property photo gallery"} className="group relative aspect-[4/3] overflow-hidden bg-[#e7e3d9] sm:aspect-[16/10]" onKeyDown={(event) => {
        if (event.key === "ArrowLeft") move(-1);
        if (event.key === "ArrowRight") move(1);
      }} tabIndex={0}>
        <Image alt={image.alt} className="object-cover" fill priority sizes="(min-width: 1024px) 70vw, 100vw" src={image.src} />
        <span className="absolute left-4 top-4 bg-paper/95 px-3 py-2 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-forest">{illustrative ? "Illustrative photography" : "Property photography"}</span>
        {images.length > 1 && <>
          <button aria-label="Previous photo" className="absolute left-3 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center bg-paper/95 text-xl text-forest outline-offset-2 hover:bg-paper focus-visible:outline-2 focus-visible:outline-olive" onClick={() => move(-1)} type="button">‹</button>
          <button aria-label="Next photo" className="absolute right-3 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center bg-paper/95 text-xl text-forest outline-offset-2 hover:bg-paper focus-visible:outline-2 focus-visible:outline-olive" onClick={() => move(1)} type="button">›</button>
        </>}
      </div>
      <div className="mt-3 flex items-center justify-between gap-4 text-xs text-stone">
        <p aria-live="polite">{active + 1} of {images.length} · {image.alt}</p>
        {images.length > 1 && <div aria-label="Choose a photo" className="flex gap-2" role="group">
          {images.map((item, index) => <button aria-current={index === active ? "true" : undefined} aria-label={`Show photo ${index + 1}: ${item.alt}`} className={`h-2.5 w-2.5 rounded-full outline-offset-4 focus-visible:outline-2 focus-visible:outline-olive ${index === active ? "bg-forest" : "bg-[#b8b8aa]"}`} key={item.src} onClick={() => setActive(index)} type="button" />)}
        </div>}
      </div>
    </section>
  );
}
