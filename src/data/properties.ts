export type TransactionType = "sale" | "rent";
export type PropertyType = "Apartment" | "Townhouse" | "Villa";
export type PropertyImage = { src: string; alt: string };

export type DemoProperty = {
  id: string;
  slug: string;
  title: string;
  transactionType: TransactionType;
  propertyType: PropertyType;
  area: string;
  priceChf: number;
  bedrooms: number;
  bathrooms: number;
  areaSqM: number;
  description: string;
  image: PropertyImage;
  gallery: PropertyImage[];
  featured: boolean;
  availabilityStatus: "fictional-demo";
  listedAt: string;
};

export type PropertyRecord = Omit<DemoProperty, "availabilityStatus"> & {
  publicLocation: string;
  keyFeatures: string[];
  isFictional: boolean;
  publicationStatus: "draft" | "published" | "demo";
  availabilityStatus: "fictional-demo" | "published";
};

type DemoPropertySource = Omit<DemoProperty, "image" | "gallery">;

const image = (src: string, alt: string): PropertyImage => ({ src: `/images/${src}.webp`, alt });

// These are licensed stock photographs for fictional portfolio examples. They are not photos of the listed homes.
const galleryBySlug: Record<string, [PropertyImage, PropertyImage]> = {
  "eaux-vives-courtyard-apartment": [
    image("apartment-living-a", "Sunlit living room with broad windows and a dining area"),
    image("apartment-bedroom-c", "Bedroom opening toward a bright adjoining room"),
  ],
  "champel-family-apartment": [
    image("living-room-mid-century", "Open living room with a connected kitchen and seating area"),
    image("apartment-bedroom-f", "Calm bedroom with a woven headboard and soft evening light"),
  ],
  "plainpalais-city-apartment": [
    image("apartment-living-b", "Loft-style living room with exposed brick and balcony doors"),
    image("apartment-bedroom-a", "Bright attic bedroom beneath a pitched ceiling"),
  ],
  "carouge-townhouse": [
    image("townhouse-row-houses", "Traditional European residential façades with green shutters"),
    image("townhouse-stone-b", "Stone residential entrance with blue doors and paved street"),
  ],
  "cologny-garden-villa": [
    image("villa-stone-a", "Leaf-covered stone residence among mature greenery"),
    image("living-kitchen-natural", "Warm living and dining space connected to a kitchen"),
  ],
  "eaux-vives-balcony-home": [
    image("apartment-living-d", "Living room with a wide glass door facing a wooded terrace"),
    image("living-room-wood", "Bright sitting room with tall windows and a sofa"),
  ],
  "champel-villa-terrace": [
    image("villa-garden-tree", "Detached home partly screened by a large garden tree"),
    image("living-room-green", "Open-plan living and dining room with natural materials"),
  ],
  "plainpalais-townhouse": [
    image("townhouse-stone-c", "Stone residential façade with a small front garden"),
    image("apartment-bedroom-b", "Warm bedroom with timber details and natural light"),
  ],
  "eaux-vives-riverside-rental": [
    image("apartment-living-c", "Living and dining room beside a broad window"),
    image("apartment-bedroom-d", "Bedroom detail with a bedside lamp and soft bedding"),
  ],
  "champel-family-rental": [
    image("apartment-living-e", "Traditional sitting room with tall windows and a reading chair"),
    image("apartment-bedroom-e", "Bedroom with a large window and pale timber furniture"),
  ],
  "plainpalais-studio-rental": [
    image("apartment-living-f", "Compact apartment kitchen opening into a dining space"),
    image("apartment-facade-brick", "Residential apartment façade with repeating windows and balconies"),
  ],
  "carouge-townhouse-rental": [
    image("townhouse-european-facade", "European residential façade with blue shutters and balconies"),
    image("carouge-street", "Pastel residential façades and a bicycle-lined street"),
  ],
  "cologny-garden-rental": [
    image("villa-garden-a", "Leafy residential garden with a house visible beyond the planting"),
    image("villa-house-garden", "Close view of a home exterior beside mature garden planting"),
  ],
  "eaux-vives-modern-rental": [
    image("apartment-facade-swiss", "Swiss residential façade with dark green shutters"),
    image("geneva-facade", "Stone residential façade with shuttered windows"),
  ],
};

const retainedLegacyImages: PropertyImage[] = [
  { src: "/images/buy-interior.jpg", alt: "Pre-existing residential interior photograph" },
  { src: "/images/carouge-street.jpg", alt: "Pre-existing residential street photograph" },
  { src: "/images/geneva-architecture.jpg", alt: "Pre-existing city architecture photograph" },
  { src: "/images/geneva-facade.jpg", alt: "Pre-existing residential façade photograph" },
  { src: "/images/geneva-old-town.jpg", alt: "Pre-existing historic street photograph" },
  { src: "/images/paris-bedroom.jpg", alt: "Pre-existing bedroom photograph" },
];

export const illustrativeGalleryImages: PropertyImage[] = [
  ...Object.values(galleryBySlug).flat(),
  ...retainedLegacyImages,
];

