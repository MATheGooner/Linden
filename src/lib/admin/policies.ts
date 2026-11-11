export function isDuplicateSlugError(error: unknown) {
  if (typeof error !== "object" || error === null) return false;
  if ("code" in error && error.code === "23505") return true;
  return "cause" in error && typeof error.cause === "object" && error.cause !== null && "code" in error.cause && error.cause.code === "23505";
}

export function shouldBlockPropertyDeletion(referencingEnquiryCount: number) {
  return referencingEnquiryCount > 0;
}
