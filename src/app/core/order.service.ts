import { Injectable, computed, effect, signal } from '@angular/core';
import { map, timer } from 'rxjs';

import { CartSnapshot, CheckoutPayload, OrderRecord } from './storefront.models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly storageKey = 'atelier-south-orders';
  private readonly ordersState = signal<OrderRecord[]>(this.loadOrders());

  readonly latestOrder = computed(() => this.ordersState()[0] ?? null);

  constructor() {
    effect(() => this.persistOrders());
  }

  placeOrder(checkout: CheckoutPayload, cartSnapshot: CartSnapshot, tax: number, total: number) {
    const orderRecord: OrderRecord = {
      id: this.generateOrderId(),
      placedAt: new Date().toISOString(),
      customer: checkout.customer,
      delivery: checkout.delivery,
      items: cartSnapshot.items,
      subtotal: cartSnapshot.subtotal,
      discount: cartSnapshot.discount,
      tax,
      total,
      promoCode: cartSnapshot.promoCode,
      paymentLast4: checkout.payment.cardNumber.replace(/\D/g, '').slice(-4),
      notes: checkout.notes,
      estimatedArrival: checkout.delivery.eta,
    };

    return timer(1200).pipe(
      map(() => {
        this.ordersState.update((orders) => [orderRecord, ...orders].slice(0, 12));
        return orderRecord;
      }),
    );
  }

  getOrderById(orderId: string | null): OrderRecord | null {
    if (!orderId) {
      return null;
    }

    return this.ordersState().find((order) => order.id === orderId) ?? null;
  }

  private loadOrders(): OrderRecord[] {
    if (!this.canPersist()) {
      return [];
    }

    try {
      const serializedOrders = localStorage.getItem(this.storageKey);
      return serializedOrders ? (JSON.parse(serializedOrders) as OrderRecord[]) : [];
    } catch {
      return [];
    }
  }

  private persistOrders(): void {
    if (!this.canPersist()) {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(this.ordersState()));
  }

  private canPersist(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private generateOrderId(): string {
    const year = new Date().getFullYear();
    const token = Math.random().toString(36).slice(2, 7).toUpperCase();

    return `AS-${year}-${token}`;
  }
}
