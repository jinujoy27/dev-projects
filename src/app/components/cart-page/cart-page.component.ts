import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/cart.service';
import { CURRENCY_CODE, PRODUCTS } from '../../core/products.data';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent {
  protected readonly cartService = inject(CartService);
  protected readonly currencyCode = CURRENCY_CODE;
  protected readonly promoDraft = signal('');
  protected readonly promoMessage = signal('');
  protected readonly promoSuccess = signal(false);
  protected readonly recommendedProducts = computed(() => {
    const productIdsInCart = new Set(this.cartService.items().map((item) => item.product.id));
    const leadCategory = this.cartService.items()[0]?.product.category;

    return PRODUCTS.filter(
      (product) =>
        !productIdsInCart.has(product.id) && (!leadCategory || product.category === leadCategory || product.category === 'Essentials'),
    ).slice(0, 3);
  });

  protected updatePromoDraft(event: Event): void {
    const nextValue = (event.target as HTMLInputElement).value;
    this.promoDraft.set(nextValue);
  }

  protected applyPromo(): void {
    const result = this.cartService.applyPromoCode(this.promoDraft());
    this.promoSuccess.set(result.success);
    this.promoMessage.set(result.message);

    if (result.success) {
      this.promoDraft.set('');
    }
  }

  protected removePromo(): void {
    this.cartService.removePromoCode();
    this.promoSuccess.set(true);
    this.promoMessage.set('Offer removed from this bag.');
  }

  protected updateQuantity(key: string, quantity: number): void {
    this.cartService.updateQuantity(key, quantity);
  }

  protected removeItem(key: string): void {
    this.cartService.removeItem(key);
  }
}
