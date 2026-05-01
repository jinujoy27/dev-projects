import { Injectable, computed, effect, signal } from '@angular/core';

import { PRODUCTS, PROMO_CODES } from './products.data';
import { CartEntry, CartLine, CartSnapshot, Product, PromoCode } from './storefront.models';

interface PersistedCartState {
  entries: CartEntry[];
  promoCode: string | null;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'atelier-south-cart';
  private readonly productsById = new Map(PRODUCTS.map((product) => [product.id, product]));
  private readonly initialState = this.loadState();
  private readonly entriesState = signal<CartEntry[]>(this.initialState.entries);
  private readonly promoCodeState = signal<string | null>(this.initialState.promoCode);

  readonly items = computed<CartLine[]>(() =>
    this.entriesState().flatMap((entry) => {
      const product = this.productsById.get(entry.productId);

      if (!product) {
        return [];
      }

      const color = product.colors.find(({ name }) => name === entry.colorName) ?? product.colors[0];

      return [
        {
          ...entry,
          key: this.variantKey(entry),
          product,
          color,
          lineTotal: product.price * entry.quantity,
        },
      ];
    }),
  );

  readonly itemCount = computed(() => this.entriesState().reduce((total, entry) => total + entry.quantity, 0));
  readonly subtotal = computed(() => this.items().reduce((total, item) => total + item.lineTotal, 0));
  readonly appliedPromo = computed<PromoCode | null>(
    () => PROMO_CODES.find((promo) => promo.code === this.promoCodeState()) ?? null,
  );
  readonly discount = computed(() => {
    const promo = this.appliedPromo();
    const subtotal = this.subtotal();

    if (!promo || subtotal < promo.minimumSubtotal) {
      return 0;
    }

    return promo.type === 'percentage' ? Math.round(subtotal * promo.value) : promo.value;
  });
  readonly estimatedShipping = computed(() => (this.itemCount() > 0 ? 18 : 0));
  readonly tax = computed(() => Math.round(Math.max(0, this.subtotal() - this.discount()) * 0.1));
  readonly estimatedTotal = computed(
    () => Math.max(0, this.subtotal() - this.discount()) + this.tax() + this.estimatedShipping(),
  );
  readonly activePromoCode = this.promoCodeState.asReadonly();

  constructor() {
    effect(() => this.persistState());
  }

  addToCart(product: Product, size: string, colorName: string, quantity = 1): void {
    const safeQuantity = Math.max(1, Math.min(quantity, 10));

    this.entriesState.update((entries) => {
      const existingIndex = entries.findIndex(
        (entry) =>
          entry.productId === product.id && entry.size === size && entry.colorName.toLowerCase() === colorName.toLowerCase(),
      );

      if (existingIndex === -1) {
        return [...entries, { productId: product.id, size, colorName, quantity: safeQuantity }];
      }

      return entries.map((entry, index) =>
        index === existingIndex ? { ...entry, quantity: Math.min(entry.quantity + safeQuantity, 10) } : entry,
      );
    });

    this.reconcilePromoEligibility();
  }

  updateQuantity(key: string, quantity: number): void {
    const safeQuantity = Math.max(0, Math.min(quantity, 10));

    if (safeQuantity === 0) {
      this.removeItem(key);
      return;
    }

    this.entriesState.update((entries) =>
      entries.map((entry) => (this.variantKey(entry) === key ? { ...entry, quantity: safeQuantity } : entry)),
    );

    this.reconcilePromoEligibility();
  }

  removeItem(key: string): void {
    this.entriesState.update((entries) => entries.filter((entry) => this.variantKey(entry) !== key));
    this.reconcilePromoEligibility();
  }

  clearCart(): void {
    this.entriesState.set([]);
    this.promoCodeState.set(null);
  }

  applyPromoCode(code: string): { success: boolean; message: string } {
    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      return { success: false, message: 'Enter a code to apply an offer.' };
    }

    const promo = PROMO_CODES.find((candidate) => candidate.code === normalizedCode);

    if (!promo) {
      return { success: false, message: 'That code is not part of the current edit.' };
    }

    if (this.subtotal() < promo.minimumSubtotal) {
      const amountRemaining = promo.minimumSubtotal - this.subtotal();
      return {
        success: false,
        message: `Add A$${amountRemaining} more to unlock ${promo.label.toLowerCase()}.`,
      };
    }

    this.promoCodeState.set(promo.code);

    return { success: true, message: promo.label };
  }

  removePromoCode(): void {
    this.promoCodeState.set(null);
  }

  getCartSnapshot(): CartSnapshot {
    return {
      items: this.items(),
      subtotal: this.subtotal(),
      discount: this.discount(),
      promoCode: this.activePromoCode(),
    };
  }

  private reconcilePromoEligibility(): void {
    const promo = this.appliedPromo();

    if (promo && this.subtotal() < promo.minimumSubtotal) {
      this.promoCodeState.set(null);
    }
  }

  private variantKey(entry: CartEntry): string {
    return `${entry.productId}-${entry.size}-${entry.colorName}`.toLowerCase();
  }

  private loadState(): PersistedCartState {
    if (!this.canPersist()) {
      return { entries: [], promoCode: null };
    }

    try {
      const serializedState = localStorage.getItem(this.storageKey);

      if (!serializedState) {
        return { entries: [], promoCode: null };
      }

      const parsedState = JSON.parse(serializedState) as PersistedCartState;

      return {
        entries: Array.isArray(parsedState.entries) ? parsedState.entries : [],
        promoCode: typeof parsedState.promoCode === 'string' ? parsedState.promoCode : null,
      };
    } catch {
      return { entries: [], promoCode: null };
    }
  }

  private persistState(): void {
    if (!this.canPersist()) {
      return;
    }

    localStorage.setItem(
      this.storageKey,
      JSON.stringify({
        entries: this.entriesState(),
        promoCode: this.promoCodeState(),
      }),
    );
  }

  private canPersist(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
