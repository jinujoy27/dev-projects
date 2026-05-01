import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CartService } from '../../core/cart.service';
import { CURRENCY_CODE, PRODUCTS, getProductBySlug } from '../../core/products.data';
import { Product } from '../../core/storefront.models';

@Component({
  selector: 'app-product-detail-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);

  protected readonly currencyCode = CURRENCY_CODE;
  protected readonly product = signal<Product | null>(getProductBySlug(this.route.snapshot.paramMap.get('slug')) ?? null);
  protected readonly selectedSize = signal('');
  protected readonly selectedColorName = signal('');
  protected readonly quantity = signal(1);
  protected readonly addMessage = signal('');
  protected readonly relatedProducts = computed(() => {
    const currentProduct = this.product();

    if (!currentProduct) {
      return [];
    }

    return PRODUCTS.filter(
      (product) =>
        product.id !== currentProduct.id &&
        (product.category === currentProduct.category || product.collection === currentProduct.collection),
    ).slice(0, 3);
  });

  constructor() {
    this.syncProductState(this.product());

    this.route.paramMap.subscribe((paramMap) => {
      const nextProduct = getProductBySlug(paramMap.get('slug')) ?? null;
      this.product.set(nextProduct);
      this.syncProductState(nextProduct);
    });
  }

  protected selectColor(colorName: string): void {
    this.selectedColorName.set(colorName);
  }

  protected selectSize(size: string): void {
    this.selectedSize.set(size);
  }

  protected changeQuantity(direction: number): void {
    this.quantity.update((quantity) => Math.max(1, Math.min(quantity + direction, 10)));
  }

  protected addToBag(product: Product): void {
    this.cartService.addToCart(product, this.selectedSize(), this.selectedColorName(), this.quantity());
    this.addMessage.set(`${product.name} has been added to your bag.`);
  }

  private syncProductState(product: Product | null): void {
    this.selectedSize.set(product?.sizes[0] ?? '');
    this.selectedColorName.set(product?.colors[0]?.name ?? '');
    this.quantity.set(1);
    this.addMessage.set('');
  }
}
