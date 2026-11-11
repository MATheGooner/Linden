import { EnquiryPage, enquiryPageMetadata } from "@/components/enquiries/enquiry-page";

export const metadata = enquiryPageMetadata("For landlords", "Send a landlord enquiry about a property in Geneva.");

export default function LandlordsPage() {
  return <EnquiryPage config={{ kind: "landlord", eyebrow: "For landlords", title: "Thoughtful property care.", intro: "For questions about letting or managing a property, share its location and a few details about what you are considering.", formTitle: "Landlord enquiry" }} />;
}
