import { describe, expect, it } from "vitest";
import {
  BILLING_PHONE_MESSAGE,
  GENERIC_ORDER_ERROR,
  NOT_APPROVED_MESSAGE,
  PRODUCT_UNAVAILABLE_MESSAGE,
  STATE_REQUIRED_MESSAGE,
  missingBillingPhone,
  orderErrorMessage,
} from "./checkoutErrors";

describe("missingBillingPhone", () => {
  it("flags saved addresses without a usable phone", () => {
    expect(missingBillingPhone({ phone: null })).toBe(true);
    expect(missingBillingPhone({ phone: "" })).toBe(true);
    expect(missingBillingPhone({ phone: "   " })).toBe(true);
    expect(missingBillingPhone({})).toBe(true);
    expect(missingBillingPhone(null)).toBe(true);
  });

  it("accepts an address with a phone", () => {
    expect(missingBillingPhone({ phone: "603-555-0100" })).toBe(false);
  });
});

describe("orderErrorMessage", () => {
  it("explains a missing billing phone instead of blaming the products", () => {
    const response = { status: 422, data: { message: "The billing phone field is required.", errors: { billing_phone: ["The billing phone field is required."] } } };
    expect(orderErrorMessage(response)).toBe(BILLING_PHONE_MESSAGE);
  });

  it("explains an invalid (too long) billing phone", () => {
    const response = { status: 422, data: { errors: { billing_phone: ["The billing phone field must not be greater than 20 characters."] } } };
    expect(orderErrorMessage(response)).toBe(BILLING_PHONE_MESSAGE);
  });

  it("keeps the product message for unavailable products", () => {
    expect(orderErrorMessage({ status: 422, data: { message: "Product ID 12 is unavailable or out of stock" } })).toBe(PRODUCT_UNAVAILABLE_MESSAGE);
    expect(orderErrorMessage({ status: 422, data: { errors: { "items.0.product_id": ["The selected items.0.product_id is invalid."] } } })).toBe(PRODUCT_UNAVAILABLE_MESSAGE);
  });

  it("shows the server's message for other invalid address fields", () => {
    const message = orderErrorMessage({ status: 422, data: { errors: { shipping_postcode: ["The shipping postcode field must not be greater than 20 characters."] } } });
    expect(message).toContain("check your address details");
    expect(message).toContain("shipping postcode");
    expect(message).not.toBe(PRODUCT_UNAVAILABLE_MESSAGE);
  });

  it("keeps the approval and generic messages", () => {
    expect(orderErrorMessage({ status: 403 })).toBe(NOT_APPROVED_MESSAGE);
    expect(orderErrorMessage({ status: 500 })).toBe(GENERIC_ORDER_ERROR);
    expect(orderErrorMessage(undefined)).toBe(GENERIC_ORDER_ERROR);
  });
});

describe("orderErrorMessage: no state", () => {
  it("shows the server message when the order has no state", () => {
    const message = "Please add your state to your address. Tax depends on it, so an order needs one.";
    expect(orderErrorMessage({ status: 422, data: { message, errors: { billing_state: [message] } } })).toBe(message);
  });

  it("falls back to its own message when the server sent none", () => {
    expect(orderErrorMessage({ status: 422, data: { errors: { billing_state: ["required"] } } })).toBe(STATE_REQUIRED_MESSAGE);
  });
});
