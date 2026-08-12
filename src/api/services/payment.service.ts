import axiosClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  CreatePaymentPayload,
  PaymentResponse,
} from "../../types/payment.types";

export const paymentService = {
  createCreditCardPayment: async (
    payload: CreatePaymentPayload,
  ): Promise<PaymentResponse> => {
    const response = await axiosClient.post(
      ENDPOINTS.PAYMENTS.CREDIT_CARD,
      payload,
    );
    return response.data as PaymentResponse;
  },
};
