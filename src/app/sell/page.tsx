import { EnquiryPage, enquiryPageMetadata } from "@/components/enquiries/enquiry-page";

export const metadata = enquiryPageMetadata("Selling your property", "Share a few details to request a property valuation from Linden & Co.");

export default function SellPage() {
  return <EnquiryPage config={{ kind: "valuation", eyebrow: "For sellers", title: "A considered next step.", intro: "If you are thinking about selling, tell us a little about the property and we can prepare for a conversation about a valuation.", formTitle: "Request a valuation" }} />;
}
