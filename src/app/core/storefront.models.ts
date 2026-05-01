export type ProductSilhouette = 'coat' | 'dress' | 'knit' | 'tailoring' | 'essentials';

export interface ProductColor {
  name: string;
  swatch: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  collection: string;
  price: number;
  originalPrice?: number;
  description: string;
  story: string;
  fit: string;
  fabric: string;
  highlights: string[];
  sizes: string[];
  colors: ProductColor[];
  palette: [string, string, string];
  silhouette: ProductSilhouette;
  badge?: string;
}

export interface CartEntry {
  productId: number;
  size: string;
  colorName: string;
  quantity: number;
}

export interface CartLine extends CartEntry {
  key: string;
  product: Product;
  color: ProductColor;
  lineTotal: number;
}

export interface CartSnapshot {
  items: CartLine[];
  subtotal: number;
  discount: number;
  promoCode: string | null;
}

export interface PromoCode {
  code: string;
  label: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimumSubtotal: number;
}

export interface DeliveryOption {
  id: string;
  label: string;
  description: string;
  eta: string;
  price: number;
}

export interface CheckoutCustomer {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface PaymentDetails {
  cardholder: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export interface CheckoutPayload {
  customer: CheckoutCustomer;
  delivery: DeliveryOption;
  payment: PaymentDetails;
  notes: string;
}

export interface OrderRecord {
  id: string;
  placedAt: string;
  customer: CheckoutCustomer;
  delivery: DeliveryOption;
  items: CartLine[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  promoCode: string | null;
  paymentLast4: string;
  notes: string;
  estimatedArrival: string;
}
