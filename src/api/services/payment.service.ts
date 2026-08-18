import axiosClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  CreatePaymentPayload,
  PaymentResponse,
} from "../../types/payment.types";

const normalizePaymentResponse = (payload: unknown): PaymentResponse => {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  let source = payload as Record<string, unknown>;

  if ("data" in source && source.data && typeof source.data === "object") {
    source = source.data as Record<string, unknown>;
  }

  if (
    "payment" in source &&
    source.payment &&
    typeof source.payment === "object"
  ) {
    source = source.payment as Record<string, unknown>;
  }

  return {
    paymentId:
      typeof source.paymentId === "string" ? source.paymentId : undefined,
    internalPaymentId:
      typeof source.internalPaymentId === "string"
        ? source.internalPaymentId
        : undefined,
    paymentUrl:
      typeof source.paymentUrl === "string" ? source.paymentUrl : undefined,
    redirectUrl:
      typeof source.redirectUrl === "string" ? source.redirectUrl : undefined,
    status:
      typeof source.status === "string"
        ? source.status
        : typeof source.transactionStatus === "string"
          ? source.transactionStatus
          : undefined,
  };
};

export const paymentService = {
  createCreditCardPayment: async (
    payload: CreatePaymentPayload,
  ): Promise<PaymentResponse> => {
    const response = await axiosClient.post(
      ENDPOINTS.PAYMENTS.CREDIT_CARD,
      payload,
    );
    return normalizePaymentResponse(response.data);
  },
};
