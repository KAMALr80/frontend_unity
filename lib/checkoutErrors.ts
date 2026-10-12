/**
 * Messages for a failed POST /orders. The API answers 422 both for unavailable products
 * ({ message } only, or field errors on items.*) and for invalid address fields ({ errors }),
 * so the message is chosen from what the server actually rejected.
 */
export const PRODUCT_UNAVAILABLE_MESSAGE = "One or more products are no longer available. Please review your cart.";
export const BILLING_PHONE_MESSAGE =
  "Your billing address needs a phone number (up to 20 characters). Edit the address to add one, then place the order.";
export const NOT_APPROVED_MESSAGE = "Your account is not approved for ordering yet.";
export const GENERIC_ORDER_ERROR = "Failed to place order. Please try again.";

interface OrderErrorResponse {
  status?: number;
  data?: { message?: string; errors?: Record<string, string[] | string> };
}

/** The order API requires billing_phone; saved addresses may not have one. */
export function missingBillingPhone(address: { phone?: string | null } | null | undefined): boolean {
  return !address?.phone?.trim();
}

export function orderErrorMessage(response: OrderErrorResponse | undefined): string {
  if (response?.status === 403) return NOT_APPROVED_MESSAGE;
  if (response?.status !== 422) return GENERIC_ORDER_ERROR;

  const errors = response.data?.errors;
  const fields = errors ? Object.keys(errors) : [];
  if (fields.length === 0 || fields.some((field) => field.startsWith("items"))) return PRODUCT_UNAVAILABLE_MESSAGE;
  if (fields.includes("billing_phone")) return BILLING_PHONE_MESSAGE;

  const details = fields
    .slice(0, 2)
    .map((field) => {
      const value = errors![field];
      return Array.isArray(value) ? value[0] : value;
    })
    .filter(Boolean)
    .join(" ");
  return `Please check your address details. ${details}`.trim();
}
