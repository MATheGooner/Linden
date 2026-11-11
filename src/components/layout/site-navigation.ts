export const siteLinks = [
  { label: "Buy", href: "/properties/for-sale" },
  { label: "Rent", href: "/properties/to-rent" },
  { label: "Sell", href: "/sell" },
  { label: "Landlords", href: "/landlords" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const primaryLinks = siteLinks.slice(0, 5);
