import { EnquiryPage, enquiryPageMetadata } from "@/components/enquiries/enquiry-page";

export const metadata = enquiryPageMetadata("Contact", "Send a general enquiry to Linden & Co. Real Estate.");

export default function ContactPage() {
  return <EnquiryPage config={{ kind: "contact", eyebrow: "Get in touch", title: "Start a conversation.", intro: "Choose a topic and tell us how we can help. Please leave out sensitive financial or personal information.", formTitle: "Send an enquiry" }} />;
}
