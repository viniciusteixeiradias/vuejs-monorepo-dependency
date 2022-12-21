enum PaymentMethod {
  CARD = 'Card',
  CASH = 'Cash'
}

type PaymentMethodType = 'Cash' | 'Card';

interface Payment {
  status?: string;
  method?: PaymentMethodType;
  stripeToken?: string;
  stripeTokenPaymentMethod?: string;
  cardType?: string;
  serviceFee?: number;
  last4digits?: string;
  billingAddressLine1?: string;
  billingAddressLine2?: string;
  billingCity?: string;
  billingCountry?: string;
  billingRegion?: string;
  cardHolderName?: string;
  customer?: string;
  value?: number;
}
