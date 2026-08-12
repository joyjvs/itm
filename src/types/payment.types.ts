export interface CreatePaymentPayload {
  amount: number;
  currency?: string;
  orderReference: string;
  customerEmail: string;
  description?: string;
}

export interface PaymentResponse {
  paymentUrl: string;
  internalPaymentId: string;
  status?: string;
}
