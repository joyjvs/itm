export interface PaymentAmount {
  value: string;
  currency: string;
}

export interface PaymentRequest {
  identifier: string;
  amount: PaymentAmount;
  lang?: "PT" | "EN" | "ES";
  successUrl?: string;
  failUrl?: string;
  backUrl?: string;
}

export interface CustomerRequest {
  notify?: boolean;
  failOver?: boolean;
}

export interface CreatePaymentPayload {
  payment?: PaymentRequest;
  customer?: CustomerRequest;
  amount?: number;
  currency?: string;
  identifier?: string;
  orderReference?: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  description?: string;
  lang?: "PT" | "EN" | "ES";
  successUrl?: string;
  failUrl?: string;
  backUrl?: string;
  notify?: boolean;
  failOver?: boolean;
  userId: string;
}

export interface PaymentResponse {
  paymentId?: string;
  internalPaymentId?: string;
  paymentUrl?: string;
  redirectUrl?: string;
  status?: string;
}
