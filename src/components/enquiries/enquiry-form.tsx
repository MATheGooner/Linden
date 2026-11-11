"use client";

import { useState, type FormEvent } from "react";

export type EnquiryKind = "viewing" | "valuation" | "landlord" | "contact";
type PropertyReference = { id: string; slug: string; title: string };
type EnquiryFormProps = { kind: EnquiryKind; property?: PropertyReference };
type FieldName = "name" | "email" | "phone" | "preferredDateTime" | "location" | "propertyType" | "category" | "message";
type FormValues = Record<FieldName | "website", string>;
type Field = { name: FieldName; label: string; type?: string; required?: boolean; options?: string[]; wide?: boolean };

const fieldsByKind: Record<EnquiryKind, Field[]> = {
  viewing: [
    { name: "name", label: "Name", required: true }, { name: "email", label: "Email address", type: "email", required: true },
    { name: "phone", label: "Phone number (optional)", type: "tel" }, { name: "preferredDateTime", label: "Preferred date and time (optional)", type: "datetime-local" },
    { name: "message", label: "Message (optional)", wide: true },
  ],
  valuation: [
    { name: "name", label: "Name", required: true }, { name: "email", label: "Email address", type: "email", required: true },
    { name: "phone", label: "Phone number", type: "tel", required: true }, { name: "location", label: "Property address or area", required: true, wide: true },
    { name: "propertyType", label: "Property type", required: true, options: ["Apartment", "Townhouse", "Villa", "Other"] }, { name: "message", label: "Additional details (optional)", wide: true },
  ],
  landlord: [
    { name: "name", label: "Name", required: true }, { name: "email", label: "Email address", type: "email", required: true },
    { name: "phone", label: "Phone number (optional)", type: "tel" }, { name: "location", label: "Property location", required: true, wide: true },
    { name: "propertyType", label: "Property type", required: true, options: ["Apartment", "Townhouse", "Villa", "Other"] }, { name: "message", label: "Message (optional)", wide: true },
  ],
  contact: [
    { name: "name", label: "Name", required: true }, { name: "email", label: "Email address", type: "email", required: true },
    { name: "category", label: "Enquiry category", required: true, options: ["Buying", "Renting", "Selling", "Letting", "Other"] },
    { name: "message", label: "How can we help?", required: true, wide: true },
  ],
};

const inputClass = "mt-2 min-h-12 w-full border border-line bg-paper px-3 text-base text-charcoal outline-offset-2 focus-visible:outline-2 focus-visible:outline-olive";
const initialFields = (): FormValues => ({ name: "", email: "", phone: "", preferredDateTime: "", location: "", propertyType: "", category: "", message: "", website: "" });

export function EnquiryForm({ kind, property }: EnquiryFormProps) {
  const [values, setValues] = useState(initialFields);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<{ tone: "error" | "saved"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setStatus(null);
    if (!event.currentTarget.reportValidity()) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind, ...values, property, website: "" }),
      });
      const result: { status?: string; message?: string; fields?: Record<string, string> } = await response.json();
      if (result.status === "saved") {
        setStatus({ tone: "saved", message: result.message ?? "Your enquiry has been saved." });
        setValues(initialFields());
      } else {
        const fieldErrors: Partial<Record<FieldName, string>> = {};
        for (const [field, message] of Object.entries(result.fields ?? {})) {
          if (field in values) fieldErrors[field as FieldName] = message;
        }
        setErrors(fieldErrors);
        setStatus({ tone: "error", message: result.message ?? "We could not save your enquiry. Your details remain in this form." });
      }
    } catch {
      setStatus({ tone: "error", message: "We could not reach the enquiry service. Your details remain in this form; please try again later." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="border-y border-line py-6 sm:py-8" noValidate onSubmit={submit}>
      {property && <div className="mb-6 border-b border-line pb-5"><p className="text-xs font-medium uppercase tracking-[0.14em] text-olive">Property reference {property.id.toUpperCase()}</p><p className="mt-1 font-serif text-xl text-forest">{property.title}</p></div>}
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"><label htmlFor={`${kind}-website`}>Leave this field empty<input autoComplete="off" id={`${kind}-website`} name="website" onChange={(event) => setValues((current) => ({ ...current, website: event.target.value }))} tabIndex={-1} value={values.website} /></label></div>
      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
        {fieldsByKind[kind].map((field) => {
          const id = `${kind}-${field.name}`;
          const error = errors[field.name];
          return <div className={field.wide ? "sm:col-span-2" : ""} key={field.name}>
            <label className="block text-sm font-medium text-charcoal" htmlFor={id}>{field.label}{field.required && <span aria-hidden="true" className="ml-1 text-olive">*</span>}{field.required && <span className="sr-only"> (required)</span>}</label>
            {field.name === "message" ? <textarea aria-describedby={error ? `${id}-error` : undefined} aria-invalid={Boolean(error)} className={`${inputClass} min-h-32 py-3`} id={id} maxLength={2000} name={field.name} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))} required={field.required} value={values[field.name]} /> : field.options ? <select aria-describedby={error ? `${id}-error` : undefined} aria-invalid={Boolean(error)} className={inputClass} id={id} name={field.name} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))} required={field.required} value={values[field.name]}><option value="">Choose an option</option>{field.options.map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input aria-describedby={error ? `${id}-error` : undefined} aria-invalid={Boolean(error)} autoComplete={field.name === "name" ? "name" : field.name === "email" ? "email" : field.name === "phone" ? "tel" : undefined} className={inputClass} id={id} maxLength={field.name === "email" ? 254 : 240} name={field.name} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))} required={field.required} type={field.type ?? "text"} value={values[field.name]} />}
            {error && <p className="mt-1 text-sm text-[#8b3027]" id={`${id}-error`}>{error}</p>}
          </div>;
        })}
      </div>
      {status && <p aria-live="assertive" className={`mt-5 border-l-2 py-2 pl-3 text-sm leading-6 ${status.tone === "saved" ? "border-olive text-forest" : "border-[#8b3027] text-[#76251f]"}`} role={status.tone === "error" ? "alert" : "status"}>{status.message}</p>}
      <button className="mt-6 inline-flex min-h-12 w-full items-center justify-center bg-forest px-5 text-sm font-medium text-paper outline-offset-4 hover:bg-[#1b3027] disabled:cursor-wait disabled:opacity-60 sm:w-auto" disabled={submitting} type="submit">{submitting ? "Checking details…" : kind === "viewing" ? "Send viewing request" : kind === "valuation" ? "Request a valuation" : kind === "landlord" ? "Send landlord enquiry" : "Send enquiry"}</button>
      <p className="mt-4 text-xs leading-5 text-stone">Required fields are marked with *. We confirm only after the database saves your enquiry; a failed request leaves your details in this form.</p>
    </form>
  );
}
