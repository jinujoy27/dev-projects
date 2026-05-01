import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/cart.service';
import {
  CURRENCY_CODE,
  EDITORIAL_PANELS,
  PRODUCT_CATEGORIES,
  PRODUCTS,
  STORE_NAME,
  SUPPORT_EMAIL,
} from '../../core/products.data';
import { Product } from '../../core/storefront.models';

@Component({
  selector: 'app-home-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  protected readonly cartService = inject(CartService);
  protected readonly currencyCode = CURRENCY_CODE;
  protected readonly editorialPanels = EDITORIAL_PANELS;
  protected readonly storeName = STORE_NAME;
  protected readonly supportEmail = SUPPORT_EMAIL;
  protected readonly heroProduct = PRODUCTS[0];
  protected readonly featureProduct = PRODUCTS[4];
  protected readonly categories = ['All', ...PRODUCT_CATEGORIES];
  protected readonly selectedCategory = signal('All');
  protected readonly feedbackMessage = signal('');
  protected readonly filteredProducts = computed(() => {
    const selectedCategory = this.selectedCategory();

    if (selectedCategory === 'All') {
      return PRODUCTS;
    }

    return PRODUCTS.filter((product) => product.category === selectedCategory);
  });

  protected setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  protected quickAdd(product: Product): void {
    this.cartService.addToCart(product, product.sizes[0], product.colors[0].name, 1);
    this.feedbackMessage.set(`${product.name} added to your bag.`);
  }
}