// Fictional portfolio examples only. They do not describe real homes or availability.
const demoPropertySource: DemoPropertySource[] = [
  { id: "demo-001", slug: "eaux-vives-courtyard-apartment", title: "A calm courtyard apartment", transactionType: "sale", propertyType: "Apartment", area: "Eaux-Vives", priceChf: 1240000, bedrooms: 2, bathrooms: 2, areaSqM: 96, description: "A light-filled home with generous proportions and a quiet courtyard outlook.", featured: true, availabilityStatus: "fictional-demo", listedAt: "2025-04-18" },
  { id: "demo-002", slug: "champel-family-apartment", title: "A considered family home", transactionType: "sale", propertyType: "Apartment", area: "Champel", priceChf: 1890000, bedrooms: 3, bathrooms: 2, areaSqM: 142, description: "A spacious apartment imagined for easy everyday living and slow weekends.", featured: true, availabilityStatus: "fictional-demo", listedAt: "2025-03-27" },
  { id: "demo-003", slug: "plainpalais-city-apartment", title: "A city apartment with character", transactionType: "sale", propertyType: "Apartment", area: "Plainpalais", priceChf: 895000, bedrooms: 2, bathrooms: 1, areaSqM: 81, description: "An elegant, compact base close to the life of the neighbourhood.", featured: false, availabilityStatus: "fictional-demo", listedAt: "2025-02-12" },
  { id: "demo-004", slug: "carouge-townhouse", title: "A townhouse on a quiet lane", transactionType: "sale", propertyType: "Townhouse", area: "Carouge", priceChf: 2350000, bedrooms: 4, bathrooms: 3, areaSqM: 188, description: "A fictional town house with room to gather and a small private terrace.", featured: true, availabilityStatus: "fictional-demo", listedAt: "2025-05-02" },
  { id: "demo-005", slug: "cologny-garden-villa", title: "A garden villa above the lake", transactionType: "sale", propertyType: "Villa", area: "Cologny", priceChf: 4850000, bedrooms: 5, bathrooms: 4, areaSqM: 312, description: "A generous imagined retreat framed by mature planting and open skies.", featured: true, availabilityStatus: "fictional-demo", listedAt: "2025-01-20" },
  { id: "demo-006", slug: "eaux-vives-balcony-home", title: "A bright home with a balcony", transactionType: "sale", propertyType: "Apartment", area: "Eaux-Vives", priceChf: 1490000, bedrooms: 3, bathrooms: 2, areaSqM: 118, description: "A balanced city home with outdoor space for morning coffee.", featured: false, availabilityStatus: "fictional-demo", listedAt: "2025-04-02" },
  { id: "demo-007", slug: "champel-villa-terrace", title: "A villa with a long terrace", transactionType: "sale", propertyType: "Villa", area: "Champel", priceChf: 3290000, bedrooms: 4, bathrooms: 3, areaSqM: 246, description: "A fictional leafy residence with indoor and outdoor rooms in balance.", featured: false, availabilityStatus: "fictional-demo", listedAt: "2024-12-08" },
  { id: "demo-008", slug: "plainpalais-townhouse", title: "A townhouse made for city life", transactionType: "sale", propertyType: "Townhouse", area: "Plainpalais", priceChf: 1760000, bedrooms: 3, bathrooms: 2, areaSqM: 154, description: "A welcoming fictional home with a thoughtful, flexible layout.", featured: false, availabilityStatus: "fictional-demo", listedAt: "2025-03-08" },
  { id: "demo-009", slug: "eaux-vives-riverside-rental", title: "A tranquil riverside apartment", transactionType: "rent", propertyType: "Apartment", area: "Eaux-Vives", priceChf: 3900, bedrooms: 2, bathrooms: 1, areaSqM: 88, description: "A fictional rental home with an easy, light-filled living space.", featured: true, availabilityStatus: "fictional-demo", listedAt: "2025-05-10" },
  { id: "demo-010", slug: "champel-family-rental", title: "A generous home in Champel", transactionType: "rent", propertyType: "Apartment", area: "Champel", priceChf: 5200, bedrooms: 3, bathrooms: 2, areaSqM: 136, description: "A fictional long-stay home with room for a family or shared study.", featured: true, availabilityStatus: "fictional-demo", listedAt: "2025-04-22" },
  { id: "demo-011", slug: "plainpalais-studio-rental", title: "A well-planned city apartment", transactionType: "rent", propertyType: "Apartment", area: "Plainpalais", priceChf: 2450, bedrooms: 1, bathrooms: 1, areaSqM: 54, description: "A compact fictional home with space to work, rest and recharge.", featured: false, availabilityStatus: "fictional-demo", listedAt: "2025-02-28" },
  { id: "demo-012", slug: "carouge-townhouse-rental", title: "A townhouse in the heart of Carouge", transactionType: "rent", propertyType: "Townhouse", area: "Carouge", priceChf: 6100, bedrooms: 4, bathrooms: 2, areaSqM: 176, description: "A fictional townhouse with generous rooms and neighbourhood character.", featured: true, availabilityStatus: "fictional-demo", listedAt: "2025-05-06" },
  { id: "demo-013", slug: "cologny-garden-rental", title: "A garden home with room to unwind", transactionType: "rent", propertyType: "Villa", area: "Cologny", priceChf: 9800, bedrooms: 5, bathrooms: 3, areaSqM: 268, description: "A fictional villa framed by greenery, with space for guests and hobbies.", featured: false, availabilityStatus: "fictional-demo", listedAt: "2025-01-30" },
  { id: "demo-014", slug: "eaux-vives-modern-rental", title: "A light apartment near the lake", transactionType: "rent", propertyType: "Apartment", area: "Eaux-Vives", priceChf: 3350, bedrooms: 2, bathrooms: 1, areaSqM: 76, description: "A fictional apartment with a simple plan and calm interior palette.", featured: false, availabilityStatus: "fictional-demo", listedAt: "2025-03-14" },
];

export const demoProperties: PropertyRecord[] = demoPropertySource.map((property) => {
  const gallery = galleryBySlug[property.slug];
  return {
    ...property,
    image: gallery[0],
    gallery: gallery.map((photo) => ({ ...photo })),
    publicLocation: `${property.area}, Geneva`,
    keyFeatures: [],
    isFictional: true,
    publicationStatus: "demo",
  };
});
