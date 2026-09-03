import { paymentService } from "@/api/services/payment.service";
import type {
  CreatePaymentPayload,
  PaymentResponse,
} from "@/types/payment.types";

export const usePayment = () => {
  const createPayment = async (
    payload: CreatePaymentPayload,
  ): Promise<PaymentResponse> =>
    paymentService.createCreditCardPayment(payload);

  return {
    createPayment,
  };
};
