import Image from "next/image";

type EditorialPhotoProps = {
  alt: string;
  caption: string;
  className?: string;
  mediaClassName: string;
  priority?: boolean;
  sizes: string;
  src: string;
};

export function EditorialPhoto({
  alt,
  caption,
  className,
  mediaClassName,
  priority = false,
  sizes,
  src,
}: EditorialPhotoProps) {
  return (
    <figure className={className}>
      <div className={`group relative overflow-hidden bg-[#e7e3d9] ${mediaClassName}`}>
        <Image
          alt={alt}
          className="object-cover transition-transform duration-700 motion-reduce:transition-none motion-safe:group-hover:scale-[1.025]"
          fill
          priority={priority}
          sizes={sizes}
          src={src}
        />
      </div>
      <figcaption className="mt-3 text-xs tracking-[0.04em] text-stone">
        {caption}
      </figcaption>
    </figure>
  );
}
